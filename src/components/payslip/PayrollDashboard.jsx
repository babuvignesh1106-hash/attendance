import React, { useEffect, useState } from "react";
import axios from "axios";
import GeneratePayslip from "./GeneratePayslip";
import PayslipForm from "./PayslipForm";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PayrollDashboard = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(months[today.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const fetchPayslips = async () => {
    try {
      const res = await axios.get(
        "https://attendance-backend-bqhw.vercel.app/payslip"
      );
      setPayslips(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  // Filter payslips by selected month/year
  const filteredPayslips = payslips.filter(
    (p) =>
      p.month.toLowerCase() === selectedMonth.toLowerCase() &&
      p.year === selectedYear
  );

  // Get unique years from payslips for dropdown
  const years = [...new Set(payslips.map((p) => p.year))].sort((a, b) => b - a);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Payroll Dashboard
      </h1>

      {/* Add Payslip Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          {showForm ? "Close Form" : "Add New Payslip"}
        </button>
      </div>

      {/* Payslip Form */}
      {showForm && (
        <div className="mb-6 bg-white p-6 rounded shadow-md border border-gray-200">
          <PayslipForm
            onSuccess={() => {
              fetchPayslips();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* Month & Year Navigation */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex overflow-x-auto gap-2">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-2 rounded transition ${
                selectedMonth === month
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading / No Payslip */}
      {loading ? (
        <p className="text-gray-500">Loading payslips...</p>
      ) : filteredPayslips.length === 0 ? (
        <p className="text-gray-500">
          No payslips found for {selectedMonth} {selectedYear}.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow rounded">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-3 border-b">Employee ID</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Designation</th>
                <th className="p-3 border-b">Salary</th>
                <th className="p-3 border-b">Month</th>
                <th className="p-3 border-b">Year</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayslips.map((p, index) => (
                <tr
                  key={`${p.employeeId}-${p.month}-${p.year}-${index}`}
                  className={`${
                    selectedPayslip?.employeeId === p.employeeId
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  } transition`}
                >
                  <td className="p-3 border-b">{p.employeeId}</td>
                  <td className="p-3 border-b">{p.employeeName}</td>
                  <td className="p-3 border-b">{p.designation}</td>
                  <td className="p-3 border-b">₹{p.salary.toLocaleString()}</td>
                  <td className="p-3 border-b capitalize">{p.month}</td>
                  <td className="p-3 border-b">{p.year}</td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => setSelectedPayslip(p)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Generate Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Payslip */}
      {selectedPayslip && (
        <div className="mt-10 bg-white p-6 rounded shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Payslip Preview
            </h2>
            <button
              onClick={() => setSelectedPayslip(null)}
              className="text-red-600 underline hover:text-red-800 transition"
            >
              Close
            </button>
          </div>

          <GeneratePayslip data={selectedPayslip} />
        </div>
      )}
    </div>
  );
};

export default PayrollDashboard;
