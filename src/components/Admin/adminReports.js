import React, { useState } from "react";
import { Bar, Pie } from "recharts";
import { FiFilter } from "react-icons/fi";

const ReportsAnalytics = () => {
  const [filter, setFilter] = useState("All");

  const taskProgressData = [
    { name: "Completed", value: 60 },
    { name: "In Progress", value: 30 },
    { name: "Pending", value: 10 },
  ];

  const budgetUsageData = [
    { name: "Used Budget", value: 75000 },
    { name: "Remaining Budget", value: 25000 },
  ];

  const workloadData = [
    { name: "John Doe", tasks: 5 },
    { name: "Jane Smith", tasks: 8 },
    { name: "Alex Johnson", tasks: 4 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-[#3b0764] mb-4">Reports & Analytics</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">Filter By:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option>All</option>
          <option>Task Progress</option>
          <option>Budget Usage</option>
          <option>Workload</option>
        </select>
        <button className="bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86]">
          <FiFilter className="inline mr-2" /> Apply
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="font-semibold mb-4">Task Progress</h2>
          <Pie data={taskProgressData} dataKey="value" nameKey="name" outerRadius={80} fill="#3b0764" />
        </div>
        
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="font-semibold mb-4">Budget Usage (MUR)</h2>
          <Pie data={budgetUsageData} dataKey="value" nameKey="name" outerRadius={80} fill="#bef264" />
        </div>

        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="font-semibold mb-4">Workload Distribution</h2>
          <Bar data={workloadData} dataKey="tasks" fill="#3b0764" />
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
