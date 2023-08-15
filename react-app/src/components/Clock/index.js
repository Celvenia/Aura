import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import HollowKnightDD from "../../assets/HollowKnightDD.mp3";
import {
  checkAndUpdateReminders,
  deleteReminder,
  getReminders,
} from "../../store/reminder";
import dayjs from "dayjs";
import Reminder from "../Reminder";
import OpenModalButton from "../OpenModalButton";
import "./Clock.css";

export default function Clock() {
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isSnoozeEnabled, setIsSnoozeEnabled] = useState(false);
  const [timeToAlarm, setTimeToAlarm] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState(null);
  const [isInputHidden, setIsInputHidden] = useState(true);
  const remindersObj = useSelector((state) => state.reminderReducer);
  const remindersArr = Object.values(remindersObj).filter(
    (reminder) => reminder.status === "active"
  );

  let activeRemindersArr = remindersArr.filter((reminder) => {
    if (!remindersArr.length) return;
    const currentDateTime = dayjs();
    const reminderDateTime = dayjs(reminder.date_time).format("HH:mm");
    const reminderUtcDate = dayjs(reminder.date_time, "YYYY-MM-DD", {
      utc: true,
    });

    const currentUtcDate = dayjs(currentDateTime, "YYYY-MM-DD", {
      utc: true,
    });
    if (
      reminderUtcDate.isSame(currentUtcDate, "day") &&
      reminder.status === "active"
    ) {
      if (
        alarmTime === "" ||
        reminderDateTime < alarmTime ||
        remindersObj[indexToRemove] === undefined
      ) {
        setIndexToRemove(reminder.id);
        setAlarmTime(reminderDateTime);
      }
    }

    return reminderUtcDate.isSame(currentUtcDate, "day");
    // return reminderDateTime;
  });

  function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(":");

    const hour = parseInt(hours);

    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const time12 = `${hour12}:${minutes} ${period}`;

    return time12;
  }
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [alarmHour, alarmMinute] = alarmTime.split(":");
    if (
      parseInt(alarmHour, 10) === currentHour &&
      parseInt(alarmMinute, 10) === currentMinute
    ) {
      setTimeToAlarm(true);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [currentTime]);

  useEffect(() => {
    // dispatch(getReminders());
    if (!activeRemindersArr.length) {
      setAlarmTime("");
      setIndexToRemove(null);
    }
    const alarmSetButton = document.getElementById("alarm-set");
    if (alarmTime && alarmSetButton) {
      alarmSetButton.click();
    }
  }, [alarmTime, dispatch]);

  const handleRemoveAlarm = () => {
    if (!isAlarmSet) {
      return;
    }
    setIsAlarmSet(false);
    setAlarmTime("");
    // setFormattedTime("");
    setIsSnoozeEnabled(false);
    setTimeToAlarm(false);
    if (indexToRemove) {
      dispatch(deleteReminder(indexToRemove));
    }
  };

  const handleAlarmChange = (e) => {
    setAlarmTime(e.target.value);
  };

  const setAlarm = () => {
    if (alarmTime !== "") {
      setIsAlarmSet(!isAlarmSet);
    }
  };

  const handleSnooze = () => {
    setIsSnoozeEnabled(true);

    setTimeout(() => {
      setIsSnoozeEnabled(false);
    }, 300000);
  };

  return (
    <div className="clock">
      <div className="clock-header-container">
        {/* <button className="clock-header-button">Active </button> */}
        <h4>Incoming Reminder/Alarm</h4>
        {/* <button className="clock-header-button">Completed </button> */}
      </div>
      <div className="alarm-details">
        {indexToRemove && alarmTime && (
          <div>
            <p>
              Title: {remindersObj[indexToRemove]?.title || "no title given"}
            </p>
            <p>
              Description:{" "}
              {remindersObj[indexToRemove]?.description.slice(0, 100) ||
                "no description given"}
            </p>
            <p>
              Location:{" "}
              {remindersObj[indexToRemove]?.location || "no location given"}
            </p>
          </div>
        )}
        {!indexToRemove && !alarmTime && <h5> No Alarms Currently Set</h5>}
      </div>
      <div className="clock-col-container">
        <div className="clock-col-1">
          <h4 className="flex-center">Your Tasks For Today</h4>
          {!alarmTime && (
            <div className="flex-center">
              {!remindersArr.length && <p>No Tasks Set</p>}
            </div>
          )}

          <div className="todays-tasklist">
            {activeRemindersArr &&
              activeRemindersArr.map((reminder) =>
                reminder.status === "active" ? (
                  <div className="todays-task">
                    {reminder.title.slice(0, 13) || "no title"}-
                    {/* <OpenModalButton
                      buttonText={reminder.title || "no title"}
                      modalComponent={<Reminder reminder={reminder} />}
                    /> */}
                    {convertTo12Hour(dayjs(reminder.date_time).format("HH:mm"))}
                  </div>
                ) : null
              )}
          </div>
        </div>
        <div className="clock-col-2">
          {alarmTime ? (
            <>
              <p>
                Next Alarm:{" "}
                <strong id="formatted-alarm-time">
                  {convertTo12Hour(alarmTime)}
                </strong>
              </p>
              {isSnoozeEnabled && <p>Snoozing for 5 minutes</p>}
            </>
          ) : null}
          <h1>{currentTime}</h1>
          <div className="clock-buttons">
            {!isInputHidden && (
              <input
                id="alarm-time"
                type="time"
                value={alarmTime}
                onChange={handleAlarmChange}
              />
            )}
            {!isAlarmSet && alarmTime && (
              <button id="alarm-set" onClick={setAlarm}>
                Loading
              </button>
            )}
            {isAlarmSet && alarmTime && (
              <button id="alarm-remove" onClick={handleRemoveAlarm}>
                Remove
              </button>
            )}
            {isAlarmSet && isSnoozeEnabled ? (
              <button className="snooze-false" disabled>
                Snooze
              </button>
            ) : isAlarmSet && alarmTime ? (
              <button className="snooze-true" onClick={handleSnooze}>
                Snooze
              </button>
            ) : // <button disabled> Snooze </button>
            null}
          </div>
        </div>
      </div>
      {timeToAlarm && !isSnoozeEnabled && (
        <audio autoPlay loop>
          <source src={HollowKnightDD} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
