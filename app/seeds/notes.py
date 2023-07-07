from app.models import db, Note, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo note, you can add other notes here if you want
def seed_notes():
    note = Note(user_id=1, title="Steps to create ai app", 
                content="""1: make backend and frontend folder - cd backend
2: make virtual environment in backend folder - virtualenv venv
3: activate virtual environment - source venv/bin/activate
4: install dependencies - pip3 install flask flask-cors openai python-dotenv
5: see dependencies - pip3 freeze
6: store dependencies - pip3 freeze > requirements.txt
7: create frontend with create-react-app with name following @latest (consider leaving out @latest, current using node V16.19.0
) - npx create-react-app@latest frontend""")
    db.session.add(note)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the notes table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_notes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notes"))
        
    db.session.commit()