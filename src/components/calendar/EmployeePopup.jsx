import React from "react";

export default function EmployeePopup({ record, onClose }) {
  if (!record) return null;

  const {
    id = "N/A",
    username = "N/A",
    startTime,
    endTime,
    workedDuration,
    breakCount = 0,
    totalBreakDuration,
  } = record;

  const formatISO = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso || "N/A";
    }
  };

  const secToHHMMSS = (s) => {
    if (s == null || isNaN(s)) return "0s";
    const sec = Number(s);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const ss = sec % 60;
    return `${h > 0 ? h + "h " : ""}${m > 0 ? m + "m " : ""}${ss}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/55 flex justify-center items-center z-50 font-sans">
      <div className="bg-white rounded-xl shadow-lg w-[900px] max-h-[90vh] overflow-y-auto animate-[fadeIn_0.25s_ease] pb-5">
        {/* Header */}
        <div className="flex justify-between items-center p-4 px-6 bg-cyan-200 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-[20px] font-semibold text-gray-800">
            Attendance Record Details
          </h2>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md font-medium text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-[300px_1fr] gap-5 p-5">
          {/* Left Summary Card */}
          <div className="bg-cyan-100 border border-green-200 rounded-lg p-4 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="avatar"
              className="w-20 h-20 rounded-full mx-auto mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-900">{username}</h3>
            <p className="text-sm text-gray-700 mb-3">Employee ID: {id}</p>

            {/* Summary Stats */}
            <div className="bg-white border border-gray-200 rounded-lg mt-4 p-3 text-left">
              <h4 className="text-blue-900 font-semibold mb-2 text-lg">
                Work Summary
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-green-500 text-white text-sm font-medium rounded px-2 py-1 text-center">
                  Worked: {secToHHMMSS(workedDuration)}
                </div>
                <div className="bg-yellow-500 text-white text-sm font-medium rounded px-2 py-1 text-center">
                  Breaks: {breakCount}
                </div>
                <div className="bg-blue-500 text-white text-sm font-medium rounded px-2 py-1 text-center">
                  Break Time: {secToHHMMSS(totalBreakDuration)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Detailed Info */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-gradient-to-br from-green-100 to-green-200 border border-green-300 rounded-lg p-3 shadow-md">
                <span className="block text-gray-700 text-base">
                  Start Time
                </span>
                <strong className="block text-gray-900 font-medium">
                  {startTime ? formatISO(startTime) : "N/A"}
                </strong>
              </div>

              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-300 rounded-lg p-3 shadow-md">
                <span className="block text-gray-700 text-base">End Time</span>
                <strong className="block text-gray-900 font-medium">
                  {endTime ? formatISO(endTime) : "Ongoing"}
                </strong>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300 rounded-lg p-3 shadow-md">
                <span className="block text-gray-700 text-base">
                  Total Worked Duration
                </span>
                <strong className="block text-gray-900 font-medium">
                  {secToHHMMSS(workedDuration)}
                </strong>
              </div>

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-lg p-3 shadow-md">
                <span className="block text-gray-700 text-base">
                  Total Break Time
                </span>
                <strong className="block text-gray-900 font-medium">
                  {secToHHMMSS(totalBreakDuration)}
                </strong>
              </div>
            </div>

            {/* Debug Info */}
            <details className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
              <summary className="cursor-pointer text-gray-700 font-medium">
                Raw Record (Debug)
              </summary>
              <pre className="text-xs mt-2 overflow-x-auto text-gray-600">
                {JSON.stringify(record, null, 2)}
              </pre>
            </details>

            {/* Back Button */}
            <div className="flex justify-center mt-5">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-400 border border-green-500 rounded-md text-white font-medium hover:bg-green-600 transition"
              >
                Back to Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-4 px-6 bg-gray-100 border-t border-gray-200 rounded-b-xl">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium">
            Export Record
          </button>
          <div></div>
        </div>
      </div>
    </div>
  );
}
