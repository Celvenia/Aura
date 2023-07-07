from app.models import db, Conversation, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo conversation, you can add other conversations here if you want
def seed_conversations():
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the conversations table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_conversations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.conversations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM conversations"))
        
    db.session.commit()