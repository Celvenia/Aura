import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import OpenModalButton from "../OpenModalButton";
import ReminderForm from "../ReminderForm";
import Reminders from "../Reminders";
import { getReminders } from "../../store/reminder";
import { useModal } from "../../context/Modal";
import dayjs from "dayjs";
import "./Calendar.css";

export default function Calendar() {
  const { setModalContent } = useModal();
  const remindersObj = useSelector((state) => state.reminderReducer);
  const remindersArr = Object.values(remindersObj);

  const filteredReminders = remindersArr.filter((reminder) => {
    const reminderDateTime = dayjs(reminder.date_time, "YYYY-MM-DD HH:mm:ss");
    const currentDateTime = dayjs();
    return (
      reminderDateTime.isAfter(currentDateTime) && reminder.status === "active"
    );
  });

  const currentDate = dayjs().format("YYYY-MM-DD");

  const dispatch = useDispatch();
  const [calendar, setCalendar] = useState();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [monthDays, setMonthDays] = useState([]);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Th", "Fri", "Sat"];

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleCurrentMonth = () => {
    setCurrentMonth(dayjs());
  };

  const handleClickedNotification = () => {};

  const handleOpenModal = () => {
    const modalContent = <Reminders />;
    setModalContent(modalContent);
  };

  const getMonth = (month = currentMonth.month()) => {
    const year = currentMonth.year();
    const firstDayOfMonth = dayjs(new Date(year, month, 1)).day();
    let previousMonthDayCount = 0 - firstDayOfMonth;

    const daysMatrix = new Array(6).fill([]).map(() => {
      return new Array(7).fill(null).map(() => {
        previousMonthDayCount++;
        let date = dayjs(new Date(year, month, previousMonthDayCount));
        return date;
      });
    });
    setMonthDays(daysMatrix);
    return daysMatrix;
  };

  useEffect(() => {
    setCalendar(document.getElementById("calendar"));
    if (calendar) {
      getMonth(currentMonth.month());
    }
    dispatch(getReminders());
  }, [calendar, currentMonth]);

  if (filteredReminders) {
    console.log(filteredReminders);
  }
  return (
    <>
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-directions">
            <FontAwesomeIcon
              className="arrow"
              onClick={handlePreviousMonth}
              icon={faArrowLeft}
            />
            <div className="calendar-selected">
              {currentMonth.format("MMM YYYY")}
            </div>
            <FontAwesomeIcon
              className="arrow"
              onClick={handleNextMonth}
              icon={faArrowRight}
            />
          </div>
        </div>

        <div id="calendar">
          <div className="week">
            {daysOfWeek.map((day) => (
              <div className="weekday" key={day}>
                {day}
              </div>
            ))}
          </div>

          {monthDays.map((week, index) => (
            <div className="week" key={index}>
              {week.map((day) => (
                <div
                  className={
                    currentDate <= day.format("YYYY-MM-DD")
                      ? "current-day"
                      : "not-current-day"
                  }
                  title={day.format("YYYY-MM-DD")}
                  key={day.format("dddd")}
                >
                  <OpenModalButton
                    className={
                      currentDate <= day.format("YYYY-MM-DD")
                        ? "current-day"
                        : "not-current-day"
                    }
                    buttonText={day.format("D")}
                    modalComponent={
                      <ReminderForm
                        selectedDate={day.format("YYYY-MM-DD HH:mm:ss")}
                      />
                    }
                  />
                  {filteredReminders.some((reminder) => {
                    return (
                      reminder.status === "active" &&
                      reminder.date_time.includes(day.format("YYYY-MM-DD"))
                    );
                  }) && (
                    <FontAwesomeIcon
                      icon={faBell}
                      onClick={() => handleOpenModal()}
                    />
                    // <OpenModalButton
                    //   buttonText={<FontAwesomeIcon icon={faBell} />}
                    //   modalComponent={<Reminders />}
                    // />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
