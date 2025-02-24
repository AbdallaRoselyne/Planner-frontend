import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import DateTimePicker from "react-datetime-picker";
import "react-calendar/dist/Calendar.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import { FiCheckCircle, FiEdit } from "react-icons/fi";

const ApproveTaskRequests = () => {
  const [taskRequests, setTaskRequests] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [approvedHours, setApprovedHours] = useState(2);
  const [approvedSlots, setApprovedSlots] = useState([]);

  useEffect(() => {
    fetchTaskRequests();
  }, []);

  const fetchTaskRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/requests");
      const data = await response.json();
      const formattedData = data.map((request) => ({
        id: request._id,
        name: request.requestedName,
        task: request.Task,
        hoursRequested: request.hours,
        code: request.projectCode,
        project: request.project,
        requestor: request.requester,
        department: request.department,
        notes: request.Notes,
      }));
      setTaskRequests(formattedData);
    } catch (error) {
      console.error("Error fetching task requests:", error);
    }
  };

  // Function to categorize time into slots
  const getTimeSlot = (time) => {
    const hours = time.getHours();
    if (hours >= 8 && hours < 10) return "Morning";
    if (hours >= 10 && hours < 12) return "Mid-Morning";
    if (hours >= 12 && hours < 16) return "Afternoon";
    return "Invalid Time"; 
  };

  // Handle approval
  const handleApprove = () => {
    if (!selectedTask) return alert("Select a task first!");
    if (approvedHours <= 0) return alert("Enter valid hours!");

    const slot = getTimeSlot(selectedTime);
    if (slot === "Invalid Time") return alert("Select a valid time slot!");

    const approvedEntry = {
      taskId: selectedTask.id,
      name: selectedTask.name,
      task: selectedTask.task,
      date: selectedDate.toLocaleDateString(),
      timeSlot: slot,
      hoursApproved: approvedHours,
      code: selectedTask.code,
      project: selectedTask.project,
      requestor: selectedTask.requestor,
      department: selectedTask.department,
      notes: selectedTask.notes,
    };

    setApprovedSlots([...approvedSlots, approvedEntry]);
    setTaskRequests(taskRequests.filter((task) => task.id !== selectedTask.id));
    setSelectedTask(null);
    setApprovedHours(2); // Reset hours input
  };

  return (
    <div className="flex h-screen p-6 bg-gray-100">
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-[#3b0764]">Approve Task Requests</h1>
        </div>

        {/* Task Selection */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Pending Task Requests</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Task</th>
                <th className="border p-2">Hours Requested</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Project</th>
                <th className="border p-2">Requester</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Notes</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskRequests.map((task) => (
                <tr key={task.id} className="border">
                  <td className="border p-2">{task.name}</td>
                  <td className="border p-2">{task.task}</td>
                  <td className="border p-2">{task.hoursRequested}</td>
                  <td className="border p-2">{task.code}</td>
                  <td className="border p-2">{task.project}</td>
                  <td className="border p-2">{task.requestor}</td>
                  <td className="border p-2">{task.department}</td>
                  <td className="border p-2">{task.notes}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="bg-[#3b0764] text-white px-2 py-1 rounded hover:bg-blue-800"
                    >
                      <FiEdit /> Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Date and Time Selection */}
        {selectedTask && (
          <div className="bg-white p-6 shadow rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Approving Task: <span className="text-[#3b0764]">{selectedTask.task}</span>
            </h2>
            
            <div className="flex flex-col gap-4">
              {/* Calendar */}
              <div>
                <label className="font-semibold">Select Date:</label>
                <Calendar onChange={setSelectedDate} value={selectedDate} />
              </div>

              {/* Time Picker */}
              <div>
                <label className="font-semibold">Select Time:</label>
                <DateTimePicker onChange={setSelectedTime} value={selectedTime} />
              </div>

              {/* Hours Input */}
              <div>
                <label className="font-semibold">Approved Hours:</label>
                <input
                  type="number"
                  min="1"
                  max={selectedTask?.hoursRequested || 8}
                  value={approvedHours}
                  onChange={(e) => setApprovedHours(Number(e.target.value))}
                  className="border p-2 rounded w-20"
                />
              </div>

              {/* Approve Button */}
              <button
                onClick={handleApprove}
                className="bg-[#bef264] text-black px-4 py-2 rounded hover:bg-green-800"
              >
                <FiCheckCircle /> Approve
              </button>
            </div>
          </div>
        )}

        {/* Approved Tasks */}
        {approvedSlots.length > 0 && (
          <div className="bg-white p-6 shadow rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Approved Tasks</h2>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Code</th>
                  <th className="border p-2">Task</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Time Slot</th>
                  <th className="border p-2">Hours Approved</th>
                </tr>
              </thead>
              <tbody>
                {approvedSlots.map((slot, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{slot.name}</td>
                    <td className="border p-2">{slot.code}</td>
                    <td className="border p-2">{slot.task}</td>
                    <td className="border p-2">{slot.date}</td>
                    <td className="border p-2">{slot.timeSlot}</td>
                    <td className="border p-2">{slot.hoursApproved} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveTaskRequests;