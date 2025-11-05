import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Approved() {
  const username = localStorage.getItem("name");
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(
          "https://attendance-backend-bqhw.vercel.app/leaves"
        );
        const userLeaves = res.data.filter((leave) => leave.name === username);
        setLeaves(userLeaves);
      } catch (err) {
        console.error("Failed to fetch leaves", err);
      }
    };

    if (username) fetchLeaves();
  }, [username]);

  const handleStatusChange = async (index, newStatus) => {
    const leave = leaves[index];
    try {
      await axios.put(
        `https://attendance-backend-bqhw.vercel.app/leaves/${leave.id}`,
        {
          status: newStatus,
        }
      );
      const updatedLeaves = [...leaves];
      updatedLeaves[index].status = newStatus;
      setLeaves(updatedLeaves);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status. Try again.");
    }
  };

  const filteredLeaves =
    statusFilter === "All"
      ? leaves
      : leaves.filter((leave) => leave.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Leave Requests - {username}
      </h2>

      {/* Status Filter */}
      <div className="mb-4 flex justify-end">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="p-3 border border-gray-200">#</th>
              <th className="p-3 border border-gray-200">Leave Type</th>
              <th className="p-3 border border-gray-200">From Date</th>
              <th className="p-3 border border-gray-200">To Date</th>
              <th className="p-3 border border-gray-200">Reason</th>
              <th className="p-3 border border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave, index) => (
                <tr key={leave.id} className="hover:bg-purple-50">
                  <td className="p-3 border border-gray-200">{index + 1}</td>
                  <td className="p-3 border border-gray-200">
                    {leave.leaveType}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {leave.fromDate}
                  </td>
                  <td className="p-3 border border-gray-200">{leave.toDate}</td>
                  <td className="p-3 border border-gray-200">{leave.reason}</td>
                  <td className="p-3 border border-gray-200">
                    <select
                      value={leave.status}
                      onChange={(e) =>
                        handleStatusChange(
                          leaves.findIndex((l) => l.id === leave.id),
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No leaves found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
