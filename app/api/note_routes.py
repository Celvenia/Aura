from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Note
from datetime import datetime

note_routes = Blueprint('notes', __name__)

# Get all notes
@note_routes.route('', methods=['GET'])
def get_notes():
    # Query for all notes and returns them in a list of note dictionaries
    notes = Note.query.filter_by(user_id=current_user.id)
    return {'notes': [note.to_dict() for note in notes]}


# Get note by id
@note_routes.route('/<int:id>', methods=["GET"])
def get_note(id):
    # Query for a note by id and returns that note in a dictionary
    note = Note.query.get(id)
    
    if not note:
       return jsonify(error=[f"Unable to find note associated with id {id}"])
    
    return note.to_dict()


# Delete note by id
@note_routes.route('/<int:id>', methods=['DELETE'])
def delete_note(id):
    # Query for a note by id and delete that note
    note = Note.query.get(id)
    
    if not note:
       return jsonify(error=[f"Unable to find note associated with id {id}"])

    if note.user_id != current_user.id:
        return jsonify(error=["You don't have the permission to delete this note"]), 401
    

    db.session.delete(note)
    db.session.commit()

    return {"deleted": note.to_dict()}

# Update note by id
@note_routes.route('/<int:id>', methods=['PUT'])
def update_note(id):
    # Query for note by id and update that note
    note = Note.query.get(id)

    if not note:
       return jsonify(error=[f"Unable to find note associated with id {id}"])

    if note.user_id != current_user.id:
        return jsonify(error=["You don't have the permission to update this note"]), 401

    title = request.json.get('title')
    content = request.json.get('content')
    

    note.title = title or note.title
    note.content = content or note.content
    note.updated_at = datetime.now()

    db.session.commit()

    return note.to_dict(), 200


# Create note
@note_routes.route('', methods=['POST'])
def post_note():
    # Request information from json request and create new note
    if not current_user:
        return jsonify(error="You must be logged in to create a note"), 401

    title = request.json.get('title')
    content = request.json.get('content')
    user_id = current_user.id   

    new_note = Note(
        title=title,
        content=content,
        user_id=user_id,
    )

    db.session.add(new_note)
    db.session.commit()

    return new_note.to_dict(), 201
    

    