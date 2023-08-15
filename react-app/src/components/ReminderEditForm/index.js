import React, { useState } from "react";
import { checkAndUpdateReminders, updateReminder } from "../../store/reminder";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

// date default input - yyyy-mm-dd
// time default input - HH:mm
export default function ReminderEditForm({ id }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const reminderObj = useSelector((state) => state.reminderReducer);
  const reminder = reminderObj[id];
  const { closeModal } = useModal();

  const handleUpdateReminder = (e) => {
    e.preventDefault();
    setErrors([]);
    const { date, title, description, location, status } = e.target.elements;

    const updatedReminder = {
      ...reminder,
      date_time: date.value,
      title: title.value,
      description: description.value,
      location: location.value,
      status: status.value,
    };

    dispatch(updateReminder(updatedReminder));
    closeModal();
  };

  return (
    <div className="reminders">
      {errors.length > 0 && (
        <div className="error-container">
          {errors.map((error, index) => (
            <p key={index} className="error-message">
              {error}
            </p>
          ))}
        </div>
      )}
      <form className="reminder-form" onSubmit={handleUpdateReminder}>
        <h4 className="reminders-heading">Set Reminder</h4>
        <label className="form-label">Date:</label>
        <input
          type="datetime"
          id="date"
          className="form-input"
          required
          defaultValue={reminder.date_time}
          placeholder={reminder.date_time}
          min={new Date().toISOString().slice(0, 10)}
        />

        <label className="form-label">Title:</label>
        <input
          type="text"
          id="title"
          className="form-input"
          placeholder="title"
          defaultValue={reminder.title}
        />

        <label className="form-label">Description:</label>
        <textarea
          type="text"
          id="description"
          placeholder="description - max length 200 characters"
          className="form-input"
          maxLength={200}
          defaultValue={reminder.description}
        />

        <label className="form-label">Location:</label>
        <input
          type="text"
          id="location"
          className="form-input"
          placeholder="location"
          defaultValue={reminder.location}
        />

        <label className="form-label">Status:</label>
        <input
          type="text"
          id="status"
          className="form-input"
          placeholder="active or completed"
          defaultValue={reminder.status}
          pattern="^(active|completed)$"
          title="Please enter 'active' or 'completed'"
          required
        />

        {/* <span>
          <label className="form-label">Recurring:</label>
          <input
            type="checkbox"
            id="recurring"
            className="form-input"
            defaultValue={reminder.recurring}
          />
        </span> */}

        <button type="submit" className="form-button">
          Update Reminder
        </button>
      </form>
    </div>
  );
}
