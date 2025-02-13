import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleAddEvent = () => {
    if (title && date) {
      setEvents([...events, { title, date }]);
      setTitle("");
      setDate("");
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-[#3b0764]">
          Calendar Integration
        </h1>
      </div>

      {/* Add Event Section */}
      <div className="bg-white p-6 shadow rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Schedule Task or Meeting</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button
            onClick={handleAddEvent}
            className="bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86]"
          >
            Add Event
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Scheduled Events</h2>
        <ul className="space-y-3">
          {events.map((event, index) => (
            <li
              key={index}
              className="p-3 bg-gray-50 rounded-lg shadow flex justify-between"
            >
              <span>
                {event.title} - {event.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarPage;
