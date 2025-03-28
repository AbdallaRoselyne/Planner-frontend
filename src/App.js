import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Users/Sidebar";
import AdminSidebar from "./components/Admin/Adminsidebar";
import AboutUs from "./components/AboutUs";
import Login from "./components/Auth/Login";
import UserDashboard from "./components/Users/UserDashboard";
import MembersPage from "./components/Users/requests";
import TasksPage from "./components/Users/tasks";
import TimeTrackingPage from "./components/Users/time";
import AdminMembers from "./components/Admin/adminMembers";
import AdminCalendar from "./components/Admin/calendar/CalendarPage";
import BudgetTracking from './components/Admin/Budget/BudgetTracking'; // Updated path
import AdminApprove from "./components/Admin/AdminApprove"; 

/*Layout for About Us Page */
function AboutUsLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

/* Layout for User Pages */
function UserLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </div>
  );
}

/* Layout for Admin Pages */
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AboutUsLayout>
              <AboutUs />
            </AboutUsLayout>
          }
        />
        <Route path="/login" element={<Login />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          }
        />
        <Route
          path="/members"
          element={
            <UserLayout>
              <MembersPage />
            </UserLayout>
          }
        />
        <Route
          path="/tasks"
          element={
            <UserLayout>
              <TasksPage />
            </UserLayout>
          }
        />
        <Route
          path="/time"
          element={
            <UserLayout>
              <TimeTrackingPage />
            </UserLayout>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminCalendar />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <AdminMembers />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <AdminLayout>
              <AdminApprove />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/budget"
          element={
            <AdminLayout>
              <BudgetTracking />
            </AdminLayout>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;