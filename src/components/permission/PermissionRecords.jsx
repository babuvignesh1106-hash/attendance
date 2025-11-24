import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PermissionRecords({ onBack }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = localStorage.getItem("name"); // ✅ Employee name from localStorage

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(
          "https://attendance-backend-bqhw.vercel.app/permission"
        );

        // ✅ Filter only the logged-in user's records
        const filtered = res.data.filter(
          (record) => record.name?.toLowerCase() === username?.toLowerCase()
        );
        setRecords(filtered);
      } catch (err) {
        console.error("Error fetching permission data:", err);
        setError("Failed to load permission records. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [username]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-blue-600">
        Loading permission records...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={onBack}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Permission Records
      </h2>

      <div className="flex justify-center mb-6"></div>

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
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No permission records found for {username || "this user"}.
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50 transition">
                  <td className="p-3 border border-gray-200 text-center">
                    {r.id}
                  </td>
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
