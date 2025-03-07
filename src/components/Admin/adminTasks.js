import React, { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-calendar/dist/Calendar.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import { FiCheckCircle, FiEdit, FiXCircle, FiFilter } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApproveTaskRequests = () => {
  const [taskRequests, setTaskRequests] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [approvedHours, setApprovedHours] = useState(2);
  const [comment, setComment] = useState("");
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [rejectedTasks, setRejectedTasks] = useState([]);
  const [filters, setFilters] = useState({
    requestedName: "",
    project: "",
    date: "",
  });

  useEffect(() => {
    fetchTaskRequests();
    fetchApprovedRejectedTasks();
  }, []);

  // Fetch pending task requests
  const fetchTaskRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/requests");
      const data = await response.json();
      setTaskRequests(data);
    } catch (error) {
      console.error("Error fetching task requests:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  // Fetch approved/rejected tasks
  const fetchApprovedRejectedTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();
      const approved = data.filter((task) => task.status === "Approved");
      const rejected = data.filter((task) => task.status === "Rejected");
      setApprovedTasks(approved);
      setRejectedTasks(rejected);
    } catch (error) {
      console.error("Error fetching approved/rejected tasks:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  const handleApprove = async () => {
    if (!selectedTask) return toast.error("Select a task first!");

    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${selectedTask._id}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            approvedHours,
            timeSlot: getTimeSlot(selectedDateTime),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to approve task");

      const approvedTask = await response.json();
      setApprovedTasks([...approvedTasks, approvedTask.task]);
      setTaskRequests(taskRequests.filter((task) => task._id !== selectedTask._id));
      setSelectedTask(null);
      setApprovedHours(8);
      setSelectedDateTime(new Date());
      toast.success("Task approved!");
    } catch (error) {
      console.error("Error approving task:", error);
      toast.error("Failed to approve task");
    }
  };

  const handleReject = async () => {
    if (!selectedTask) return toast.error("Select a task first!");
    if (!comment) return toast.error("Please provide a reason for rejection.");

    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${selectedTask._id}/reject`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject task");

      const rejectedTask = await response.json();
      setRejectedTasks([...rejectedTasks, rejectedTask.task]);
      setTaskRequests(taskRequests.filter((task) => task._id !== selectedTask._id));
      setSelectedTask(null);
      setComment("");
      toast.warning("Task rejected!");
    } catch (error) {
      console.error("Error rejecting task:", error);
      toast.error("Failed to reject task");
    }
  };

  const getTimeSlot = (time) => {
    const hours = time.getHours();
    if (hours >= 8 && hours < 10) return "Morning";
    if (hours >= 10 && hours < 12) return "Mid-Morning";
    if (hours >= 12 && hours < 16) return "Afternoon";
    return "Invalid Time";
  };

  const filteredTasks = taskRequests.filter((task) => {
    const taskDate = task.date ? new Date(task.date).toISOString().split("T")[0] : null;
    const filterDate = filters.date ? new Date(filters.date).toISOString().split("T")[0] : null;

    return (
      (!filters.requestedName || task.requestedName.includes(filters.requestedName)) &&
      (!filters.project || task.project.includes(filters.project)) &&
      (!filters.date || taskDate === filterDate)
    );
  });

  return (
    <div className="flex h-screen p-6 bg-gray-100">
      <ToastContainer />
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-[#3b0764]">Approve Task Requests</h1>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Filter by Assignee"
              value={filters.requestedName}
              onChange={(e) => setFilters({ ...filters, requestedName: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Filter by Project"
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="border p-2 rounded"
            />
            <button
              onClick={() => setFilters({ requestedName: "", project: "", date: "" })}
              className="bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86]"
            >
              <FiFilter /> Clear Filters
            </button>
          </div>
        </div>

        {/* Pending Task Requests */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Pending Task Requests</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Task</th>
                <th className="border p-2">Hours Requested</th>
                <th className="border p-2">Project</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Requester</th>
                <th className="border p-2">Notes</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} className="border">
                  <td className="border p-2">{task.requestedName}</td>
                  <td className="border p-2">{task.Task}</td>
                  <td className="border p-2">{task.hours}</td>
                  <td className="border p-2">{task.project}</td>
                  <td className="border p-2">{task.department}</td>
                  <td className="border p-2">{task.requester}</td>
                  <td className="border p-2">{task.Notes}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        task.status === "Pending"
                          ? "bg-yellow-200"
                          : task.status === "Approved"
                          ? "bg-green-200"
                          : "bg-red-200"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
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

        {/* Task Details Panel */}
        {selectedTask && (
          <div className="bg-white p-6 shadow rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Task Details: <span className="text-[#3b0764]">{selectedTask.Task}</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Name:</label>
                <p>{selectedTask.requestedName}</p>
              </div>
              <div>
              <label className="font-semibold">Email:</label>
              <p>{selectedTask.email}</p>
              </div>
              <div>
                <label className="font-semibold">Project:</label>
                <p>{selectedTask.project}</p>
              </div>
              <div>
                <label className="font-semibold">Hours Requested:</label>
                <p>{selectedTask.hours}</p>
              </div>
              <div>
                <label className="font-semibold">Department:</label>
                <p>{selectedTask.department}</p>
              </div>
              <div>
                <label className="font-semibold">Requester:</label>
                <p>{selectedTask.requester}</p>
              </div>
              <div>
                <label className="font-semibold">Notes:</label>
                <p>{selectedTask.Notes}</p>
              </div>
            </div>

            {/* Approval Panel */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Approve/Reject Task</h3>
              <div className="flex flex-col gap-4">
                {/* Time Picker */}
                <div>
                  <label className="font-semibold">Select Date and Time:</label>
                  <DateTimePicker
                    onChange={setSelectedDateTime}
                    value={selectedDateTime}
                  />
                </div>

                {/* Hours Input */}
                <div>
                  <label className="font-semibold">Approved Hours:</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTask?.hours || 8}
                    value={approvedHours}
                    onChange={(e) => setApprovedHours(Number(e.target.value))}
                    className="border p-2 rounded w-20"
                  />
                </div>

                {/* Comment Box */}
                <div>
                  <label className="font-semibold">Comment (for rejection):</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border p-2 rounded w-full"
                    rows="3"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleApprove}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    <FiCheckCircle /> Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    <FiXCircle /> Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approved/Rejected Tasks */}
        {(approvedTasks.length > 0 || rejectedTasks.length > 0) && (
          <div className="bg-white p-6 shadow rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Approved/Rejected Tasks</h2>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Task</th>
                  <th className="border p-2">Project</th>
                  <th className="border p-2">Hours</th>
                  <th className="border p-2">Time Slot</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedTasks.map((task, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{task.requestedName}</td>
                    <td className="border p-2">{task.email}</td>
                    <td className="border p-2">{task.Task}</td>
                    <td className="border p-2">{task.project}</td>
                    <td className="border p-2">{task.approvedHours}</td>
                    <td className="border p-2">{task.timeSlot}</td>
                    <td className="border p-2">{new Date(task.date).toLocaleDateString()}</td>
                    <td className="border p-2">
                      <span className="px-2 py-1 rounded bg-green-200">Approved</span>
                    </td>
                  </tr>
                ))}
                {rejectedTasks.map((task, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{task.requestedName}</td>
                    <td className="border p-2">{task.email}</td>
                    <td className="border p-2">{task.Task}</td>
                    <td className="border p-2">{task.project}</td>
                    <td className="border p-2">{task.hours}</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">{new Date(task.date).toLocaleDateString()}</td>
                    <td className="border p-2">
                      <span className="px-2 py-1 rounded bg-red-200">Rejected</span>
                    </td>
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