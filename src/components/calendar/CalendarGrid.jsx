import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeePopup from "./EmployeePopup";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarGrid() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("name") || "";

  // Fetch attendance data from backend
  const fetchAttendance = () => {
    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:8000/attendance")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const filtered = res.data.filter(
            (item) => item.username === username
          );
          setAttendanceData(filtered);
        } else {
          setAttendanceData([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch attendance:", err);
        setError("Failed to fetch attendance (see console).");
      })
      .finally(() => setLoading(false));
  };

  // Auto refresh every 10 seconds
  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calendar logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun
  const today = new Date();

  const findRecordForDay = (day) => {
    return attendanceData.find((item) => {
      if (!item.startTime) return false;
      const d = new Date(item.startTime);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  };

  const statusClasses = {
    working: "bg-green-400 text-green-800 border-green-500",
    absent: "bg-red-200 text-red-800 border-red-400",
    holiday: "bg-yellow-200 text-yellow-800 border-yellow-400",
    halfday: "bg-blue-200 text-blue-800 border-blue-400",
    future: "bg-gray-200 text-gray-500 border-gray-300",
  };

  // Full grid: include blanks before first day
  const totalCells = firstDayOfMonth + daysInMonth;
  const exampleDates = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - firstDayOfMonth + 1;

    if (i < firstDayOfMonth) return { blank: true }; // empty space

    const record = findRecordForDay(dayNum);
    const tempDate = new Date(currentYear, currentMonth, dayNum);
    const weekday = tempDate.getDay();

    let status = "future";
    if (record) status = "working";
    if (weekday === 0 || weekday === 6) {
      status = record ? "working" : "holiday";
    }

    return { day: dayNum, status, record };
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="w-full rounded-xl p-4 font-sans bg-white ">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border border-indigo-100 mb-4">
        <h3 className="text-2xl font-bold text-indigo-600 tracking-wide m-0">
          Attendance Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="bg-blue-800 text-white px-3 py-1 rounded-md font-bold text-sm hover:bg-blue-900 transition"
          >
            &lt;
          </button>
          <span className="text-lg font-semibold text-indigo-700">
            {months[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="bg-blue-800 text-white px-3 py-1 rounded-md font-bold text-sm hover:bg-blue-900 transition"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-6 mb-2">
        {daysOfWeek.map((d) => (
          <div
            key={d}
            className="text-center font-semibold text-sm bg-teal-50 border border-gray-200 rounded py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Loading / Error */}
      {loading && <div className="text-center py-4">Loading attendance...</div>}
      {error && <div className="text-center py-2 text-red-600">{error}</div>}

      {/* Dates grid */}
      <div className="grid grid-cols-7 gap-6">
        {exampleDates.map((d, i) => {
          if (d.blank) return <div key={`blank-${i}`} className="h-10"></div>;

          const isToday =
            d.day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          return (
            <div
              key={d.day}
              onClick={() => d.record && setSelectedRecord(d.record)}
              className={`h-10 flex justify-center items-center rounded border text-base font-medium transition
                ${
                  isToday
                    ? "border-2 border-black bg-gradient-to-br from-blue-200 to-blue-400 font-bold text-blue-900 shadow"
                    : statusClasses[d.status]
                }
                ${
                  d.record
                    ? "cursor-pointer hover:scale-105 transform"
                    : "cursor-default"
                }
              `}
            >
              {d.day}
            </div>
          );
        })}
      </div>

      {/* Popup */}
      {selectedRecord && (
        <EmployeePopup
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}
