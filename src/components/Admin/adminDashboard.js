import React from "react";
import { FiUsers, FiClipboard, FiDollarSign, FiBarChart2, FiSettings } from "react-icons/fi";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-[#3b0764]">Admin Dashboard</h1>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Manage Users */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <FiUsers className="text-blue-700 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Manage Users</h2>
              <p className="text-gray-600">View, edit, and remove users.</p>
            </div>
          </div>

          {/* Approve Tasks */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <FiClipboard className="text-green-700 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Approve Tasks</h2>
              <p className="text-gray-600">Review and approve user-submitted tasks.</p>
            </div>
          </div>

          {/* Budget & Tracking */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <FiDollarSign className="text-yellow-700 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Budget & Tracking</h2>
              <p className="text-gray-600">Manage financial and time tracking records.</p>
            </div>
          </div>

          {/* Reports & Analytics */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <FiBarChart2 className="text-purple-700 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">Reports & Analytics</h2>
              <p className="text-gray-600">Generate insights and monitor performance.</p>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white p-4 shadow rounded-lg flex items-center">
            <FiSettings className="text-red-700 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold">System Settings</h2>
              <p className="text-gray-600">Modify system configurations and roles.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
