import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import HollowKnightDD from "../../assets/HollowKnightDD.mp3";
import "./Clock.css";
import { checkAndUpdateReminders } from "../../store/reminder";

export default function Clock() {
  const remindersObj = useSelector((state) => state.reminderReducer);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [alarmTime, setAlarmTime] = useState("");
  const [formattedTime, setFormattedTime] = useState(null);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isSnoozeEnabled, setIsSnoozeEnabled] = useState(false);
  const [timeToAlarm, setTimeToAlarm] = useState(false);
  const dispatch = useDispatch();

  function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(":");

    const hour = parseInt(hours);
    const minute = parseInt(minutes);

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
    // dispatch(checkAndUpdateReminders());
  }, [dispatch]);

  const handleRemoveAlarm = () => {
    setAlarmTime("");
    setIsAlarmSet(false);
    setIsSnoozeEnabled(false);
    setTimeToAlarm(false);
  };

  const handleAlarmChange = (e) => {
    setAlarmTime(e.target.value);
  };

  const setAlarm = () => {
    if (alarmTime) {
      setFormattedTime(convertTo12Hour(alarmTime));
      setIsAlarmSet(true);
    }
  };

  const handleSnooze = () => {
    setIsSnoozeEnabled(true);

    setTimeout(() => {
      setIsSnoozeEnabled(false);
    }, 300000);
  };

  return (
    <div className="clock flex-column-center">
      {isAlarmSet && (
        <>
          {isSnoozeEnabled && <p>Snoozing for 5 minutes</p>}
          <p>
            Alarm is set for:{" "}
            <strong id="formatted-alarm-time">{formattedTime}</strong>
          </p>
        </>
      )}
      <h1>{currentTime}</h1>
      <div className="clock-buttons">
        <input
          id="alarm-time"
          type="time"
          value={alarmTime}
          onChange={handleAlarmChange}
        />
        {!isAlarmSet && <button onClick={setAlarm}>Set</button>}
        {isAlarmSet && <button onClick={handleRemoveAlarm}>Remove</button>}
        {isAlarmSet && isSnoozeEnabled ? (
          <button className="snooze-false" disabled>
            Snooze
          </button>
        ) : isAlarmSet ? (
          <button className="snooze-true" onClick={handleSnooze}>
            Snooze
          </button>
        ) : (
          <button disabled> Snooze </button>
        )}
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
