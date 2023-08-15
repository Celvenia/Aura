import React, { useEffect, useState } from "react";
import {
  checkAndUpdateReminders,
  getReminders,
  updateReminder,
} from "../../store/reminder";
import { useDispatch, useSelector } from "react-redux";
import Reminder from "../Reminder";
import dayjs from "dayjs";
import "./Reminders.css";

export default function Reminders() {
  const remindersObj = useSelector((state) => state.reminderReducer);
  const remindersArr = Object.values(remindersObj);
  const activeRemindersArr = remindersArr.filter(
    (reminder) => reminder.status === "active"
  );

  const filteredRemindersArr = remindersArr.filter((reminder) => {
    const reminderDateTime = dayjs(reminder.date_time, "YYYY-MM-DD HH:mm:ss");
    const currentDateTime = dayjs();
    const reminderUtcDateTime = dayjs(reminderDateTime, "YYYY-MM-DD HH:mm:ss", {
      utc: true,
    });

    const currentUtcDateTime = dayjs(currentDateTime, "YYYY-MM-DD HH:mm:ss", {
      utc: true,
    });

    return (
      reminderUtcDateTime.isBefore(currentUtcDateTime) &&
      reminder.status === "active"
    );
  });

  const [reminders, setReminders] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (filteredRemindersArr.length) {
      dispatch(checkAndUpdateReminders(filteredRemindersArr));
    }
    dispatch(getReminders());
  }, [dispatch]);

  return (
    <div className="reminders">
      <h4 className="reminders-title">Reminders</h4>

      {activeRemindersArr && activeRemindersArr.length === 0 ? (
        <p className="no-reminders">No reminders.</p>
      ) : (
        <ul className="reminders-list">
          {activeRemindersArr &&
            activeRemindersArr.map((reminder) =>
              reminder.status === "active" ? (
                <Reminder reminder={reminder} key={reminder.id} />
              ) : null
            )}
        </ul>
      )}
    </div>
  );
}
