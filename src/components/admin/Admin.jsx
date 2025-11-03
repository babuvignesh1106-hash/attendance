import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminForm from "./AdminForm";
import * as XLSX from "xlsx";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");

  useEffect(() => {
    if (isLoggedIn) fetchAttendance();
  }, [isLoggedIn]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        "https://attendance-backend-bqhw.vercel.app/attendance"
      );
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Error fetching attendance", err);
    }
  };

  const uniqueUsers = [
    "All",
    ...new Set(
      attendanceData.map((d) => d.username).filter((u) => u && u.trim() !== "")
    ),
  ];

  const filteredData =
    selectedUser === "All"
      ? attendanceData
      : attendanceData.filter((d) => d.username === selectedUser);

  const exportToExcel = () => {
    if (filteredData.length === 0) return alert("No data to export!");

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const fileName =
      selectedUser === "All"
        ? "All_Attendance.xlsx"
        : `${selectedUser}_Attendance.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (!isLoggedIn) return <AdminForm onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Attendance Records
      </h2>

      {/* Filter and Export */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm"
        >
          {uniqueUsers.map((user) => (
            <option key={user} value={user}>
              {user === "All" ? "All Users" : user}
            </option>
          ))}
        </select>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
        >
          Export to Excel
        </button>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 border border-gray-200">ID</th>
              <th className="p-3 border border-gray-200">Start</th>
              <th className="p-3 border border-gray-200">End</th>
              <th className="p-3 border border-gray-200">Worked</th>
              <th className="p-3 border border-gray-200">Breaks</th>
              <th className="p-3 border border-gray-200">Total Break</th>
              <th className="p-3 border border-gray-200">Username</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((r) => (
              <tr key={r.id} className="hover:bg-blue-50">
                <td className="p-3 border border-gray-200">{r.id}</td>
                <td className="p-3 border border-gray-200">
                  {new Date(r.startTime).toLocaleString()}
                </td>
                <td className="p-3 border border-gray-200">
                  {new Date(r.endTime).toLocaleString()}
                </td>
                <td className="p-3 border border-gray-200">
                  {r.workedDuration} mins
                </td>
                <td className="p-3 border border-gray-200">{r.breakCount}</td>
                <td className="p-3 border border-gray-200">
                  {r.totalBreakDuration}
                </td>
                <td className="p-3 border border-gray-200">{r.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsLoggedIn(false)}
          className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
