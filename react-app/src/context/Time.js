import React, { createContext, useState, useEffect } from "react";

export const TimeContext = createContext();

const TimeProvider = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isSnoozeEnabled, setIsSnoozeEnabled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);


  return (
    <TimeContext.Provider value={contextValue}>
      {children}
    </TimeContext.Provider>
  );
};

export default TimeProvider;
