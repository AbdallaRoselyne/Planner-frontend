import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUserPlus, FiEdit, FiTrash2, FiX } from "react-icons/fi";

const MembersPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [requestedMembers, setRequestedMembers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [requestData, setRequestData] = useState({
    requestedName: "",
    projectCode: "",
    project: "",
    department: "",
    hours: "",
    requester: "",
    Task: "",
    Notes: "",
  });

  // Fetch requests and projects
  useEffect(() => {
    fetchRequests();
    if (showModal) {
      fetchProjects();
    }
  }, [showModal]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/requests");
      setRequestedMembers(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const response = await axios.put(
          `http://localhost:5000/api/requests/${editId}`,
          requestData
        );
        setRequestedMembers(
          requestedMembers.map((req) =>
            req._id === editId ? response.data : req
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/requests",
          requestData
        );
        setRequestedMembers([...requestedMembers, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleEdit = (request) => {
    setRequestData(request);
    setEditId(request._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await axios.delete(`http://localhost:5000/api/requests/${id}`);
        setRequestedMembers(requestedMembers.filter((req) => req._id !== id));
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const resetForm = () => {
    setRequestData({
      requestedName: "",
      projectCode: "",
      project: "",
      department: "",
      hours: "",
      requester: "",
      Task: "",
      Notes: "",
    });
    setEditMode(false);
    setEditId(null);
    setShowModal(false);
  };

  const filteredMembers = requestedMembers.filter(
    (member) =>
      member.requestedName.toLowerCase().includes(filterText.toLowerCase()) ||
      member.projectCode.toLowerCase().includes(filterText.toLowerCase()) ||
      member.department.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="flex h-screen p-6 bg-gray-100 min-h-screen">
      <div className="flex-1">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-[#3b0764]">
            Request Resources
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#bef264] text-black px-4 py-2 rounded hover:bg-[#a3d133]"
          >
            <FiUserPlus className="text-xl" /> Request resources
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Requested Resources</h2>
          <input
            type="text"
            placeholder="Filter by name or project code"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          {filteredMembers.length === 0 ? (
            <p className="text-gray-500">No resources requested yet.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Name</th>
                  <th className="p-2">Project Code</th>
                  <th className="p-2">Project</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Hours</th>
                  <th className="p-2">Requester</th>
                  <th className="p-2">Task</th>
                  <th className="p-2">Notes</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member._id} className="text-center">
                    <td className="p-2">{member.requestedName}</td>
                    <td className="p-2">{member.projectCode}</td>
                    <td className="p-2">{member.project}</td>
                    <td className="p-2">{member.department}</td>
                    <td className="p-2">{member.hours}</td>
                    <td className="p-2">{member.requester}</td>
                    <td className="p-2">{member.Task}</td>
                    <td className="p-2">{member.Notes}</td>
                    <td className="p-2 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-green-600 cursor-pointer"
                      >
                        <FiEdit className="text-xl" />
                      </button>
                      <FiTrash2
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDelete(member._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Selected Task */}
      {selectedTask && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Task Details</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="space-y-4">
              <p><strong>Name:</strong> {selectedTask.requestedName}</p>
              <p><strong>Project Code:</strong> {selectedTask.projectCode}</p>
              <p><strong>Project:</strong> {selectedTask.project}</p>
              <p><strong>Department:</strong> {selectedTask.department}</p>
              <p><strong>Hours:</strong> {selectedTask.hours}</p>
              <p><strong>Requester:</strong> {selectedTask.requester}</p>
              <p><strong>Task:</strong> {selectedTask.Task}</p>
              <p><strong>Notes:</strong> {selectedTask.Notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Requests */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editMode ? "Edit Request" : "Request a New Member"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="requestedName"
                value={requestData.requestedName}
                onChange={handleChange}
                placeholder="Requested Name"
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="projectCode"
                value={requestData.projectCode}
                onChange={(e) => {
                  handleChange(e);
                  const selectedProject = projects.find(
                    (p) => p.code === e.target.value
                  );
                  if (selectedProject) {
                    setRequestData((prev) => ({
                      ...prev,
                      project: selectedProject.name,
                      department: selectedProject.department,
                    }));
                  }
                }}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Project Code</option>
                {projects.map((project) => (
                  <option key={project.code} value={project.code}>
                    {project.code}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="project"
                value={requestData.project}
                onChange={handleChange}
                placeholder="Project"
                className="w-full p-2 border rounded"
                required
                readOnly
              />
              
              <input
                type="text"
                name="department"
                value={requestData.department}
                onChange={handleChange}
                placeholder="Department"
                className="w-full p-2 border rounded"
                required
                readOnly
              />

              <input
                type="number"
                name="hours"
                value={requestData.hours}
                onChange={handleChange}
                placeholder="Hours"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="requester"
                value={requestData.requester}
                onChange={handleChange}
                placeholder="Requester"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="Task"
                value={requestData.Task}
                onChange={handleChange}
                placeholder="Task"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="Notes"
                value={requestData.Notes}
                onChange={handleChange}
                placeholder="Notes"
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86] w-full"
              >
                {editMode ? "Update Request" : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;