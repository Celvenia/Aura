import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faXmark,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { deleteReminder } from "../../store/reminder";
import { useDispatch } from "react-redux";
import ReminderEditForm from "../ReminderEditForm";
import OpenModalButton from "../OpenModalButton";
import "./Reminder.css";

export default function Reminder({ reminder }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleShowClick = () => {
    setShow(!show);
  };

  const handleDeleteClick = () => {
    let deleteAlarm = document.getElementById("alarm-remove");
    dispatch(deleteReminder(reminder.id));
    if (deleteAlarm) {
      deleteAlarm.click();
    }
  };

  return (
    <div className="reminder-item">
      <div className="reminder-info">
        <div>
          <strong>Title: </strong>
          {reminder.title}
        </div>
        <div>
          {" "}
          <strong>Date/Time: </strong>
          {reminder.date_time}
        </div>
        <div>
          {" "}
          <strong>Description: </strong>
          {reminder.description}
        </div>
        {show && (
          <div>
            <div>
              {" "}
              <strong>Status: </strong> {reminder.status}
            </div>
            <div>
              {" "}
              <strong>Location: </strong>
              {reminder.location}
            </div>
          </div>
        )}
      </div>
      <div className="reminder-button-container">
        <OpenModalButton
          buttonText={<FontAwesomeIcon icon={faPenToSquare} />}
          modalComponent={<ReminderEditForm id={reminder.id} />}
        />
        <button onClick={handleDeleteClick}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <button onClick={handleShowClick}>
          <FontAwesomeIcon icon={faEye} />
        </button>
      </div>
    </div>
  );
}
