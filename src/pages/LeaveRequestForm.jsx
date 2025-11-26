import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeaveRequestForm({ onback }) {
  const [formData, setFormData] = useState({
    name: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [totalDays, setTotalDays] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [balanceData, setBalanceData] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setFormData((prev) => ({ ...prev, name: storedName }));
    }
  }, []);

  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diff =
        Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diff > 0 ? diff : 0);
    } else {
      setTotalDays(0);
    }
  }, [formData.fromDate, formData.toDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(""); // clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.leaveType ||
      !formData.fromDate ||
      !formData.toDate ||
      !formData.reason
    ) {
      setErrorMessage("Please fill all required fields before submitting.");
      return;
    }

    try {
      await axios.post(
        "https://attendance-backend-bqhw.vercel.app/leaves",
        formData
      );

      setShowSuccess(true);
      setErrorMessage("");

      setTimeout(() => setShowSuccess(false), 4000);

      setFormData({
        name: localStorage.getItem("name") || "",
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });
      setTotalDays(0);

      handleBalanceClick();
    } catch (error) {
      console.error("Error submitting leave:", error);
      setErrorMessage("Error submitting leave request. Please try again.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const handleBalanceClick = async () => {
    try {
      const name = localStorage.getItem("name");
      if (!name) throw new Error("User name not found in localStorage");

      const response = await axios.get(
        `https://attendance-backend-bqhw.vercel.app/leaves/balance/${name}`
      );
      setBalanceData(response.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalanceData({ error: "Failed to load balance" });
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4 py-6 relative">
      <div className="w-full max-w-md">
        <button
          onClick={""}
          className="mb-4 bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          ← Back
        </button>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
            Leave Request Form
          </h2>

          {showSuccess && (
            <div className="mb-4 text-center text-green-600 font-semibold">
              ✅ Leave request submitted successfully!
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 text-center text-red-600 font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-gray-600">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-600">
              Type of Leave <span className="text-red-500">*</span>
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select leave type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-gray-600">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                min={today}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-gray-600">
                To Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                min={formData.fromDate || today}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {totalDays > 0 && (
            <div className="mt-2 text-gray-700 font-medium">
              Total Leave Days:{" "}
              <span className="text-blue-700 font-semibold">{totalDays}</span>
            </div>
          )}

          <div className="mt-4">
            <label className="block mb-2 text-gray-600">
              Reason for Leave <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Enter reason for leave"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition mt-6"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
}
