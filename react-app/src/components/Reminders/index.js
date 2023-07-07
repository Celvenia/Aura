import React, { useEffect, useState } from "react";
import { checkAndUpdateReminders, getReminders } from "../../store/reminder";
import { useDispatch, useSelector } from "react-redux";

import "./Reminders.css";
import Reminder from "../Reminder";

export default function Reminders() {
  const remindersObj = useSelector((state) => state.reminderReducer);
  const remindersArr = Object.values(remindersObj);
  const activeRemindersArr = remindersArr.filter(
    (reminder) => reminder.status === "active"
  );
  const [reminders, setReminders] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAndUpdateReminders());
  }, [dispatch]);

  return (
    <div>
      <h4 className="reminders-title">Reminders</h4>

      {activeRemindersArr && activeRemindersArr.length === 0 ? (
        <p className="no-reminders">No reminders.</p>
      ) : (
        <ul className="reminders-list">
          {activeRemindersArr && activeRemindersArr.map((reminder) =>
            reminder.status === "active" ? (
              <Reminder reminder={reminder} key={reminder.id} />
            ) : null
          )}
        </ul>
      )}
    </div>
  );
}
