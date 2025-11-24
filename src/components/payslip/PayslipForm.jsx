import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PayslipForm({ onSuccess }) {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    designation: "",
    salary: "",
    bonus: "",
    panCard: "",
    dateOfJoining: "",
    month: "",
    year: "",
  });

  // Fetch staff data on mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get("http://localhost:8000/staff");
        setStaffList(res.data);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchStaff();
  }, []);

  // Handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    const empId = Number(e.target.value);
    const selected = staffList.find((s) => s.id === empId);
    if (selected) {
      setForm((prev) => ({
        ...prev,
        employeeId: selected.employeeId,
        employeeName: selected.employeeName,
        designation: selected.designation,
        salary: selected.salary,
        panCard: selected.pancard,
        dateOfJoining: selected.dateOfJoining,
      }));
    } else {
      // Reset if "Select" is chosen
      setForm((prev) => ({
        ...prev,
        employeeId: "",
        employeeName: "",
        designation: "",
        salary: "",
        panCard: "",
        dateOfJoining: "",
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        bonus: form.bonus ? Number(form.bonus) : undefined,
        year: Number(form.year),
      };
      await axios.post("http://localhost:8000/payslip", payload);
      alert("Payslip added successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(
        "Failed to add payslip: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Add Payslip
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Employee Name Dropdown */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-600">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <select
              value={
                staffList.find((s) => s.employeeName === form.employeeName)
                  ?.id || ""
              }
              onChange={handleEmployeeChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Employee</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.employeeName}
                </option>
              ))}
            </select>
          </div>

          {/* Other fields */}
          {[
            { name: "employeeId", label: "Employee ID" },
            { name: "designation", label: "Designation" },
            { name: "salary", label: "Salary", type: "number" },
            { name: "panCard", label: "PAN Card" },
            { name: "dateOfJoining", label: "Date of Joining", type: "date" },
            { name: "bonus", label: "Bonus", type: "number", optional: true },
            { name: "month", label: "Month" },
            { name: "year", label: "Year", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block mb-2 text-gray-600">
                {field.label}{" "}
                {field.optional ? "" : <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required={!field.optional}
                className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                  field.name === "employeeId" ||
                  field.name === "designation" ||
                  field.name === "salary" ||
                  field.name === "panCard" ||
                  field.name === "dateOfJoining"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                readOnly={
                  field.name === "employeeId" ||
                  field.name === "designation" ||
                  field.name === "salary" ||
                  field.name === "panCard" ||
                  field.name === "dateOfJoining"
                }
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition mt-6"
        >
          Submit Payslip
        </button>
      </form>
    </div>
  );
}
