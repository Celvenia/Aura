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


export default function Reminder({ reminder }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleShowClick = () => {
    setShow(!show);
  };

  const handleDeleteClick = () => {
    dispatch(deleteReminder(reminder.id));
  };

  return (
    <div className="reminder-item">
      <div className="reminder-info">
        <div>{reminder.title}</div>
        {reminder.date_time}
        <div>{reminder.description}</div>
        {show && (
          <div>
            <div>Status: {reminder.status}</div>
            <div>Location: {reminder.location}</div>
            <div>Recurring: {`${reminder.recurring}`}</div>
          </div>
        )}
      </div>
      <div className="reminder-button-container">
        <OpenModalButton
          buttonText={<FontAwesomeIcon icon={faPenToSquare} />}
          modalComponent={<ReminderEditForm id={reminder.id}/>}
        />
        <FontAwesomeIcon onClick={handleDeleteClick} icon={faXmark} />
        <FontAwesomeIcon onClick={handleShowClick} icon={faEye} />
      </div>
    </div>
  );
}
