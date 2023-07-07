from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class Message(db.Model, UserMixin):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('conversations.id')), nullable=False)
    message = db.Column(db.Text)
    ai_response = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(
        db.DateTime, default=datetime.now, onupdate=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'message': self.message,
            'ai_response': self.ai_response,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
