from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Conversation, Message
from datetime import datetime
import os
import openai


conversation_routes = Blueprint('conversations', __name__)
openai.api_key = os.getenv("OPEN_AI_KEY")


# Get conversation by ID
@conversation_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_conversation(id):
    # Query for the conversation by ID
    conversation = Conversation.query.get(id)

    if not conversation:
        return {'error': 'Conversation not found'}, 404

    # Retrieve messages associated with the conversation
    messages = Message.query.filter_by(conversation_id=conversation.id).all()
    messages_data = [message.to_dict() for message in messages]

    # Convert the conversation and messages to dictionaries
    conversation_data = conversation.to_dict()
    conversation_data['messages'] = messages_data

    return conversation_data


# Get conversations for the current user
@conversation_routes.route('', methods=['GET'])
@login_required
def get_conversations():
    # Query for the conversations associated with the current user
    conversations = Conversation.query.filter_by(user_id=current_user.id).all()

    if not conversations:
        # If no conversations exist for the user, create a new one
        conversation = Conversation(user_id=current_user.id, title="New Conversation")
        db.session.add(conversation)
        db.session.commit()

        conversations = [conversation]

    # Convert conversations to dictionaries
    conversations_data = [conversation.to_dict() for conversation in conversations]

    return {'conversations': conversations_data}



# Update conversation by id
@conversation_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_conversation(id):
    # Query for conversation by id and update that conversation
    conversation = Conversation.query.get(id)

    if not conversation:
        return jsonify(error=[f"Unable to find conversation associated with id {id}"])

    if conversation.user_id != current_user.id:
        return jsonify(error=["You don't have the permission to update this conversation"]), 401

    title = request.json.get('title')

    conversation.title = title or conversation.title
    conversation.updated_at = datetime.now()

    db.session.commit()

    return conversation.to_dict(), 200


@conversation_routes.route('', methods=['POST'])
@login_required
def post_conversation():
    # Request information from json request and create new conversation
    title = request.json.get('title', "New Conversation")
    user_id = current_user.id

    new_conversation = Conversation(
        title=title,
        user_id=user_id,
    )

    db.session.add(new_conversation)
    db.session.commit()

    return new_conversation.to_dict(), 201


# Delete conversation by ID and user ID match
@conversation_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_conversation(id):
    # Query for conversation by ID
    conversation = Conversation.query.get(id)

    if not conversation:
        return jsonify(error="Conversation not found"), 404

    # Check if the conversation belongs to the current user
    if conversation.user_id != current_user.id:
        return jsonify(error="You don't have permission to delete this conversation"), 401

    # Delete all messages associated with the conversation
    Message.query.filter_by(conversation_id=conversation.id).delete()

    # Delete the conversation
    db.session.delete(conversation)
    db.session.commit()

    return {"deleted": conversation.to_dict()}

