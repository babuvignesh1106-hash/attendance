import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://attendance-backend-1-eohz.onrender.com";

// Success Dialog
function SuccessDialog({ message, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[320px] text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Success</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <button
          onClick={onConfirm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function PayslipForm({ editData, setActivePage }) {
  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);

  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "long" });
  const currentYear = now.getFullYear();

  const [form, setForm] = useState({
    selectedEmployeeId: "",
    employeeType: "",
    employeeId: "",
    employeeName: "",
    designation: "",
    salary: "",
    bonus: "",
    panCard: "",
    dateOfJoining: "",
    month: currentMonth,
    year: currentYear,
    payableDays: "",
    paidDays: "",
  });

  // FETCH EMPLOYEES
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const [staffRes, usersRes] = await Promise.all([
          axios.get(`${BASE_URL}/staff`),
          axios.get(`${BASE_URL}/users`),
        ]);

        const staffData = staffRes.data.map((s) => ({
          id: `staff-${s.id}`,
          type: "staff",
          employeeId: s.employeeId,
          employeeName: `${s.employeeName} (Staff)`,
          designation: s.designation,
          salary: s.salary,
          panCard: s.pancard || "",
          dateOfJoining: s.dateOfJoining,
        }));

        const usersData = usersRes.data.map((u) => ({
          id: `user-${u.id}`,
          type: "user",
          employeeId: u.employeeId,
          employeeName: `${u.name} (User)`,
          designation: u.designation,
          salary: "",
          panCard: "",
          dateOfJoining: u.dateOfJoining,
        }));

        setAllEmployees([...staffData, ...usersData]);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchAllEmployees();
  }, []);

  // EDIT PREFILL
  useEffect(() => {
    if (editData) {
      setForm({
        selectedEmployeeId: "",
        employeeType: "",
        employeeId: editData.employeeId || "",
        employeeName: editData.employeeName || "",
        designation: editData.designation || "",
        salary: editData.salary || "",
        bonus: editData.bonus || "",
        panCard: editData.panCard || "",
        dateOfJoining: editData.dateOfJoining || "",
        month: editData.month || currentMonth,
        year: editData.year || currentYear,
        payableDays: "",
        paidDays: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const selected = allEmployees.find((emp) => emp.id === selectedId);

    if (selected) {
      setForm((prev) => ({
        ...prev,
        selectedEmployeeId: selectedId,
        employeeType: selected.type,
        employeeId: selected.employeeId,
        employeeName: selected.employeeName,
        designation: selected.designation,
        salary: selected.salary,
        panCard: selected.panCard,
        dateOfJoining: selected.dateOfJoining,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        bonus: form.bonus ? Number(form.bonus) : undefined,
        year: Number(form.year),
        payableDays: Number(form.payableDays),
        paidDays: Number(form.paidDays),
      };

      if (editData) {
        await axios.put(`${BASE_URL}/payslip/${editData.id}`, payload);
        setDialogMessage("Payslip updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/payslip`, payload);
        setDialogMessage("Payslip added successfully!");
      }

      setShowDialog(true);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setDialogMessage(
        "Failed: " + (err.response?.data?.message || err.message),
      );
      setShowDialog(true);
    }
  };

  const handleDialogConfirm = () => {
    setShowDialog(false);
    navigate(ROUTES.PAYROLL_DASHBOARD);
  };

  return (
    <>
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
            onClick={() =>
              setActivePage ? setActivePage(ROUTES.PAYROLL) : null
            }
            className="bg-gray-500 text-white px-5 py-3 rounded-xl mb-4"
          >
            Back
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
            {editData ? "Edit Payslip" : "Add Payslip"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block mb-2 text-gray-600">
                Employee Name <span className="text-red-500">*</span>
              </label>

              <select
                value={form.selectedEmployeeId}
                onChange={handleEmployeeChange}
                className="w-full p-3 border border-gray-300 rounded-xl"
                required
              >
                <option value="">Select Employee</option>
                {allEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeName}
                  </option>
                ))}
              </select>
            </div>

            {[
              { name: "employeeId", label: "Employee ID" },
              { name: "designation", label: "Designation" },
              { name: "salary", label: "Salary", type: "number" },
              { name: "panCard", label: "PAN Card" },
              { name: "dateOfJoining", label: "Date of Joining", type: "date" },
              { name: "bonus", label: "Bonus", type: "number", optional: true },
              { name: "month", label: "Month" },
              { name: "year", label: "Year", type: "number" },
              { name: "payableDays", label: "Payable Days", type: "number" },
              { name: "paidDays", label: "Paid Days", type: "number" },
            ].map((field) => {
              const isReadOnly =
                ["employeeId", "designation", "dateOfJoining"].includes(
                  field.name,
                ) ||
                (["salary", "panCard"].includes(field.name) &&
                  form.employeeType === "staff");

              return (
                <div key={field.name}>
                  <label className="block mb-2 text-gray-600">
                    {field.label}
                  </label>

                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    className={`w-full p-3 border border-gray-300 rounded-xl ${
                      isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 mt-6"
          >
            {editData ? "Update Payslip" : "Submit Payslip"}
          </button>
        </form>
      </div>
    </>
  );
}
