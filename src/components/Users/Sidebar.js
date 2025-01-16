import React from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function Sidebar() {
  return (
    <div className="bg-[#3b0764] text-white h-screen w-64 p-4 flex flex-col">
      {/* Logo Section */}
      <div className="text-large font-bold mb-8">
        Pro<span className="text-[#bef264]">Design</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4">
        {/* Dashboard Link */}
        <Link
          to="/dashboard"
          className="hover:bg-[#bef264] hover:text-[#3b0764] px-4 py-2 rounded transition-colors"
        >
          Dashboard
        </Link>

        {/* User Requests Link */}
        <Link
          to="/dashboard/user-request"
          className="hover:bg-[#bef264] hover:text-[#3b0764] px-4 py-2 rounded transition-colors"
        >
          User Request
        </Link>

        {/* Logout Link */}
        <Link
          to="/logout"
          className="flex items-center space-x-2 hover:bg-[#bef264] hover:text-[#3b0764] px-4 py-2 rounded transition-colors"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
