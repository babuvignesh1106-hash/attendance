import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PayslipForm({ editData, onSuccess }) {
  const [staffList, setStaffList] = useState([]);

  const defaultForm = {
    employeeId: "",
    employeeName: "",
    designation: "",
    salary: "",
    bonus: "",
    panCard: "",
    dateOfJoining: "",
    month: "",
    year: "",
  };

  const [form, setForm] = useState(defaultForm);

  // ----------------------------
  // LOAD STAFF LIST
  // ----------------------------
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(
          "https://attendance-backend-bqhw.vercel.app/staff"
        );
        setStaffList(res.data);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchStaff();
  }, []);

  // ----------------------------
  // AUTO FILL WHEN EDITING
  // ----------------------------
  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm(defaultForm); // reset for Add mode
    }
  }, [editData]);

  // ----------------------------
  // HANDLE INPUT CHANGES
  // ----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------------------
  // WHEN EMPLOYEE SELECTED
  // ----------------------------
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
    }
  };

  // ----------------------------
  // SUBMIT FORM (ADD / UPDATE)
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        bonus: form.bonus ? Number(form.bonus) : 0,
        year: Number(form.year),
      };

      if (editData) {
        // UPDATE MODE
        await axios.put(
          `https://attendance-backend-bqhw.vercel.app/payslip/${editData.id}`,
          payload
        );
        alert("Payslip updated successfully!");
      } else {
        // ADD MODE
        await axios.post(
          "https://attendance-backend-bqhw.vercel.app/payslip",
          payload
        );
        alert("Payslip added successfully!");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          {editData ? "Edit Payslip" : "Add Payslip"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Dropdown */}
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
              required={!editData}
              disabled={!!editData}
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
                {!field.optional && <span className="text-red-500">*</span>}
              </label>

              <input
                type={field.type || "text"}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required={!field.optional}
                className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                  [
                    "employeeId",
                    "designation",
                    "salary",
                    "panCard",
                    "dateOfJoining",
                  ].includes(field.name)
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                readOnly={[
                  "employeeId",
                  "designation",
                  "salary",
                  "panCard",
                  "dateOfJoining",
                ].includes(field.name)}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition mt-6"
        >
          {editData ? "Update Payslip" : "Submit Payslip"}
        </button>
      </form>
    </div>
  );
}
