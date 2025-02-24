import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Users/Sidebar";
import AdminSidebar from "./components/Admin/adminSidebar";
import AboutUs from "./components/AboutUs";
import Login from "./components/Auth/Login";
import UserDashboard from "./components/Users/UserDashboard";
import MembersPage from "./components/Users/requests";
import TasksPage from "./components/Users/tasks";
import TimeTrackingPage from "./components/Users/time";
import CalendarPage from "./components/Users/calendar";
import AdminDashboard from "./components/Admin/adminDashboard";
import AdminMembers from "./components/Admin/adminMembers";
import ApproveTaskRequests from "./components/Admin/adminTasks";
import BudgetTimeTracking from "./components/Admin/adminBudget";
import ReportsAnalytics from "./components/Admin/adminReports";

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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 ">{children}</div>
    </div>
  );
}

/* Layout for Admin Pages */
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 ">{children}</div>
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

        {/* User Routes - Uses User Sidebar */}
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
        <Route
          path="/calendar"
          element={
            <UserLayout>
              <CalendarPage />
            </UserLayout>
          }
        />

        {/* Admin Routes - Uses Admin Sidebar */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
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
              <ApproveTaskRequests />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/budget"
          element={
            <AdminLayout>
              <BudgetTimeTracking />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminLayout>
              <ReportsAnalytics />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
