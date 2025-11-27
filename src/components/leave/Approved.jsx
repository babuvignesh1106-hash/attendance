import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";

export default function Approved({ setActivePage }) {
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

  const filteredLeaves =
    statusFilter === "All"
      ? leaves
      : leaves.filter((leave) => leave.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-md mb-6">
        <button
          type="button"
          onClick={() => setActivePage(ROUTES.LEAVEDASHBOARD)}
          className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>
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
                  <td
                    className={`p-3 border border-gray-200 font-semibold ${
                      leave.status === "Approved"
                        ? "text-green-600"
                        : leave.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {leave.status}
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
