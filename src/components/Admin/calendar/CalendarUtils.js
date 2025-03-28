export const fetchApprovedTasks = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/tasks?status=Approved"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching approved tasks:", error);
    throw error;
  }
};

export const getDepartmentColorClass = (department) => {
  const departmentColors = {
    LEED: "event-color-leed",
    BIM: "event-color-bim",
    MEP: "event-color-mep",
    default: "event-color-default",
  };
  return departmentColors[department] || departmentColors.default;
};

export const scheduleTasksSequentially = (tasks) => {
  const userTaskMap = {};

  tasks.forEach((task) => {
    if (!task.date || isNaN(new Date(task.date).getTime())) {
      console.error("Invalid date for task:", task);
      return;
    }

    const taskDate = new Date(task.date).toISOString().split("T")[0];
    const userKey = `${task.requestedName}-${taskDate}`;

    if (!userTaskMap[userKey]) {
      userTaskMap[userKey] = {
        currentStartTime: new Date(task.date),
        tasks: [],
      };
      userTaskMap[userKey].currentStartTime.setHours(8, 30, 0, 0);
    }

    const startTime = new Date(userTaskMap[userKey].currentStartTime);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + (Number(task.approvedHours) || 1));

    if (
      endTime.getHours() > 16 ||
      (endTime.getHours() === 16 && endTime.getMinutes() > 45)
    ) {
      console.warn(
        `Task "${task.Task}" exceeds workday for ${task.requestedName}`
      );
      return;
    }

    userTaskMap[userKey].tasks.push({
      ...task,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
    });

    userTaskMap[userKey].currentStartTime = endTime;
  });

  return Object.values(userTaskMap).flatMap((userTasks) => userTasks.tasks);
};

export const filterTasks = (tasks, filters) => {
  return tasks.filter((task) => {
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
        task.project?.toLowerCase().includes(filters.project.toLowerCase())) &&
      (!filters.projectCode ||
        task.projectCode
          ?.toLowerCase()
          .includes(filters.projectCode.toLowerCase())) &&
      (!filters.date || taskDate === filterDate)
    );
  });
};

export const exportToCSV = (events) => {
  // First ensure all dates are Date objects
  const processedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  // Sort events by date and time
  const sortedEvents = [...processedEvents].sort((a, b) => {
    return a.start - b.start;
  });

  // Group by date for timetable format
  const timetable = {};

  sortedEvents.forEach((event) => {
    const dateStr = event.start.toISOString().split("T")[0];
    const timeSlot = `${event.start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${event.end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    if (!timetable[dateStr]) {
      timetable[dateStr] = [];
    }

    timetable[dateStr].push({
      timeSlot,
      assignee: event.extendedProps.requestedName,
      task: event.title,
      project: event.extendedProps.project,
      department: event.extendedProps.department,
      hours: event.extendedProps.hours,
    });
  });

  // Create CSV content with timetable format
  let csvContent = "Date,Time,Assignee,Task,Project,Department,Hours\n";

  Object.entries(timetable).forEach(([date, entries]) => {
    const formattedDate = new Date(date).toLocaleDateString();

    entries.forEach((entry) => {
      csvContent +=
        [
          `"${formattedDate}"`,
          `"${entry.timeSlot}"`,
          `"${entry.assignee}"`,
          `"${entry.task}"`,
          `"${entry.project}"`,
          `"${entry.department}"`,
          `"${entry.hours}"`,
        ].join(",") + "\n";
    });
  });

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `timetable_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
