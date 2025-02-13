import React, { useState } from "react";
import { FiUserPlus, FiX } from "react-icons/fi";
import TasksPage from "./tasks";

const MembersPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [requestedMembers, setRequestedMembers] = useState([]);
  const [newRequest, setNewRequest] = useState({
    requestedName: "",
    projectCode: "",
    project: "BIM",
    department: "BIM",
    hours: "",
    requester: "",
    Task: "",
    Notes: "",
  });

  const handleChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRequestedMembers([...requestedMembers, newRequest]);
    setNewRequest({
      requestedName: "",
      projectCode: "",
      hours: "",
      requester: "",
      Task: "",
      Notes: "",
    });
    setShowModal(false);
  };

  return (
    <div className="flex h-screen p-6 bg-gray-100 min-h-screen">
      <div className="flex-1">
        {/* Header */}
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

        {/* List of Requested Members */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Requested Resources</h2>
          {requestedMembers.length === 0 ? (
            <p className="text-gray-500">No resources requested yet.</p>
          ) : (
            <ul className="space-y-2">
              {requestedMembers.map((member, index) => (
                <li key={index} className="border p-3 rounded shadow">
                  <p>
                    <strong>Name of the Person being requested:</strong>{" "}
                    {member.requestedName}
                  </p>
                  <p>
                    <strong>Project:</strong> {member.projectCode}
                  </p>
                  <p>
                    <strong>Project:</strong> {member.project}
                  </p>
                  <p>
                    <strong>Department:</strong> {member.department}
                  </p>
                  <p>
                    <strong>Hours Required:</strong> {member.hours}
                  </p>
                  <p>
                    <strong>Requester:</strong> {member.requester}
                  </p>
                  <p>
                    <strong>Task:</strong> {member.Task}
                  </p>
                  <p>
                    <strong>Notes:</strong> {member.Notes}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Request Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Request a New Member</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Assigned to:</label>
                <input
                  type="text"
                  name="requestedName"
                  value={newRequest.requestedName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Project Code</label>
                <select
                  name="project"
                  value={newRequest.project}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option>100</option>
                  <option>200</option>
                  <option>600</option>
                  <option>150</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Project Name</label>
                <input
                  type="text"
                  name="projectCode"
                  value={newRequest.projectCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Department</label>
                <select
                  name="department"
                  value={newRequest.department}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option>BIM</option>
                  <option>ADMIN</option>
                  <option>LEED</option>
                  <option>MEP</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Hours Required</label>
                <input
                  type="number"
                  name="hours"
                  value={newRequest.hours}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Assigned by:</label>
                <input
                  type="text"
                  name="requester"
                  value={newRequest.requester}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Task Name</label>
                <input
                  type="text"
                  name="Task"
                  value={newRequest.Task}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Additional Notes</label>
                <input
                  type="text"
                  name="Notes"
                  value={newRequest.Notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#3b0764] text-white px-4 py-2 rounded hover:bg-[#4c0a86] w-full"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
