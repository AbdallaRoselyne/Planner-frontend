import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CalendarPage = () => {
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    requestedName: "",
    project: "",
    projectCode: "",
    date: "",
  });

  // Fetch approved tasks from the backend
  useEffect(() => {
    fetchApprovedTasks();
  }, []);

  const fetchApprovedTasks = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/tasks?status=Approved"
      );
      const data = await response.json();
      setApprovedTasks(data);
    } catch (error) {
      console.error("Error fetching approved tasks:", error);
      toast.error("Failed to fetch approved tasks");
    }
  };

  // Function to get color class based on department
  const getDepartmentColorClass = (department) => {
    switch (department) {
      case "LEED":
        return "event-color-leed";
      case "BIM":
        return "event-color-bim";
      case "MEP":
        return "event-color-mep";
      default:
        return "event-color-default"; // Gray for tasks without a department
    }
  };

  // Function to schedule tasks sequentially for each user on the same day
  const scheduleTasksSequentially = (tasks) => {
    const userTaskMap = {};

    tasks.forEach((task) => {
      const taskDate = new Date(task.date).toISOString().split("T")[0];
      const userKey = `${task.requestedName}-${taskDate}`;

      if (!userTaskMap[userKey]) {
        userTaskMap[userKey] = {
          currentStartTime: new Date(task.date),
          tasks: [],
        };
        // Set the default start time to 8:30 AM
        userTaskMap[userKey].currentStartTime.setHours(8, 30, 0, 0);
      }

      const startTime = new Date(userTaskMap[userKey].currentStartTime);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + task.approvedHours);

      // Ensure the task does not exceed the 8-hour workday
      if (
        endTime.getHours() > 16 ||
        (endTime.getHours() === 16 && endTime.getMinutes() > 45)
      ) {
        toast.warning(
          `Task "${task.Task}" exceeds the 8-hour workday for ${task.requestedName} on ${taskDate}`
        );
        return; // Skip this task
      }

      // Add the task to the user's task list
      userTaskMap[userKey].tasks.push({
        ...task,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
      });

      // Update the current start time for the next task
      userTaskMap[userKey].currentStartTime = endTime;
    });

    // Flatten the userTaskMap into a single array of events
    return Object.values(userTaskMap).flatMap((userTasks) => userTasks.tasks);
  };

  // Format approved tasks for FullCalendar
  const calendarEvents = scheduleTasksSequentially(
    approvedTasks
      .filter((task) => {
        // Ensure task.date is valid
        if (!task.date || isNaN(new Date(task.date).getTime())) {
          console.error("Invalid date for task:", task);
          return false; // Skip this task
        }

        const taskDate = new Date(task.date).toISOString().split("T")[0];
        const filterDate = filters.date
          ? new Date(filters.date).toISOString().split("T")[0]
          : "";

        return (
          (!filters.requestedName ||
            task.requestedName
              ?.toLowerCase()
              .includes(filters.requestedName.toLowerCase())) &&
          (!filters.project ||
            task.project
              ?.toLowerCase()
              .includes(filters.project.toLowerCase())) &&
          (!filters.projectCode ||
            task.projectCode
              ?.toLowerCase()
              .includes(filters.projectCode.toLowerCase())) &&
          (!filters.date || taskDate === filterDate)
        );
      })
      .map((task) => ({
        ...task,
        hours: Number(task.approvedHours) || 1,
      }))
  )
    .map((task) => ({
      id: task._id,
      title: task.Task,
      start: task.start,
      end: task.end,
      className: getDepartmentColorClass(task.department), // Add class based on department
      extendedProps: {
        project: task.project,
        requestedName: task.requestedName,
        hours: task.approvedHours ,
        department: task.department, // Include department in extendedProps
      },
    }))
    .filter(Boolean); // Remove null values

  // Handle task click to show details
  const handleEventClick = (info) => {
    setSelectedTask({
      title: info.event.title,
      ...info.event.extendedProps,
      start: info.event.start,
      end: info.event.end,
    });
  };

  // Close the task details pop-up
  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-[#3b0764] mb-6">Task Calendar</h1>

      {/* Filters */}
      <div className="bg-white p-6 shadow rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Filter by Assignee"
            value={filters.requestedName}
            onChange={(e) =>
              setFilters({ ...filters, requestedName: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Filter by Project"
            value={filters.project}
            onChange={(e) =>
              setFilters({ ...filters, project: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Filter by Project Code"
            value={filters.projectCode}
            onChange={(e) =>
              setFilters({ ...filters, projectCode: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={() =>
              setFilters({ requestedName: "", project: "", date: "" })
            }
            className="bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86]"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white p-6 shadow rounded-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          eventContent={(eventInfo) => (
            <div className="p-2">
              <strong className="block text-sm font-semibold">
                {eventInfo.event.title}
              </strong>
              <p className="text-xs text-gray-600">
                {eventInfo.event.extendedProps.project}
              </p>
              <p className="text-xs text-gray-600">
                {eventInfo.event.extendedProps.requestedName}
              </p>
              <p className="text-xs text-gray-600">
                {eventInfo.event.extendedProps.hours} hours
              </p>
            </div>
          )}
          height="auto"
          editable
          selectable
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
            startTime: "08:30",
            endTime: "16:45",
          }}
          slotMinTime="08:30:00"
          slotMaxTime="16:45:00"
          slotDuration="00:30:00"
          allDaySlot={false}
        />
      </div>

      {/* Task Details Pop-up */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center backdrop-blur-sm z-50"
          onClick={closeTaskDetails} // Close modal when clicking outside the content
          onKeyDown={(e) => {
            if (e.key === "Escape") closeTaskDetails(); // Close modal on Escape key press
          }}
          tabIndex={-1} // Make the div focusable for key events
          style={{ overflow: "hidden" }} // Prevent background scrolling
        >
          <div
            className="bg-white p-6 rounded-lg w-96 shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
          >
            <h2 className="text-xl font-bold mb-4">Task Details</h2>
            <p>
              <strong>Task:</strong> {selectedTask.title}
            </p>
            <p>
              <strong>Assignee:</strong> {selectedTask.requestedName}
            </p>
            <p>
              <strong>Project:</strong> {selectedTask.project}
            </p>
            <p>
              <strong>Department:</strong> {selectedTask.department}
            </p>
            <p>
              <strong>Hours:</strong> {selectedTask.hours}
            </p>
            <p>
              <strong>Start:</strong> {selectedTask.start.toLocaleString()}
            </p>
            <p>
              <strong>End:</strong> {selectedTask.end.toLocaleString()}
            </p>
            <button
              onClick={closeTaskDetails}
              className="mt-4 bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add custom CSS for event colors */}
      <style>
        {`
          .event-color-leed {
            background-color: #c4b5fd !important;
            border-color: #c4b5fd !important;
          }
          .event-color-bim {
            background-color: #bef264 !important;
            border-color: #bef264 !important;
          }
          .event-color-mep {
            background-color: #a5b4fc !important;
            border-color: #a5b4fc !important;
          }
          .event-color-default {
            background-color: #6b7280 !important;
            border-color: #6b7280 !important;
          }
        `}
      </style>
    </div>
  );
};

export default CalendarPage;
