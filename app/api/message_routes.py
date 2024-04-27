from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Message, Conversation
import os
import openai

message_routes = Blueprint('messages', __name__)
openai.api_key = os.getenv("OPEN_AI_KEY")


@message_routes.route('/<int:conversation_id>')
@login_required
def get_messages(conversation_id):
    # Retrieve the conversation associated with the user
    conversation = Conversation.query.filter_by(id=conversation_id).first()
    if not conversation:
        return {'error': 'Conversation not found'}
    if conversation.user_id != current_user.id:
        return {'error': 'Unauthorized user, unable to read messages from this conversation'}, 401

    messages = Message.query.filter_by(conversation_id=conversation.id).all()
    return {'messages': [message.to_dict() for message in messages]}


# @message_routes.route('/<int:id>')
# @login_required
# def get_message(id):
#     # Retrieve a message by its ID
#     message = Message.query.get(id)
#     if not message:
#         return {'error': 'Message not found'}, 404

#     return message.to_dict()


@message_routes.route('', methods=['POST'])
@login_required
def create_message():
    data = request.get_json()
    conversation_id = data['conversation_id']
    new_message_content = data['message']

    print(data, 'data!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

    # Retrieve the conversation associated with the user
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return {'error': 'Conversation not found'}, 404

    try:
        # Create a new message instance associated with the conversation
        new_message = Message(
            conversation_id=conversation.id,
            message=new_message_content,
            ai_response=""
        )
        db.session.add(new_message)
        db.session.commit()

        # Format messages for GPT-3.5 Turbo
        formatted_messages = [
            {'role': 'system', 'content': 'You are Aura, an extremely concise personal assistant chatbot.'}
        ]

        # Gives conversation context
        messages = conversation.messages
        for message in messages:
            formatted_messages.append(
                {'role': 'user', 'content': message.message})
            formatted_messages.append(
                {'role': 'assistant', 'content': message.ai_response})

        formatted_messages.append(
            {'role': 'user', 'content': new_message_content})

        # Send messages to GPT-3.5 Turbo for response generation
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=formatted_messages,
        )

        # Extract the generated message content from the response
        generated_message_content = response.choices[0].message.content
        print(response, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

        # Update the AI response of the new message
        new_message.ai_response = generated_message_content
        db.session.commit()

        return new_message.to_dict()

    except Exception as e:
        # Handle the exception and return an error response
        error_message = str(e)
        return {'error': error_message}, 500




# @message_routes.route('/<int:id>', methods=['PUT'])
# @login_required
# def update_message(id):
#     data = request.get_json()
#     new_message_content = data['message']

#     # Retrieve the message to update
#     message = Message.query.get(id)
#     if not message:
#         return {'error': 'Message not found'}, 404

#     try:
#         # Update the message content
#         message.message = new_message_content
#         db.session.commit()

#         return message.to_dict()

#     except Exception as e:
#         # Handle the exception and return an error response
#         error_message = str(e)
#         return {'error': error_message}, 500


# @message_routes.route('/<int:id>', methods=['DELETE'])
# @login_required
# def delete_message(id):
#     # Retrieve the message to delete
#     message = Message.query.get(id)
#     if not message:
#         return {'error': 'Message not found'}, 404

#     try:
#         db.session.delete(message)
#         db.session.commit()

#         return {'message': 'Message deleted successfully'}

#     except Exception as e:
#         # Handle the exception and return an error response
#         error_message = str(e)
#         return {'error': error_message}, 500


# @message_routes.route('', methods=['POST'])
# @login_required
# def gpt3():
#     try:
#         # Retrieve message from user structured like so
#         # {message: "message_content"}
#         data = request.get_json()
#         message_content = data['message']

#         # Retrieve the conversation associated with the user, will need to change to filter by id later
#         conversation = Conversation.query.filter_by(user_id=current_user.id).first()

#         if not conversation:
#             # If no conversation exists for the user, create a new one
#             conversation = Conversation(user_id=current_user.id, title="Journal")
#             db.session.add(conversation)
#             db.session.commit()

#         # response object generated by openai
#         response = openai.Completion.create(
#             model="text-davinci-003",
#             prompt=message_content,
#             max_tokens=4000, # limits length of response based on tokens
#             temperature=0.5, # dictates how deterministic
#         )
#         # key into text to get response
#         generated_message_content = response.choices[0].text

#         # Create a new message instance associated with the conversatio
#         new_message = Message(
#             conversation_id=conversation.id,
#             message=message_content,
#             ai_response=generated_message_content
#         )
#         db.session.add(new_message)
#         db.session.commit()

#         return new_message.to_dict()

#     except Exception as e:
#         # Handle the exception and return an error response
#         error_message = str(e)  # Get the error message as a string
#         return {'error': error_message}, 500
