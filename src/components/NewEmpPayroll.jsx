import React, { useEffect, useState } from "react";
import axios from "axios";
import GeneratePayslip from "./payslip/GeneratePayslip.jsx";

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

export default function NewEmpPayroll() {
  const [payslips, setPayslips] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayslip = async () => {
      try {
        const storedName = localStorage.getItem("name");
        if (!storedName) {
          console.warn("No name in localStorage");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://attendance-backend-bqhw.vercel.app/paySlip"
        );

        const cleanStored = storedName.trim().toLowerCase();

        // Filter all payslips matching employee
        const matched = res.data.filter(
          (p) => p.employeeName?.trim().toLowerCase() === cleanStored
        );

        setPayslips(matched);
      } catch (error) {
        console.error("Error fetching payslip:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPayslip();
  }, []);

  if (loading)
    return <div className="text-center p-6 text-lg">Loading payroll…</div>;

  if (payslips.length === 0)
    return (
      <div className="text-center p-6 text-red-600 font-semibold">
        No payslips found for this employee.
      </div>
    );

  // Find payslip by clicked month
  const selectedPayslip = payslips.find(
    (p) => p.month?.toLowerCase() === selectedMonth?.toLowerCase()
  );

  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4 text-center">Employee Payroll</h1>

      {/* Month Calendar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, i) => {
          const exist = payslips.some(
            (p) => p.month?.toLowerCase() === month.toLowerCase()
          );

          return (
            <div
              key={i}
              onClick={() => exist && setSelectedMonth(month)}
              className={`p-8 rounded-xl shadow-lg text-center cursor-pointer border
                ${
                  exist
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              <h2 className="text-xl font-semibold">{month}</h2>
              {exist ? (
                <p className="mt-2 text-sm">Click to view payslip</p>
              ) : (
                <p className="mt-2 text-sm opacity-60">No payslip available</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Payslip Viewer */}
      {selectedMonth && selectedPayslip && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Payslip for {selectedMonth} - {selectedPayslip.year}
          </h2>

          {/* Render your existing GeneratePayslip component */}
          <GeneratePayslip data={selectedPayslip} />
        </div>
      )}
    </div>
  );
}
