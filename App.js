
import React, { useState } from "react";
import { format } from "date-fns";
import "./App.css";

function App() {
  const [startDate, setStartDate] = useState("");
  const [eventTime, setEventTime] = useState("09:00");
  const [recurrenceType, setRecurrenceType] = useState("weekly");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [occurrences, setOccurrences] = useState(5);
  const [viewStart, setViewStart] = useState("");
  const [viewEnd, setViewEnd] = useState("");
  const [instances, setInstances] = useState([]);

  const getDayIndex = (day) =>
    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(day);

  const generateInstances = () => {
    const result = [];
    const base = new Date(startDate);
    const [hours, minutes] = eventTime.split(":");
    base.setHours(+hours);
    base.setMinutes(+minutes);

    let current = new Date(base);

    for (let i = 0; i < occurrences; i++) {
      const instance = new Date(current);

      if (recurrenceType === "weekly") {
        while (instance.getDay() !== getDayIndex(dayOfWeek)) {
          instance.setDate(instance.getDate() + 1);
        }
        current = new Date(instance);
        current.setDate(instance.getDate() + 7);
      } else {
        current.setDate(current.getDate() + 1);
      }

      const inView =
        new Date(viewStart) <= instance && instance <= new Date(viewEnd);

      result.push({
        date: new Date(instance),
        inView,
      });
    }

    setInstances(result);
  };

  return (
    <div className="App">
      <h2>📅 Recurring Event Generator</h2>
      <div className="form">
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>Event Time:</label>
        <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
        <label>Recurrence Type:</label>
        <select value={recurrenceType} onChange={(e) => setRecurrenceType(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
        {recurrenceType === "weekly" && (
          <>
            <label>Day of the Week:</label>
            <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </>
        )}
        <label>Number of Occurrences:</label>
        <input type="number" value={occurrences} onChange={(e) => setOccurrences(+e.target.value)} />
        <label>View Window Start:</label>
        <input type="date" value={viewStart} onChange={(e) => setViewStart(e.target.value)} />
        <label>View Window End:</label>
        <input type="date" value={viewEnd} onChange={(e) => setViewEnd(e.target.value)} />
        <button onClick={generateInstances}>Generate Events</button>
      </div>
      <hr />
      <h3>Generated Event Instances:</h3>
      <ul>
        {instances.map((item, idx) => (
          <li
            key={idx}
            className={item.inView ? "in-view" : "out-of-view"}
            style={{
              color: item.inView ? "#000" : "#888",
              opacity: item.inView ? 1 : 0.6,
              marginBottom: "6px",
            }}
          >
            {format(item.date, "eeee, MMMM d, yyyy — hh:mm a")}
            {!item.inView && (
              <span title="Outside view window" style={{ marginLeft: "8px" }}>⚠️</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
