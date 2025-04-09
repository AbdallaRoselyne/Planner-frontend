import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import './tasks.css';

const Timesheet = () => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: getMonday(new Date()).toISOString().split('T')[0],
    end: getSunday(new Date()).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  const getEmailFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const decoded = jwtDecode(token);
      if (!decoded.email) throw new Error('Email not found in token');
      return decoded.email.toLowerCase();
    } catch (error) {
      console.error('Token decoding error:', error);
      toast.error('Authentication error. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw error;
    }
  };

  const fetchTimesheetData = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end
      }).toString();
      
      const response = await fetch(`http://localhost:5000/api/tasks/timesheet?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setTimesheetData(data);
    } catch (error) {
      toast.error(error.message);
      console.error('Error fetching timesheet data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheetData();
  }, [dateRange]);

  const calculateTotals = () => {
    const projectTotals = {};
    let grandTotalApproved = 0;
    let grandTotalActual = 0;

    timesheetData.forEach(task => {
      if (!projectTotals[task.project._id]) {
        projectTotals[task.project._id] = {
          name: task.project.name,
          code: task.project.code,
          approved: 0,
          actual: 0
        };
      }

      projectTotals[task.project._id].approved += task.approvedHours;
      projectTotals[task.project._id].actual += task.actualHours;
      grandTotalApproved += task.approvedHours;
      grandTotalActual += task.actualHours;
    });

    return { projectTotals, grandTotalApproved, grandTotalActual };
  };

  const { projectTotals, grandTotalApproved, grandTotalActual } = calculateTotals();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="modern-task-container">
      <header className="task-header">
        <h1>Timesheet</h1>
        <div className="header-controls">
          <div className="date-range-picker">
            <label>From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <label>To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
            <button onClick={fetchTimesheetData}>Apply</button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading timesheet data...</p>
        </div>
      ) : timesheetData.length === 0 ? (
        <div className="empty-state">
          <img src="/illustration-empty.svg" alt="No data" />
          <h3>No timesheet data found for selected period</h3>
          <p>Try adjusting the date range</p>
        </div>
      ) : (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Approved Hours</h3>
              <p>{grandTotalApproved.toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <h3>Total Actual Hours</h3>
              <p>{grandTotalActual.toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <h3>Variance</h3>
              <p className={grandTotalActual > grandTotalApproved ? 'negative' : 'positive'}>
                {(grandTotalApproved - grandTotalActual).toFixed(2)}
              </p>
            </div>
          </div>

          <h2>By Project</h2>
          <table className="timesheet-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Approved Hours</th>
                <th>Actual Hours</th>
                <th>Variance</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(projectTotals).map(project => (
                <tr key={project.code}>
                  <td>{project.name} ({project.code})</td>
                  <td>{project.approved.toFixed(2)}</td>
                  <td>{project.actual.toFixed(2)}</td>
                  <td className={project.actual > project.approved ? 'negative' : 'positive'}>
                    {(project.approved - project.actual).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Task Details</h2>
          <table className="timesheet-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Approved Hours</th>
                <th>Actual Hours</th>
                <th>Variance</th>
                <th>Completed Date</th>
              </tr>
            </thead>
            <tbody>
              {timesheetData.map(task => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.project.name} ({task.project.code})</td>
                  <td>{task.approvedHours.toFixed(2)}</td>
                  <td>{task.actualHours.toFixed(2)}</td>
                  <td className={task.actualHours > task.approvedHours ? 'negative' : 'positive'}>
                    {(task.approvedHours - task.actualHours).toFixed(2)}
                  </td>
                  <td>{formatDate(task.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

function getMonday(d) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getSunday(d) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() + (7 - day);
  return new Date(d.setDate(diff));
}

export default Timesheet;