import React, { useState, useEffect } from "react";
import { useAttendanceStore } from "../store/attendanceStore";
import BreakApp from "../pages/BreakApp";

export default function BreakTime() {
  const { isCheckedIn, isOnBreak, toggleBreak, elapsedTime, breakCount } =
    useAttendanceStore();
  const [breakTime, setBreakTime] = useState(() =>
    parseInt(localStorage.getItem("breakTime") || "0")
  );
  const [breakStartTime, setBreakStartTime] = useState(() =>
    parseInt(localStorage.getItem("breakStartTime") || "0")
  );
  const [showBreakApp, setShowBreakApp] = useState(false);

  const MAX_BREAK_TIME = 60 * 60 * 1000; // 1 hour in ms

  // 🕐 Load state on mount
  useEffect(() => {
    const savedBreakTime = parseInt(localStorage.getItem("breakTime") || "0");
    const savedBreakStart = parseInt(
      localStorage.getItem("breakStartTime") || "0"
    );

    setBreakTime(savedBreakTime);
    setBreakStartTime(savedBreakStart);
  }, []);

  // 🕒 Track break timer
  useEffect(() => {
    let interval = null;

    if (isOnBreak) {
      if (!breakStartTime) {
        const start = Date.now();
        setBreakStartTime(start);
        localStorage.setItem("breakStartTime", start.toString());
      }

      interval = setInterval(() => {
        const currentTime = Date.now();
        const duration = currentTime - breakStartTime;
        const newTime = Math.min(duration, MAX_BREAK_TIME);

        setBreakTime(newTime);
        localStorage.setItem("breakTime", newTime.toString());

        // ⏰ Auto end break after 1 hour
        if (newTime >= MAX_BREAK_TIME) {
          clearInterval(interval);
          alert("⚠️ Break limit reached (1 hour). Auto-resuming work.");
          handleResumeWork();
        }
      }, 1000);
    } else {
      clearInterval(interval);
      localStorage.removeItem("breakStartTime");
    }

    return () => clearInterval(interval);
  }, [isOnBreak, breakStartTime]);

  // 🟢 Handle resume work
  const handleResumeWork = () => {
    toggleBreak();
    setBreakTime(0);
    setBreakStartTime(0);
    localStorage.removeItem("breakTime");
    localStorage.removeItem("breakStartTime");
  };

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Outer Container */}
      <div className="rounded-2xl p-2 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-600">
            Break Time & Counts
          </h2>
          <button
            onClick={() => setShowBreakApp(true)}
            className="bg-orange-600 text-white px-3 py-1 rounded-md font-semibold text-sm hover:bg-orange-700 transition"
          >
            INFO
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-4">
          {/* Break Info Card */}
          <div className="p-6 rounded-xl bg-green-300 shadow flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-700 text-xl font-bold">
                Break Count
              </span>
              <span className="text-blue-600 text-2xl font-bold">
                {breakCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 text-xl font-bold">
                Current Break
              </span>
              <span className="text-blue-600 text-2xl font-bold">
                {formatTime(breakTime)}
              </span>
            </div>
          </div>

          {/* Work Info Card */}
          <div className="p-6 rounded-xl bg-green-300 shadow flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-700 text-xl font-bold">
                Total
                <br /> Work Time
              </span>
              <span className="text-blue-600 text-2xl font-bold">
                {formatTime(elapsedTime)}
              </span>
            </div>
            <p
              className={`text-center text-xl font-bold mt-2 ${
                isOnBreak ? "text-red-500" : "text-green-600"
              }`}
            >
              {isOnBreak ? "On Break" : "Working"}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (isOnBreak) {
              handleResumeWork();
            } else {
              toggleBreak();
              const start = Date.now();
              setBreakStartTime(start);
              localStorage.setItem("breakStartTime", start.toString());
            }
          }}
          disabled={!isCheckedIn}
          className={`w-full py-3 rounded-xl font-bold text-lg text-white transition ${
            isOnBreak
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-orange-600 hover:bg-orange-700"
          } disabled:opacity-50`}
        >
          {isOnBreak ? "Resume Work" : "Take Break"}
        </button>
      </div>

      {/* BreakApp Modal */}
      {showBreakApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setShowBreakApp(false)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold"
            >
              ✕
            </button>
            <BreakApp
              checkedIn={isCheckedIn}
              onBreakStart={() => console.log("Break Started")}
              onBreakEnd={() => console.log("Break Ended")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
