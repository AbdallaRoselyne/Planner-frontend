import React, { useState } from "react";
import { FiPlus, FiEdit } from "react-icons/fi";

const BudgetTracking = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project Alpha",
      budget: 50000,
      spent: 12000,
      teamLeader: "Neelesh",
      director: "Bhujun",
      stage: "Design",
      hoursLogged: 150,
      remaininghours: 50,
    },
    {
      id: 2,
      name: "Project Beta",
      budget: 75000,
      spent: 30000,
      teamLeader: "Neelesh",
      director: "Bhujun",
      stage: "Development",
      hoursLogged: 200,
      remaininghours: 50,
    },
    {
      id: 3,
      name: "Project Gamma",
      budget: 100000,
      spent: 50000,
      teamLeader: "Neelesh",
      director: "Bhujun",
      stage: "Testing",
      hoursLogged: 250,
      remaininghours: 50,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    budget: "",
    hours: "",
    teamLeader: "",
    director: "",
    stage: "",
  });

  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (
      !newProject.name ||
      !newProject.budget ||
      !newProject.hours ||
      !newProject.teamLeader ||
      !newProject.director ||
      !newProject.stage
    )
      return;
    setProjects([
      ...projects,
      { id: projects.length + 1, ...newProject, spent: 0 },
    ]);
    setNewProject({
      name: "",
      budget: "",
      hours: "",
      teamLeader: "",
      director: "",
      stage: "",
    });
    setShowModal(false);
  };

  return (
    <div className="flex h-screen p-6 bg-gray-100 min-h-screen">
      <div className="flex-1">
        {/* Header */}
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

        {/* Table of Projects */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Project Budgets</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Project Code</th>
                <th className="border p-2">Project Name</th>
                <th className="border p-2">Total Budget</th>
                <th className="border p-2">Team Leader</th>
                <th className="border p-2">Director</th>
                <th className="border p-2">Stage</th>
                <th className="border p-2">Spent</th>
                <th className="border p-2">Remaining</th>
                <th className="border p-2">Hours Logged</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border">
                  <td className="border p-2">#{project.id}</td>
                  <td className="border p-2">{project.name}</td>
                  <td className="border p-2">{project.budget}</td>
                  <td className="border p-2">{project.teamLeader}</td>
                  <td className="border p-2">{project.director}</td>
                  <td className="border p-2">{project.stage}</td>
                  <td className="border p-2">{project.spent}</td>
                  <td className="border p-2">
                    {project.budget - project.spent}
                  </td>
                  <td className="border p-2">{project.hoursLogged} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
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
              <div>
                <label className="block font-medium">Project Code</label>
                <input
                  type="text"
                  name="name"
                  value={newProject.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProject.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Budget (mur)</label>
                <input
                  type="number"
                  name="budget"
                  value={newProject.budget}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Team Leader</label>
                <input
                  type="text"
                  name="teamLeader"
                  value={newProject.teamLeader}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Director</label>
                <input
                  type="text"
                  name="director"
                  value={newProject.director}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Stage</label>
               <select
                  name="stage"
                  value={newProject.stage}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option>Design</option>
                  <option>Development</option>
                  <option>Testing</option>
                  <option>Deployment</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Estimated Hours</label>
                <input
                  type="number"
                  name="hours"
                  value={newProject.hours}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
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
    </div>
  );
};

export default BudgetTracking;
