import React from "react";
import {
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiUserPlus,
  FiLogOut,
  FiHome,
} from "react-icons/fi";

const UserDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-[#3b0764]">User Dashboard</h1>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Task Requests */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <FiUserPlus className="text-blue-700 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Request Team Member</h2>
              <p className="text-gray-600">
                Request a member to collaborate on a task.
              </p>
            </div>
          </div>

          {/* Assigned Tasks */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <FiCheckCircle className="text-green-700 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Assigned Tasks</h2>
              <p className="text-gray-600">
                View your ongoing and completed tasks.
              </p>
            </div>
          </div>

          {/* Time Tracking */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <FiClock className="text-yellow-700 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Time Sheet</h2>
              <p className="text-gray-600">Log your work hours efficiently.</p>
            </div>
          </div>

          {/* Calendar Integration */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <FiCalendar className="text-purple-700 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Calendar Integration</h2>
              <p className="text-gray-600">
                Sync tasks with Microsoft Calendar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
