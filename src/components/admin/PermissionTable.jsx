import React from "react";

export default function PermissionTable({ data, onBack }) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Permission Records
      </h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 border border-gray-200">ID</th>
              <th className="p-3 border border-gray-200">Employee Name</th>
              <th className="p-3 border border-gray-200">Date</th>
              <th className="p-3 border border-gray-200">Start Time</th>
              <th className="p-3 border border-gray-200">End Time</th>
              <th className="p-3 border border-gray-200">Reason</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No permission records found
                </td>
              </tr>
            ) : (
              data.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50">
                  <td className="p-3 border border-gray-200">{r.id}</td>
                  <td className="p-3 border border-gray-200">{r.name}</td>
                  <td className="p-3 border border-gray-200">{r.date}</td>
                  <td className="p-3 border border-gray-200">{r.startTime}</td>
                  <td className="p-3 border border-gray-200">{r.endTime}</td>
                  <td className="p-3 border border-gray-200">{r.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
