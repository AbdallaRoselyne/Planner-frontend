import React, { useState } from "react";

function UserRequestForm() {
  const [requests, setRequests] = useState([]);

  // Add a new empty request
  const handleAddRequest = () => {
    setRequests([
      ...requests,
      {
        projectCode: "",
        hoursAvailable: "",
        requestedPerson: "",
        workDescription: "",
        hoursRequired: "",
      },
    ]);
  };

  // Update a specific field in a specific request
  const handleChange = (index, field, value) => {
    const updatedRequests = [...requests];
    updatedRequests[index][field] = value;
    setRequests(updatedRequests);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#3b0764]">User Requests</h1>
        <button
          onClick={handleAddRequest}
          className="bg-[#bef264] text-[#3b0764] px-4 py-2 rounded-lg hover:bg-[#d8fc9a]"
        >
          + Add Request
        </button>
      </div>

      {/* Request Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Project Code</th>
            <th className="border px-4 py-2">Hours Available</th>
            <th className="border px-4 py-2">Requested Person</th>
            <th className="border px-4 py-2">Work Description</th>
            <th className="border px-4 py-2">Hours Required</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={request.projectCode}
                  onChange={(e) =>
                    handleChange(index, "projectCode", e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:ring-[#bef264]"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={request.hoursAvailable}
                  onChange={(e) =>
                    handleChange(index, "hoursAvailable", e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:ring-[#bef264]"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={request.requestedPerson}
                  onChange={(e) =>
                    handleChange(index, "requestedPerson", e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:ring-[#bef264]"
                />
              </td>
              <td className="border px-4 py-2">
                <textarea
                  value={request.workDescription}
                  onChange={(e) =>
                    handleChange(index, "workDescription", e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:ring-[#bef264]"
                  rows="2"
                ></textarea>
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={request.hoursRequired}
                  onChange={(e) =>
                    handleChange(index, "hoursRequired", e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:ring-[#bef264]"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserRequestForm;
