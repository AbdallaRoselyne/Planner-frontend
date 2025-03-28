import React from "react";
import { FiClock, FiCalendar, FiCheckCircle, FiUserPlus, FiLogOut, FiHome } from "react-icons/fi";


const Sidebar = () => {
    
    return (
        <div className="w-64 bg-[#3b0764] text-white flex flex-col p-6">
        <div className="text-large font-bold mb-8">
            Pro<span className="text-[#bef264]">Design</span>
        </div>
        <nav className="flex flex-col gap-4">
            <a href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-[#4c0a86] rounded">
            <FiCalendar className="text-xl" /> Calendar
            </a>
            <a href="/members" className="flex items-center gap-2 p-2 hover:bg-[#4c0a86] rounded">
            <FiUserPlus className="text-xl" /> Request Member
            </a>
            <a href="/tasks" className="flex items-center gap-2 p-2 hover:bg-[#4c0a86] rounded">
            <FiCheckCircle className="text-xl" /> Assigned Tasks
            </a>
            <a href="/time" className="flex items-center gap-2 p-2 hover:bg-[#4c0a86] rounded">
            <FiClock className="text-xl" /> Time Sheet
            </a>
            
        </nav>
        <div className="mt-auto">
            <button className="flex items-center gap-2 p-2 bg-[#bef264] hover:bg-[#bef264] rounded w-full text-black">
            <FiLogOut className="text-xl" /> Logout
            </button>
        </div>
        </div>
    );
    };


export default Sidebar;