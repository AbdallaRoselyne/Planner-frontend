import React, { useState, useEffect } from "react";
import { FiClipboard } from "react-icons/fi";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [showAllTasks, setShowAllTasks] = useState(false); // Toggle between user tasks and all tasks

  // Fetch tasks based on the toggle state
  const fetchTasks = async () => {
    try {
      const email = localStorage.getItem("email"); // Retrieve email from localStorage

      if (!email) {
        console.error("Email not found in localStorage");
        setTasks([]); // Set tasks to an empty array
        return;
      }

      let url = `http://localhost:5000/api/tasks`;
      if (!showAllTasks) {
        url += `/user/${email}`; // Fetch tasks for the logged-in user using email
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: Expected an array");
      }

      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Set tasks to an empty array in case of error
    }
  };

  useEffect(() => {
    fetchTasks();

    // Set up WebSocket connection
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const updatedTask = JSON.parse(event.data);

      // Update the task list
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close(); // Clean up WebSocket connection
    };
  }, [showAllTasks]); // Re-fetch tasks when showAllTasks changes

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-[#3b0764]">Assigned Tasks</h1>
        <button
          onClick={() => setShowAllTasks(!showAllTasks)}
          className="bg-[#3b0764] text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        >
          {showAllTasks ? "Show My Tasks" : "Show All Tasks"}
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Task List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Project Code</th>
              <th className="border border-gray-300 p-2">Project Name</th>
              <th className="border border-gray-300 p-2">Remaining Hrs</th>
              <th className="border border-gray-300 p-2">Task Name</th>
              <th className="border border-gray-300 p-2">Requester</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Hours Assigned</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="bg-gray-50">
                <td className="border border-gray-300 p-2">{task.projectCode}</td>
                <td className="border border-gray-300 p-2">{task.project}</td>
                <td className="border border-gray-300 p-2">{task.hours - task.approvedHours}</td>
                <td className="border border-gray-300 p-2">{task.Task}</td>
                <td className="border border-gray-300 p-2">{task.requester}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(task.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">{task.approvedHours}</td>
                <td className="border border-gray-300 p-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      task.status === "Approved"
                        ? "bg-green-200"
                        : task.status === "Rejected"
                        ? "bg-red-200"
                        : "bg-yellow-200"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksPage;