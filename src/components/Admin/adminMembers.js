import React, { useState, useEffect } from "react";
import { FiUserPlus, FiUserCheck, FiUserX, FiX, FiEdit } from "react-icons/fi";

const AdminMembers = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    jobTitle: "",
    department: "",
    billableRate: "",
  });

  const [members, setMembers] = useState([]);

  // Fetch members from the backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/members");
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  const handleAddMember = async () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@prodesign\.mu$/;
    if (!emailPattern.test(newMember.email)) {
      alert("Email must be a @prodesign.mu address.");
      return;
    }

    if (!newMember.name || !newMember.email || !newMember.jobTitle || !newMember.department) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...newMember,
      billableRate: Number(newMember.billableRate),
    };

    try {
      const response = await fetch("http://localhost:5000/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedMember = await response.json();
        setMembers([...members, savedMember]);
        setNewMember({
          name: "",
          email: "",
          jobTitle: "",
          department: "",
          billableRate: "",
        });
        setShowModal(false);
      } else {
        const error = await response.json();
        alert(`Failed to add member: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleEditMember = async () => {
    if (!selectedMember) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/members/${selectedMember._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedMember),
        }
      );

      if (response.ok) {
        const updatedMember = await response.json();
        setMembers(
          members.map((member) =>
            member._id === updatedMember._id ? updatedMember : member
          )
        );
        setEditModal(false);
      }
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleRemoveMember = async (id) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/members/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setMembers(members.filter((member) => member._id !== id));
        }
      } catch (error) {
        console.error("Error removing member:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-[#3b0764]">Manage Users & Teams</h1>
        <button
          className="bg-[#3b0764] text-white px-4 py-2 rounded-lg hover:bg-[#540a84] flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <FiUserPlus /> Add Member
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Job Title</th>
              <th className="text-left p-2">Department</th>
              <th className="text-left p-2">Billable Rate</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.jobTitle}</td>
                <td className="p-2">{user.department}</td>
                <td className="p-2">{user.billableRate}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="text-[#3b0764] hover:text-blue-800 flex items-center gap-1"
                    onClick={() => {
                      setSelectedMember(user);
                      setEditModal(true);
                    }}
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    onClick={() => handleRemoveMember(user._id)}
                  >
                    <FiUserX /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#3b0764]">Add New Member</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={newMember.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={newMember.email}
                onChange={handleChange}
                placeholder="Email (must be @prodesign.mu)"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="jobTitle"
                value={newMember.jobTitle}
                onChange={handleChange}
                placeholder="Job Title"
                className="w-full p-2 border rounded"
              />
              <select
                name="department"
                value={newMember.department}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Department</option>
                <option>BIM</option>
                <option>ADMIN</option>
                <option>LEED</option>
                <option>MEP</option>
              </select>
              <input
                type="number"
                name="billableRate"
                value={newMember.billableRate}
                onChange={handleChange}
                placeholder="Billable Rate"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="bg-[#3b0764] text-white px-4 py-2 rounded-lg hover:bg-[#540a84]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#3b0764]">Edit Member</h2>
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {Object.keys(selectedMember).map((key) => {
                if (key === "_id") return null;
                if (key === "department") {
                  return (
                    <select
                      key={key}
                      name="department"
                      value={selectedMember.department}
                      onChange={(e) =>
                        setSelectedMember({
                          ...selectedMember,
                          department: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option>BIM</option>
                      <option>ADMIN</option>
                      <option>LEED</option>
                      <option>MEP</option>
                    </select>
                  );
                }
                return (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={selectedMember[key]}
                    onChange={(e) =>
                      setSelectedMember({
                        ...selectedMember,
                        [key]: e.target.value,
                      })
                    }
                    placeholder={key}
                    className="w-full p-2 border rounded"
                  />
                );
              })}
            </div>

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setEditModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMember}
                className="bg-[#3b0764] text-white px-4 py-2 rounded-lg hover:bg-[#540a84]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
