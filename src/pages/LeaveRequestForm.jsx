import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

export default function LeaveRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    certificate: null,
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
    const { name, value, files } = e.target;
    if (name === "certificate") {
      setFormData({ ...formData, certificate: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.leaveType ||
      !formData.fromDate ||
      !formData.toDate ||
      !formData.reason
    ) {
      alert("Please fill all mandatory fields (*) before submitting.");
      return;
    }

    if (totalDays > 3 && !formData.certificate) {
      alert("Please upload a document for leave requests exceeding 3 days.");
      return;
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);

    setFormData((prev) => ({
      ...prev,
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
      certificate: null,
    }));
    setTotalDays(0);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative flex flex-col items-center justify-start h-full w-full py-8 bg-blue-300 overflow-hidden">
      {/*  Success Dialog Box - Fixed Background Transparency */}
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-blue-300/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center w-80 border border-gray-200 animate-fade-in">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              {" "}
              Form Submitted
            </h3>
            <p className="text-gray-600">
              Your leave request has been submitted successfully!
            </p>
          </div>
        </div>
      )}

      {/*  Leave Form */}
      <div className="text-center flex flex-col items-center justify-start font-sans text-sm w-full space-y-4">
        <h2 className="text-4xl font-extrabold text-gray-700 tracking-wide">
          LEAVE REQUEST FORM
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 w-full max-w-md bg-white rounded-xl shadow-md p-6"
        >
          {/* Employee Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Employee Name <span className="text-black">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              placeholder="Employee name will appear automatically"
              className="w-full border border-[#90e0ef] rounded-md px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Type of Leave <span className="text-black">*</span>
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
              className="w-full border border-[#90e0ef] rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#0077b6] outline-none"
            >
              <option value="">Select leave type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Earned Leave">Earned Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-600 font-medium mb-1">
                From Date <span className="text-black">*</span>
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                min={today}
                required
                className="w-full border border-[#90e0ef] rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#0077b6] outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-600 font-medium mb-1">
                To Date <span className="text-black">*</span>
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                min={formData.fromDate || today}
                required
                className="w-full border border-[#90e0ef] rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#0077b6] outline-none"
              />
            </div>
          </div>

          {/* Total Days */}
          {totalDays > 0 && (
            <div className="flex items-center gap-2 text-gray-600 font-bold mt-2">
              <FaCalendarAlt className="text-black" />
              <span>Total Leave Days: {totalDays}</span>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Reason for Leave <span className="text-black">*</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Enter your reason for leave"
              className="w-full border border-[#90e0ef] rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#0077b6] outline-none"
            />
          </div>

          {/* Upload Document (only if >3 days) */}
          {totalDays > 3 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-gray-600 font-medium mb-1">
                  Upload Document
                </label>
                <FaInfoCircle
                  className="text-gray-500 text-sm cursor-pointer"
                  title="Document is required for leave requests exceeding 3 days."
                />
              </div>
              <input
                type="file"
                name="certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                required
                className="w-full border border-[#90e0ef] rounded-md px-3 py-2 bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#0077b6] file:text-white file:cursor-pointer hover:file:bg-[#023e8a]"
              />
              {formData.certificate && (
                <p className="text-sm text-gray-600">
                  Selected File: {formData.certificate.name}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-semibold py-2 rounded-md hover:bg-[#023e8a] transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
