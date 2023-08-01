from app.models import db, Reminder, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# strptime - string parse time methods
# %Y: 4-digit year
# %m: 2-digit month (with leading zeros)
# %d: 2-digit day (with leading zeros)
# %H: 2-digit hour (24-hour format)
# %M: 2-digit minute
# %S: 2-digit second

# Adds a demo reminder
def seed_reminders():
    reminder1 = Reminder(
        date_time=datetime.strptime("2023-06-10 05:00 AM", "%Y-%m-%d %I:%M %p"),
        title="Example",
        description="This is an example reminder",
        recurring=False,
        location="Example Location",
        status="active",  # active, completed, cancelled
        user_id=1
    )
    db.session.add(reminder1)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the reminders table. 
# SQLAlchemy doesn't have a built-in function to do this. 
# With PostgreSQL in production, TRUNCATE removes all the data from the table,
# and RESET IDENTITY resets the auto-incrementing primary key. CASCADE deletes any dependent entities. 
# With SQLite3 in development, you need to use DELETE to remove all data and it will reset the primary keys.
def undo_reminders():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reminders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reminders"))

    db.session.commit()
