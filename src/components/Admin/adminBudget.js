import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCode, FiPlus, FiEdit, FiTrash, FiFilter } from "react-icons/fi";

const API_URL = "http://localhost:5000/api/projects";

const BudgetTracking = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("name"); // Default filter by project name
  const [newProject, setNewProject] = useState({
    code: "",
    name: "",
    department: "",
    budget: "",
    hours: "",
    teamLeader: "",
    director: "",
    stage: "",
    budgetspent: 0,
    hoursLogged: 0,
    remaininghours: 0,
    remainingbudget: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const payload = {
      ...newProject,
      budget: parseFloat(newProject.budget), // Ensure budget is a number
      hours: parseFloat(newProject.hours), // Ensure hours is a number
    };
    console.log("Sending payload:", payload); // Log the payload
    try {
      const response = await axios.post(API_URL, payload);
      setProjects([...projects, response.data]);
      setNewProject({
        code: "",
        name: "",
        department: "",
        budget: "",
        hours: "",
        teamLeader: "",
        director: "",
        stage: "",
        budgetspent: 0,
        hoursLogged: 0,
        remaininghours: 0,
        remainingbudget: 0,
      });
      setShowModal(false);
      setError("");
    } catch (error) {
      console.error("Error adding project:", error);
      console.error("Error response:", error.response); // Log the error response
      setError("Failed to add project. Please try again.");
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    const payload = {
      ...editProject,
      budget: parseFloat(editProject.budget), // Ensure budget is a number
      hours: parseFloat(editProject.hours), // Ensure hours is a number
    };
    console.log("Sending payload:", payload); // Log the payload
    try {
      const response = await axios.put(`${API_URL}/${editProject._id}`, payload);
      setProjects(
        projects.map((project) =>
          project._id === editProject._id ? response.data : project
        )
      );
      setEditProject(null);
      setError("");
    } catch (error) {
      console.error("Error editing project:", error);
      console.error("Error response:", error.response); // Log the error response
      setError("Failed to update project. Please try again.");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project[filterCriteria].toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex h-screen p-6 bg-gray-100 min-h-screen">
      <div className="flex-1">
        <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-[#3b0764]">
            Budget & Time Tracking
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#bef264] text-black px-4 py-2 rounded hover:bg-[#a3d133]"
          >
            <FiPlus className="text-xl" /> Add Project
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Project Budgets</h2>
            <div className="flex items-center gap-2">
              <FiFilter className="text-xl" />
              <select
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="name">Project Name</option>
                <option value="code">Project Code</option>
                <option value="department">Department</option>
                <option value="teamLeader">Team Leader</option>
                <option value="director">Director</option>
                <option value="stage">Stage</option>
              </select>
              <input
                type="text"
                placeholder={`Filter by ${filterCriteria}`}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
          </div>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Project Code</th>
                <th className="border p-2">Project Name</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Total Budget</th>
                <th className="border p-2">Estimated Hours</th>
                <th className="border p-2">Team Leader</th>
                <th className="border p-2">Director</th>
                <th className="border p-2">Stage</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project._id} className="border">
                  <td className="border p-2">#{project.code}</td>
                  <td
                    className="border p-2 cursor-pointer text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedProject(project)}
                  >
                    {project.name}
                  </td>
                  <td className="border p-2">{project.department}</td>
                  <td className="border p-2">{project.budget}</td>
                  <td className="border p-2">{project.hours}</td>
                  <td className="border p-2">{project.teamLeader}</td>
                  <td className="border p-2">{project.director}</td>
                  <td className="border p-2">{project.stage}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => setEditProject(project)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add New Project</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>
            <form onSubmit={handleAddProject} className="space-y-4">
              {[
                { label: "Project Code", name: "code" },
                { label: "Project Name", name: "name" },
                { label: "Budget (MUR)", name: "budget", type: "number" },
                { label: "Estimated Hours", name: "hours", type: "number" },
                { label: "Team Leader", name: "teamLeader" },
                { label: "Director", name: "director" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block font-medium">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={newProject[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block font-medium">Department</label>
                <select
                  name="department"
                  value={newProject.department}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Department</option>
                  {["LEED", "BIM", "MEP"].map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Stage</label>
                <select
                  name="stage"
                  value={newProject.stage}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Stage</option>
                  {[
                    "Preparation and Brief",
                    "Survey",
                    "Concept Design",
                    "Draft EA Report",
                    "Final EA Report",
                    "Detailed Design",
                    "Technical Design",
                    "Construction",
                  ].map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86] w-full"
              >
                Add Project
              </button>
            </form>
          </div>
        </div>
      )}

      {editProject && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Project</h2>
              <button
                onClick={() => setEditProject(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>
            <form onSubmit={handleEditProject} className="space-y-4">
              {[
                { label: "Project Code", name: "code" },
                { label: "Project Name", name: "name" },
                { label: "Budget (MUR)", name: "budget", type: "number" },
                { label: "Estimated Hours", name: "hours", type: "number" },
                { label: "Team Leader", name: "teamLeader" },
                { label: "Director", name: "director" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block font-medium">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={editProject[field.name] || ""}
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block font-medium">Department</label>
                <select
                  name="department"
                  value={editProject.department || ""}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      department: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Department</option>
                  {["LEED", "BIM", "MEP"].map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Stage</label>
                <select
                  name="stage"
                  value={editProject.stage || ""}
                  onChange={(e) =>
                    setEditProject({ ...editProject, stage: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Stage</option>
                  {[
                    "Preparation and Brief",
                    "Survey",
                    "Concept Design",
                    "Draft EA Report",
                    "Final EA Report",
                    "Detailed Design",
                    "Technical Design",
                    "Construction",
                  ].map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86] w-full"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{selectedProject.name}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Budget Spent</label>
                <p>{selectedProject.budgetspent}</p>
              </div>
              <div>
                <label className="block font-medium">Hours Logged</label>
                <p>{selectedProject.hoursLogged}</p>
              </div>
              <div>
                <label className="block font-medium">Remaining Hours</label>
                <p>{selectedProject.hours - selectedProject.hoursLogged}</p>
              </div>
              <div>
                <label className="block font-medium">Remaining Budget</label>
                <p>{selectedProject.budget - selectedProject.budgetspent}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracking;