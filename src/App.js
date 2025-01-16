import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import AboutUs from "./components/AboutUs";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Sidebar from "./components/Users/Sidebar";
import UserRequestForm from "./components/Users/UserRequestForm";
import Adminsidebar from "./components/Admin/Adminsidebar";
import Plannersidebar from "./components/Planners/PlannerDashboard";


function Layout({ children }) {
  const location = useLocation();
  const showNavbar = location.pathname === "/";

  return (
    <div>
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
}

function DashboardLayout({ children, welcomeMessage, description }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        {/* Welcome message and description */}
        <div className="mb-6 bg-[#f3f4f6] p-4 rounded shadow">
          <h1 className="text-2xl font-bold text-[#3b0764]">
            {welcomeMessage}
          </h1>
          <p className="text-gray-600">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function AdminDashboardLayout({ children, welcomeMessage, description }) {
  return (
    <div className="flex">
      <Adminsidebar />
      <div className="flex-1 p-4">
        {/* Welcome message and description */}
        <div className="mb-6 bg-[#f3f4f6] p-4 rounded shadow">
          <h1 className="text-2xl font-bold text-[#3b0764]">
            {welcomeMessage}
          </h1>
          <p className="text-gray-600">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function PlannerDashboardLayout({ children, welcomeMessage, description }) {
  return (
    <div className="flex">
      <Plannersidebar />
      <div className="flex-1 p-4">
        {/* Welcome message and description */}
        <div className="mb-6 bg-[#f3f4f6] p-4 rounded shadow">
          <h1 className="text-2xl font-bold text-[#3b0764]">
            {welcomeMessage}
          </h1>
          <p className="text-gray-600">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                welcomeMessage="Welcome to the Dashboard"
                description="Here you can manage all your projects and track their progress."
              >
                <h2 className="text-lg text-gray-700">
                  This is your dashboard overview.
                </h2>
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/user-request"
            element={
              <DashboardLayout
                welcomeMessage="User Requests"
                description="Manage and track user requests for resources below."
              >
                <UserRequestForm />
              </DashboardLayout>
            }
          />
           <Route
            path="/admin"
            element={
              <AdminDashboardLayout
                welcomeMessage="Welcome to the Admin Dashboard"
                description="Here you can manage all your projects and track their progress."
              >
                <h2 className="text-lg text-gray-700">
                  This is your dashboard overview.
                </h2>
              </AdminDashboardLayout>
            }
          />

          <Route
            path="/planner"
            element={
              <PlannerDashboardLayout
                welcomeMessage="Welcome to the Planner Dashboard"
                description="Here you can manage all your projects and track their progress."
              >
                <h2 className="text-lg text-gray-700">
                  This is your dashboard overview.
                </h2>
              </PlannerDashboardLayout>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
