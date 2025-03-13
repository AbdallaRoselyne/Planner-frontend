import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserCalendar = ({ userId }) => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks for the logged-in user
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/user/${userId}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, [userId]);

  // Format tasks for FullCalendar
  const calendarEvents = tasks.map((task) => ({
    id: task._id,
    title: task.Task,
    start: task.date,
    end: new Date(new Date(task.date).getTime() + task.hours * 60 * 60 * 1000), // Calculate end time
    extendedProps: {
      project: task.project,
      requestedName: task.requestedName,
      hours: task.hours,
    },
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-[#3b0764] mb-6">My Calendar</h1>

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
    </div>
  );
};

export default UserCalendar;