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
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isSnoozeEnabled, setIsSnoozeEnabled] = useState(false);
  const [timeToAlarm, setTimeToAlarm] = useState(false);
  const dispatch = useDispatch();

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
    dispatch(checkAndUpdateReminders());
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
      console.log("Set alarm for", alarmTime);
      setIsAlarmSet(true);
    }
  };

  const handleSnooze = () => {
    setIsSnoozeEnabled(true);
    setTimeout(() => {
      setIsSnoozeEnabled(false);
    }, 60000);
  };


  return (
    <div className="clock flex-column-center">
      {isAlarmSet && (
        <p>
          Alarm is set for: <strong>{alarmTime}</strong>
        </p>
      )}
      <h1>{currentTime}</h1>
      <div className="clock-buttons">
        <input
          id="alarm-time"
          type="time"
          value={alarmTime}
          onChange={handleAlarmChange}
        />
        {!isAlarmSet && <button onClick={setAlarm}>Set Alarm</button>}
        {isAlarmSet && (
          <button onClick={handleRemoveAlarm}>Remove Alarm</button>
        )}
        {isSnoozeEnabled ? (
          <button className="snooze-false" disabled>
            Snooze
          </button>
        ) : (
          <button className="snooze-true" onClick={handleSnooze}>
            Snooze
          </button>
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
