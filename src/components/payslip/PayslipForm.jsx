import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

// Reusable Success Dialog (same design as LogoutDialog)
function SuccessDialog({ message, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[320px] text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Success</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <button
          onClick={onConfirm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function PayslipForm({ onSuccess, editData, setActivePage }) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [staffList, setStaffList] = useState([]);

  // Get current month/year
  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "long" });
  const currentYear = now.getFullYear();

  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    designation: "",
    salary: "",
    bonus: "",
    panCard: "",
    dateOfJoining: "",
    month: currentMonth,
    year: currentYear,
  });

  // Load staff
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

  // Prefill edit data
  useEffect(() => {
    if (editData) {
      setForm({
        employeeId: editData.employeeId || "",
        employeeName: editData.employeeName || "",
        designation: editData.designation || "",
        salary: editData.salary || "",
        bonus: editData.bonus || "",
        panCard: editData.panCard || "",
        dateOfJoining: editData.dateOfJoining || "",
        month: editData.month || currentMonth,
        year: editData.year || currentYear,
      });
    }
  }, [editData]);

  // Handle normal input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // When selecting employee
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

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        bonus: form.bonus ? Number(form.bonus) : undefined,
        year: Number(form.year),
      };

      if (editData) {
        await axios.put(
          `https://attendance-backend-bqhw.vercel.app/payslip/${editData.id}`,
          payload
        );
        setDialogMessage("Payslip updated successfully!");
      } else {
        await axios.post(
          "https://attendance-backend-bqhw.vercel.app/payslip",
          payload
        );
        setDialogMessage("Payslip added successfully!");
      }

      setShowDialog(true);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setDialogMessage(
        "Failed: " + (err.response?.data?.message || err.message)
      );
      setShowDialog(true);
    }
  };

  // When user clicks OK on success dialog → redirect
  const handleDialogConfirm = () => {
    setShowDialog(false);
    navigate(ROUTES.PAYROLL_DASHBOARD);
  };

  return (
    <>
      {/* Success Dialog */}
      {showDialog && (
        <SuccessDialog
          message={dialogMessage}
          onConfirm={handleDialogConfirm}
        />
      )}

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-xl"
        >
          <button
            type="button"
            onClick={() => setActivePage(ROUTES.PAYROLL)}
            className="flex-1 bg-gray-500 text-white px-5 py-3 rounded-xl hover:bg-gray-600 transition"
          >
            Back
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
            {editData ? "Edit Payslip" : "Add Payslip"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Employee Dropdown */}
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
                className="w-full p-3 border border-gray-300 rounded-xl"
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

            {/* Other Fields */}
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
                  className={`w-full p-3 border border-gray-300 rounded-xl ${
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
    </>
  );
}
