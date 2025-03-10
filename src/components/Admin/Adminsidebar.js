import React from "react";
import { FiUsers, FiClipboard, FiDollarSign, FiBarChart2, FiLogOut, FiHome, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#3b0764] text-white flex flex-col p-6 overflow-hidden">
      <div className="text-large font-bold mb-8">
        Pro<span className="text-[#bef264]">Design</span>
      </div>
      <nav className="flex flex-col gap-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-[#374151] rounded">
          <FiCalendar className="text-xl" /> Calendar
        </Link>
        <Link to="/admin/users" className="flex items-center gap-2 p-2 hover:bg-[#374151] rounded">
          <FiUsers className="text-xl" /> Manage Users & Teams
        </Link>
        <Link to="/admin/tasks" className="flex items-center gap-2 p-2 hover:bg-[#374151] rounded">
          <FiClipboard className="text-xl" /> Approve Task Requests
        </Link>
        <Link to="/admin/budget" className="flex items-center gap-2 p-2 hover:bg-[#374151] rounded">
          <FiDollarSign className="text-xl" /> Budget & Time Tracking
        </Link>
        <Link to="/admin/reports" className="flex items-center gap-2 p-2 hover:bg-[#374151] rounded">
          <FiBarChart2 className="text-xl" /> Reports & Analytics
        </Link>
      </nav>
      <div className="mt-auto">
        <button className="flex items-center gap-2 p-2 bg-[#bef264] hover:bg-[#a3d133] rounded w-full text-black">
          <FiLogOut className="text-xl" /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
