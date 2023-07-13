from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Reminder
from datetime import datetime, timedelta
import time

reminder_routes = Blueprint('reminders', __name__)

# Get all reminders


@reminder_routes.route('', methods=['GET'])
@login_required
def get_reminders():
    reminders = Reminder.query.filter_by(user_id=current_user.id).all()
    return {'reminders': [reminder.to_dict() for reminder in reminders]}


# Get reminder by id
@reminder_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_reminder(id):
    reminder = Reminder.query.get(id)

    if not reminder:
        return jsonify(error=[f"Unable to find reminder associated with id {id}"]), 404

    return reminder.to_dict()


# Create reminder
@reminder_routes.route('', methods=['POST'])
@login_required
def create_reminder():
    now = datetime.now()

    datetime_str = request.json.get('date_time')
    date_time = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
    print(date_time)
    if date_time < now:
        return jsonify(error=["Unable to set reminder in the past"])
    title = request.json.get('title')
    description = request.json.get('description')
    recurring = request.json.get('recurring')
    location = request.json.get('location')
    # status = request.json.get('status')
    user_id = current_user.id

    new_reminder = Reminder(
        date_time=date_time,
        title=title,
        description=description,
        recurring=recurring,
        location=location,
        status="active",
        user_id=user_id
    )

    db.session.add(new_reminder)
    db.session.commit()

    return new_reminder.to_dict(), 201


# Update reminder by id
@reminder_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_reminder(id):
    reminder = Reminder.query.get(id)

    if not reminder:
        return jsonify(error=[f"Unable to find reminder associated with id {id}"]), 404

    if reminder.user_id != current_user.id:
        return jsonify(error=["You don't have permission to update this reminder"]), 401

    now = datetime.now()

    datetime_str = request.json.get('date_time')
    parsed_date_time = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
    title = request.json.get('title')
    description = request.json.get('description')
    recurring = request.json.get('recurring')
    location = request.json.get('location')
    # status = request.json.get('status')
    reminder.date_time = parsed_date_time or reminder.date_time
    reminder.title = title or reminder.title
    reminder.description = description or reminder.description
    reminder.recurring = recurring or reminder.recurring
    reminder.location = location or reminder.location
    reminder.updated_at = datetime.utcnow()

    db.session.commit()

    return reminder.to_dict(), 200


# Delete reminder by id
@reminder_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_reminder(id):
    reminder = Reminder.query.get(id)

    if not reminder:
        return jsonify(error=[f"Unable to find reminder associated with id {id}"]), 404

    if reminder.user_id != current_user.id:
        return jsonify(error=["You don't have permission to delete this reminder"]), 401

    db.session.delete(reminder)
    db.session.commit()

    return {"deleted": reminder.to_dict()}


# check and update reminders that have passed current date/time
@reminder_routes.route('/check-and-update', methods=['POST'])
@login_required
def check_and_update_reminders():
    now = datetime.now()
    # current_time = time.localtime()
    time_now = now.strftime("%H:%M:%S")
    current_time = datetime.datetime.now()

    reminders = Reminder.query.filter_by(user_id=current_user.id).all()

    for reminder in reminders:
        print(current_time, 'current time local?')
        print(time_now, 'converted now')

        if (reminder.date_time <= now):
            reminder.status = "completed"

    db.session.commit()
    reminders = Reminder.query.filter_by(user_id=current_user.id).all()
    return {'reminders': [reminder.to_dict() for reminder in reminders]}
