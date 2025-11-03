import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeaveRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [totalDays, setTotalDays] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

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
      const diff = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diff > 0 ? diff : 0);
    } else {
      setTotalDays(0);
    }
  }, [formData.fromDate, formData.toDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      alert("Please fill all required fields before submitting.");
      return;
    }

    try {
      await axios.post(
        "https://attendance-backend-bqhw.vercel.app/leaves",
        formData
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);

      setFormData({
        name: localStorage.getItem("name") || "",
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });
      setTotalDays(0);
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("Error submitting leave request. Please try again.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r rounded-2xl from-blue-100 to-blue-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
          Leave Request Form
        </h2>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 text-center text-green-600 font-semibold">
            ✅ Leave request submitted successfully!
          </div>
        )}

        {/* Name */}
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
            placeholder="Employee name will appear automatically"
          />
        </div>

        {/* Leave Type */}
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
            <option value="Emergency Leave">Emergency Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Earned Leave">Earned Leave</option>
          </select>
        </div>

        {/* Dates */}
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

        {/* Total Days */}
        {totalDays > 0 && (
          <div className="mt-2 text-gray-700 font-medium">
            Total Leave Days:{" "}
            <span className="text-blue-700 font-semibold">{totalDays}</span>
          </div>
        )}

        {/* Reason */}
        <div className="mt-4">
          <label className="block mb-2 text-gray-600">
            Reason for Leave <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            required
            placeholder="Enter reason for leave"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition mt-6"
        >
          Submit Leave Request
        </button>
      </form>
    </div>
  );
}
