import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import AttendanceTable from "./AttendanceTable";
import LeaveTable from "./LeaveTable";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState(""); // "", "attendance", "leaves"
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");

  useEffect(() => {
    if (activeTab === "attendance") fetchAttendance();
    if (activeTab === "leaves") fetchLeaves();
  }, [activeTab]);

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

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        "https://attendance-backend-bqhw.vercel.app/leaves"
      );
      setLeaveData(res.data);
    } catch (err) {
      console.error("Error fetching leaves", err);
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

  if (activeTab === "")
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-8">
          Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
          <div
            onClick={() => setActiveTab("attendance")}
            className="bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer hover:shadow-2xl transition"
          >
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Attendance Records
            </h3>
            <p className="text-gray-600">
              View and export employee attendance data.
            </p>
          </div>

          <div
            onClick={() => setActiveTab("leaves")}
            className="bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer hover:shadow-2xl transition"
          >
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Leave Requests
            </h3>
            <p className="text-gray-600">Review all employee leave requests.</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="mt-10 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    );

  if (activeTab === "attendance")
    return (
      <AttendanceTable
        data={filteredData}
        users={uniqueUsers}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onExport={exportToExcel}
        onBack={() => setActiveTab("")}
      />
    );

  if (activeTab === "leaves")
    return <LeaveTable data={leaveData} onBack={() => setActiveTab("")} />;
}
