import React, { useEffect, useState } from "react";
import { useAttendanceStore } from "../store/attendanceStore";

export default function TodaySummary() {
  const {
    isCheckedIn,
    startTime,
    elapsedTime,
    breakCount,
    checkIn,
    checkOut,
    isOnBreak,
  } = useAttendanceStore();

  const [displayTime, setDisplayTime] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const totalSeconds = Math.floor(elapsedTime / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        "0"
      );
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      setDisplayTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [elapsedTime]);

  // Format ms → HH:MM:SS
  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  const eightHours = 8 * 60 * 60 * 1000;
  const fillPercent = Math.min((elapsedTime / eightHours) * 100, 100);
  const overtimeMs = elapsedTime > eightHours ? elapsedTime - eightHours : 0;
  const overtimeDisplay = formatTime(overtimeMs);

  // 🟢 Check-In handler
  const handleCheckIn = () => checkIn();

  // 🔴 Direct Check-Out handler (no dialog)
  const handleCheckOut = () => {
    const data = {
      startTime: startTime ? new Date(startTime).toLocaleTimeString() : "--:--",
      endTime: new Date().toLocaleTimeString(),
      elapsedTime: displayTime,
      breakCount,
    };
    console.log("Local Attendance Record:", data);
    checkOut();
  };

  return (
    <div className="w-full rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 bg-white flex flex-col gap-6">
      <h2 className="text-blue-600 font-bold text-2xl sm:text-3xl text-center">
        Today Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Timer Circle */}
        <div className="flex justify-center">
          <div className="relative w-64 sm:w-72 md:w-80 aspect-square flex items-center justify-center">
            <div
              className="w-full h-full rounded-full flex items-center justify-center shadow-xl"
              style={{
                background: `conic-gradient(
                  #22c55e ${fillPercent * 3.6}deg,
                  #f2f3f4 ${fillPercent * 3.6}deg
                )`,
                transition: "background 0.5s linear",
              }}
            >
              <div className="absolute inset-[15%] rounded-full bg-green-400 flex flex-col items-center justify-center text-center">
                <div className="text-black font-bold text-2xl sm:text-3xl md:text-4xl">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-green-800 font-semibold text-sm sm:text-base md:text-lg mt-1">
                  {isOnBreak ? "On Break" : "Working"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Check-In / Check-Out Box */}
        <div className="bg-green-200 rounded-xl p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 shadow-md border border-green-300 w-full max-w-md mx-auto">
          <div className="text-center font-bold text-lg sm:text-xl md:text-2xl text-blue-600">
            {isCheckedIn ? "Checked In" : "Not Checked In"}
          </div>

          <div className="flex justify-between text-center">
            <div className="flex flex-col items-center gap-1 w-1/2">
              <span className="text-green-700 font-bold text-xl sm:text-2xl md:text-3xl">
                {startTime ? new Date(startTime).toLocaleTimeString() : "--:--"}
              </span>
              <span className="text-gray-700 text-sm sm:text-base md:text-lg">
                Start
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 w-1/2">
              <span className="text-red-700 font-bold text-xl sm:text-2xl md:text-3xl">
                {isCheckedIn ? "Now" : "--:--"}
              </span>
              <span className="text-gray-700 text-sm sm:text-base md:text-lg">
                End
              </span>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 w-full rounded-lg font-bold text-lg transition hover:shadow-lg"
              >
                Check-In
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-2 sm:py-3 w-full rounded-lg font-bold text-lg transition hover:shadow-lg"
              >
                Check-Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { title: "Breaks", value: breakCount },
          { title: "Net Hours", value: displayTime },
          { title: "OT Hours", value: overtimeDisplay },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-green-200 text-green-800 rounded-xl p-3 sm:p-4 text-center font-bold hover:shadow-lg transition"
          >
            <h3 className="text-sm sm:text-base md:text-lg">{card.title}</h3>
            <span className="block text-xl sm:text-2xl md:text-2xl mt-1">
              {card.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
