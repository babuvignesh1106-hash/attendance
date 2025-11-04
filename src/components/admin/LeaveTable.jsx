import React from "react";
import * as XLSX from "xlsx";

export default function LeaveTable({ data, onBack }) {
  // 🔹 Function to export leave data to Excel
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((leave) => ({
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

    // Generate and download Excel file
    XLSX.writeFile(workbook, "LeaveRequests.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 🔹 Header */}
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Leave Requests
      </h2>

      {/* 🔹 Actions (Back + Export Buttons) */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-all"
        >
          Back
        </button>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-all"
        >
          Export to Excel
        </button>
      </div>

      {/* 🔹 Table */}
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
            {data.length > 0 ? (
              data.map((leave) => (
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
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
