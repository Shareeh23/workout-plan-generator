import React, { useEffect, useState } from "react";
import { getWorkoutLogs } from "../../../api/workoutApi";
import "./Calendar.css";

const Calendar = () => {
  const [completedDates, setCompletedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchCompletedDates = async () => {
        try {
          const logs = await getWorkoutLogs();
          const dates = logs.map(log => new Date(log.date).toDateString());
          setCompletedDates(dates);
          setLoading(false);
        } catch (err) {
          setError(err.message || "Failed to load calendar data");
          setLoading(false);
        }
      };
  
      fetchCompletedDates();
    }, 1000);
  
    return () => clearTimeout(timer);
  }, []);

  // Calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);

  // Highlight logic
  const completedSet = new Set(
    completedDates.map(date =>
      typeof date === "string" ? date.slice(0, 10) : date.toISOString().slice(0, 10)
    )
  );

  // Helper: get days in month
  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Helper: get first day of week (0=Sun)
  function getFirstDay(month, year) {
    return new Date(year, month, 1).getDay();
  }

  // Navigation handlers
  function prevMonth() {
    setCurrentMonth(m => (m === 0 ? 11 : m - 1));
    setCurrentYear(y => (currentMonth === 0 ? y - 1 : y));
  }
  function nextMonth() {
    setCurrentMonth(m => (m === 11 ? 0 : m + 1));
    setCurrentYear(y => (currentMonth === 11 ? y + 1 : y));
  }

  // Render calendar grid
  function renderCalendar() {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDay(currentMonth, currentYear);
    const weeks = [];
    let day = 1 - firstDay;
    for (let w = 0; w < 6; w++) {
      const week = [];
      for (let d = 0; d < 7; d++, day++) {
        if (day < 1 || day > daysInMonth) {
          week.push(<td key={d}></td>);
        } else {
          const dateObj = new Date(currentYear, currentMonth, day);
          const iso = dateObj.toISOString().slice(0, 10);
          const isCompleted = completedSet.has(iso);
          const isSelected =
            selectedDate &&
            dateObj.toDateString() === selectedDate.toDateString();
          week.push(
            <td
              key={d}
              className={
                "calendar-cell" +
                (isCompleted ? " calendar-completed-day" : "") +
                (isSelected ? " calendar-selected-day" : "")
              }
              onClick={() => setSelectedDate(dateObj)}
            >
              {day}
            </td>
          );
        }
      }
      weeks.push(<tr key={w}>{week}</tr>);
    }
    return weeks;
  }

  return (
    <div className="calendar-section-container">
      <h3 className="calendar-section-heading">Workout Calendar</h3>
      {loading ? (
        <div className="calendar-section-loading"><span className="spinner"></span></div>
      ) : error ? (
        <div className="calendar-section-error">{error}</div>
      ) : (
        <div className="calendar-root">
          <div className="calendar-nav">
            <button className="btn-fab-md" onClick={prevMonth}>&lt;</button>
            <h4>
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h4>
            <button className="btn-fab-md" onClick={nextMonth}>&gt;</button>
          </div>
          <table className="calendar-table">
            <thead>
              <tr className="text-md">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>{renderCalendar()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Calendar;
