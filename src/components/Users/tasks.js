import React from "react";
import { FiClipboard } from "react-icons/fi";

const TasksPage = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-[#3b0764]">Assigned Tasks</h1>
      </div>

      {/* Tasks List */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Task List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Project Code</th>
              <th className="border border-gray-300 p-2">Project Name</th>
              <th className="border border-gray-300 p-2">Task Name</th>
                <th className="border border-gray-300 p-2">Remaining Hrs</th>
              <th className="border border-gray-300 p-2">Assigned To</th>
              <th className="border border-gray-300 p-2">Hours Assigned</th>
              <th className="border border-gray-300 p-2">Department</th>
            </tr>
          </thead>
          <tbody>
            {/* Example Task Row */}
            <tr className="bg-gray-50">
              <td className="border border-gray-300 p-2">P001</td>
              <td className="border border-gray-300 p-2">Project Alpha</td>
              <td className="border border-gray-300 p-2">Design UI</td>
              <td className="border border-gray-300 p-2">John Doe</td>
              <td className="border border-gray-300 p-2">10</td>
              <td className="border border-gray-300 p-2">20</td>
              <td className="border border-gray-300 p-2">Design</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksPage;
