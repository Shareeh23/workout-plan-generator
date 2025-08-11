import React, { useEffect, useState } from "react";
import { getWorkoutLogs } from "../../../api/workoutApi";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import "./Calendar.css";

const Calendar = () => {
  const [completedDates, setCompletedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedDates = async () => {
      try {
        const logs = await getWorkoutLogs();
        // Store the date strings in local timezone
        const dates = logs.map((log) => ({
          date: new Date(log.date), // Keep the original date object for reference
        }));
        console.log("Fetched workout logs:", dates);
        setCompletedDates(dates);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching workout logs:", err);
        setError(err.message || "Failed to load calendar data");
        setLoading(false);
      }
    };

    fetchCompletedDates();
  }, []);

  // Calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);

  // Format date to YYYY-MM-DD in local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Check if a date has a completed workout
  const hasWorkoutOnDate = (date) => {
    if (!completedDates || completedDates.length === 0) return false;

    // Convert the calendar cell date to local YYYY-MM-DD
    const cellDateStr = formatLocalDate(new Date(date));

    return completedDates.some((entry) => {
      // Convert the stored date string to a date object in local time
      const entryDate = new Date(entry.date);
      const entryDateStr = formatLocalDate(entryDate);

      return entryDateStr === cellDateStr;
    });
  };

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
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    setCurrentYear((y) => (currentMonth === 0 ? y - 1 : y));
  }
  function nextMonth() {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    setCurrentYear((y) => (currentMonth === 11 ? y + 1 : y));
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
          const isCompleted = hasWorkoutOnDate(dateObj);
          const isSelected =
            selectedDate &&
            dateObj.toDateString() === selectedDate.toDateString() &&
            !isCompleted; // Don't select if it's a completed day

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
        <div className="calendar-section-loading">
          <span className="spinner"></span>
        </div>
      ) : error ? (
        <div className="calendar-section-error">{error}</div>
      ) : (
        <div className="calendar-root">
          <div className="calendar-nav">
            <button className="btn-fab-md" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeftIcon  />
            </button>
            <h4>
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h4>
            <button className="btn-fab-md" onClick={nextMonth} aria-label="Next month">
              <ChevronRightIcon />
            </button>
          </div>
          <table className="calendar-table">
            <thead>
              <tr className="text-md">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>{renderCalendar()}</tbody>
          </table>
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-color completed"></span>
              <span className="text-sm">Workout completed</span>
            </div>
            <div className="legend-item">
              <span className="legend-color selected"></span>
              <span className="text-sm">Selected day</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
