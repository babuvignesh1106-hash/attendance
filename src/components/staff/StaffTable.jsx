import React from "react";

export default function StaffTable({ data, onEdit, onDelete }) {
  const staffList = Array.isArray(data) ? data : [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-xl">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 border border-gray-200">Employee ID</th>
            <th className="p-3 border border-gray-200">Name</th>
            <th className="p-3 border border-gray-200">Designation</th>
            <th className="p-3 border border-gray-200">Salary</th>
            <th className="p-3 border border-gray-200">PAN Card</th>
            <th className="p-3 border border-gray-200">Date of Joining</th>
            <th className="p-3 border border-gray-200">Location</th>
            <th className="p-3 border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id} className="hover:bg-blue-50">
              <td className="p-3 border border-gray-200">{staff.employeeId}</td>
              <td className="p-3 border border-gray-200">
                {staff.employeeName}
              </td>
              <td className="p-3 border border-gray-200">
                {staff.designation}
              </td>
              <td className="p-3 border border-gray-200">{staff.salary}</td>
              <td className="p-3 border border-gray-200">{staff.pancard}</td>
              <td className="p-3 border border-gray-200">
                {staff.dateOfJoining}
              </td>
              <td className="p-3 border border-gray-200">{staff.location}</td>
              <td className="p-3 border border-gray-200 flex gap-2 justify-center">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => onEdit(staff)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => onDelete(staff.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
