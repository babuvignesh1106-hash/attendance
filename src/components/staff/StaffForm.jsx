import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { ROUTES } from "../../constants/routes"; // import your ROUTES

export default function StaffForm({ setActivePage }) {
  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    designation: "",
    salary: "",
    pancard: "",
    dateOfJoining: "",
    location: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://attendance-backend-bqhw.vercel.app/staff",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Failed to save staff.");

      alert("Staff added successfully!");
      if (setActivePage) setActivePage(ROUTES.STAFF_LIST);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
          Add Staff
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Employee ID", name: "employeeId", type: "text" },
            { label: "Employee Name", name: "employeeName", type: "text" },
            { label: "Designation", name: "designation", type: "text" },
            { label: "Salary", name: "salary", type: "number" },
            { label: "PAN Card", name: "pancard", type: "text" },
            { label: "Date of Joining", name: "dateOfJoining", type: "date" },
            { label: "Location", name: "location", type: "text" },
          ].map((field) => (
            <div
              key={field.name}
              className={field.name === "location" ? "md:col-span-2" : ""}
            >
              <label className="block mb-2 text-gray-600">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col md:flex-row justify-between gap-3">
          <button
            type="button"
            onClick={() => setActivePage(ROUTES.STAFF_LIST)}
            className="flex items-center gap-2 text-blue-600 font-medium"
          >
            <IoArrowBack size={20} />
            Back
          </button>

          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition"
          >
            Save Staff
          </button>
        </div>
      </form>
    </div>
  );
}
