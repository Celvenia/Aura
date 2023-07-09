import React, { useState } from "react";
import { checkAndUpdateReminders, postReminder } from "../../store/reminder";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./ReminderForm.css";
import dayjs from "dayjs";

export default function ReminderForm({ selectedDate }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [date, setDate] = useState(
    dayjs(selectedDate).format("YYYY-MM-DDTHH:mm")
  );

  const handleAddReminder = async (e) => {
    e.preventDefault();
    setErrors([]);
    const { title, description, location, recurring } = e.target.elements;

    if (dayjs().isAfter(date)) {
      setErrors(["Cannot set reminder in the past"]);
      return;
    }

    const newReminder = {
      date_time: dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
      title: title.value,
      description: description.value,
      location: location.value || "undefined",
      recurring: recurring.checked,
      status: "active",
    };
    dispatch(postReminder(newReminder));
    closeModal();
  };

  return (
    <div className="reminders">
      {errors.length > 0 && (
        <div className="error-container">
          {errors.map((error, index) => (
            <p
              key={index}
              className="error-message"
              onClick={(e) => setErrors([])}
            >
              {error}
            </p>
          ))}
        </div>
      )}
      <form className="reminder-form" onSubmit={handleAddReminder}>
        <h1 className="reminders-heading">Set Reminder</h1>
        <label className="form-label">Date:</label>
        <input
          type="datetime-local"
          id="date"
          className="form-input"
          required
          placeholder="YYYY-MM-DD HH:MM"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label className="form-label">Title:</label>
        <input
          type="text"
          id="title"
          className="form-input"
          placeholder="title"
          title="title"
        />

        <label className="form-label">Description:</label>
        <textarea
          type="text"
          id="description"
          className="form-input"
          placeholder="description"
          title="description"
        />

        <label className="form-label">Location:</label>
        <input
          type="text"
          id="location"
          className="form-input"
          placeholder="location"
          title="location"
        />
        <span>
          <label className="form-label">Recurring:</label>
          <input
            type="checkbox"
            id="recurring"
            className="form-input"
            title="recurring"
          />
        </span>

        <button type="submit" className="form-button">
          Add Reminder
        </button>
      </form>
    </div>
  );
}
