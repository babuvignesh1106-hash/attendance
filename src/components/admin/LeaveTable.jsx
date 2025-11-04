import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function LeaveTable({ data, onBack }) {
  const [selectedUser, setSelectedUser] = useState("All");

  // 🔹 Get unique user names for dropdown
  const uniqueUsers = ["All", ...new Set(data.map((leave) => leave.name))];

  // 🔹 Filter leaves based on selected user
  const filteredData =
    selectedUser === "All"
      ? data
      : data.filter((leave) => leave.name === selectedUser);

  // 🔹 Export data to Excel (filtered by user)
  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((leave) => ({
        ID: leave.id,
        Name: leave.name,
        "Leave Type": leave.leaveType,
        "From Date": leave.fromDate,
        "To Date": leave.toDate,
        Reason: leave.reason,
        Status: leave.status,
        "Submitted At": new Date(leave.submittedAt).toLocaleString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");

    // File name based on selected user
    const fileName =
      selectedUser === "All"
        ? "All_LeaveRequests.xlsx"
        : `${selectedUser}_LeaveRequests.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 🔹 Page Title */}
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Leave Requests
      </h2>

      {/* 🔹 Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-all"
        >
          Back
        </button>

        {/* 🔹 User Filter Dropdown */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500"
        >
          {uniqueUsers.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>

        {/* 🔹 Export Button */}
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-all"
        >
          Export {selectedUser === "All" ? "All" : selectedUser} Data
        </button>
      </div>

      {/* 🔹 Leave Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-3 border border-gray-200">ID</th>
              <th className="p-3 border border-gray-200">Name</th>
              <th className="p-3 border border-gray-200">Leave Type</th>
              <th className="p-3 border border-gray-200">From Date</th>
              <th className="p-3 border border-gray-200">To Date</th>
              <th className="p-3 border border-gray-200">Reason</th>
              <th className="p-3 border border-gray-200">Status</th>
              <th className="p-3 border border-gray-200">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((leave) => (
                <tr key={leave.id} className="hover:bg-blue-50">
                  <td className="p-3 border border-gray-200">{leave.id}</td>
                  <td className="p-3 border border-gray-200">{leave.name}</td>
                  <td className="p-3 border border-gray-200">
                    {leave.leaveType}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {new Date(leave.fromDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {new Date(leave.toDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border border-gray-200">{leave.reason}</td>
                  <td
                    className={`p-3 border border-gray-200 font-semibold ${
                      leave.status === "Pending"
                        ? "text-yellow-600"
                        : leave.status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {leave.status}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {new Date(leave.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No leave records found for {selectedUser}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
