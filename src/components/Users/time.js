import React, { useState } from "react";
import { FiClock } from "react-icons/fi";

const TimeTrackingPage = () => {
  const [entries, setEntries] = useState([]);
  const [task, setTask] = useState("");
  const [hours, setHours] = useState("");

  const handleAddEntry = () => {
    if (task && hours) {
      setEntries([...entries, { task, hours }]);
      setTask("");
      setHours("");
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-[#3b0764]">Time Tracking</h1>
      </div>

      {/* Time Logging Section */}
      <div className="bg-white p-6 shadow rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Log Work Hours</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Task Name"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Hours Spent"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button
            onClick={handleAddEntry}
            className="bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86]"
          >
            Add Entry
          </button>
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Logged Hours</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Task Name</th>
              <th className="border border-gray-300 p-2">Hours Spent</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="bg-gray-50">
                <td className="border border-gray-300 p-2">{entry.task}</td>
                <td className="border border-gray-300 p-2">{entry.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeTrackingPage;
