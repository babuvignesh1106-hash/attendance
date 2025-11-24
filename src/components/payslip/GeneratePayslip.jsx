import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../assets/logo.png";

export default function GeneratePayslip({ data }) {
  const pdfRef = useRef();

  if (!data) return <p className="text-center p-10">No payslip data found.</p>;

  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Payslip_${data.employeeId}_${data.month}_${data.year}.pdf`);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadPDF}
          className="text-white px-4 py-2 rounded"
          style={{ backgroundColor: "#2563EB" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1D4ED8")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563EB")}
        >
          Download PDF
        </button>
      </div>

      <div className="grid p-10 justify-center" ref={pdfRef}>
        <div
          className="border-2 mt-10"
          style={{ borderColor: "#000000", height: "607px" }}
        >
          {/* HEADER */}
          <div className="grid">
            <div
              className="h-32 flex items-center justify-between px-4"
              style={{ border: "1px solid #000000" }}
            >
              <img src={logo} alt="logo" className="w-28" />
              <div
                className="text-right font-semibold"
                style={{ color: "#1E3A8A" }}
              >
                <h1 className="text-[30px] leading-tight">
                  Ascentware Private Limited,
                </h1>
                <p className="text-[18px]">
                  No.184, Periyar Pathai, Choolaimedu, Chennai - 600094.
                </p>
              </div>
            </div>
          </div>

          {/* MONTH */}
          <div className="grid text-center">
            <div
              className="h-9 flex items-center justify-center"
              style={{ border: "1px solid #000000" }}
            >
              Pay Slip for the Month of {data.month} - {data.year}
            </div>
          </div>

          {/* EMPLOYEE DETAILS */}
          <div
            className="grid grid-cols-6 gap-4"
            style={{ border: "1px solid #000000" }}
          >
            <div className="h-24 flex flex-col justify-center">
              <span>Employee ID:</span>
              <span>Designation:</span>
              <span>Location:</span>
            </div>
            <div className="h-24 flex flex-col justify-center">
              <span>{data.employeeId}</span>
              <span>{data.designation}</span>
              <span>Chennai</span>
            </div>
            <div className="h-24 flex flex-col justify-center">
              <span>Name:</span>
              <span>PAN:</span>
              <span>Date of Joining:</span>
            </div>
            <div className="h-24 flex flex-col justify-center">
              <span>{data.employeeName}</span>
              <span>{data.panCard}</span>
              <span>{data.dateOfJoining}</span>
            </div>
            <div className="h-24 flex flex-col justify-center">
              <span>Payable Days:</span>
              <span>Paid days:</span>
            </div>
            <div className="h-24 flex flex-col justify-center">
              <span>30</span>
              <span>30</span>
            </div>
          </div>

          {/* Earnings/Deductions Table */}
          <div className="grid grid-cols-6">
            {[
              "Earnings",
              "Current Month",
              "Year to Date Earnings",
              "Deductions",
              "Current Month",
              "YTD deductions",
            ].map((text, i) => (
              <div
                key={i}
                className="h-12 flex items-center justify-center"
                style={{ border: "1px solid #000000" }}
              >
                {text}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-6">
            {/* Earnings Labels */}
            <div
              className="h-44 flex flex-col"
              style={{ border: "1px solid #000000" }}
            >
              <span>Basic</span>
              <span>HouseRent Allowance</span>
              <span>Conveyance</span>
              <span>Medical Allowances</span>
              <span>Special allowance</span>
              <span>Other allowances</span>
              <span>Bonus</span>
            </div>

            {/* Earnings Current Month */}
            <div
              className="h-44 flex flex-col items-center"
              style={{ border: "1px solid #000000" }}
            >
              <span>{data.salary}</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>{data.bonus || 0}</span>
            </div>

            {/* Earnings YTD */}
            <div
              className="h-44 flex flex-col items-center"
              style={{ border: "1px solid #000000" }}
            >
              <span>{data.salary * 2}</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>{(data.bonus || 0) * 2}</span>
            </div>

            {/* Deduction Labels */}
            <div
              className="h-44 flex flex-col"
              style={{ border: "1px solid #000000" }}
            >
              <span>PF</span>
              <span>TDS</span>
              <span>Professional Tax</span>
              <span>Gratuity</span>
              <span>Insurance</span>
            </div>

            <div
              className="h-44 flex flex-col items-center"
              style={{ border: "1px solid #000000" }}
            >
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
            </div>

            <div
              className="h-44 flex flex-col items-center"
              style={{ border: "1px solid #000000" }}
            >
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-6">
            {[
              "Gross Total",
              data.salary + (data.bonus || 0),
              (data.salary + (data.bonus || 0)) * 2,
              "Total Deductions",
              0,
              "",
            ].map((txt, i) => (
              <div
                key={i}
                className="h-10 flex items-center justify-center"
                style={{ border: "1px solid #000000" }}
              >
                {txt}
              </div>
            ))}
          </div>

          {/* Net Pay */}
          <div className="grid grid-cols-6">
            <div
              className="h-10 flex items-center"
              style={{ border: "1px solid #000000" }}
            >
              Net Salary Pay
            </div>
            <div
              className="h-10 flex items-center justify-center"
              style={{ border: "1px solid #000000" }}
            >
              {data.salary + (data.bonus || 0)}
            </div>
            <div
              className="h-10 col-span-4 flex items-center justify-center"
              style={{ border: "1px solid #000000" }}
            >
              {convertToWords(data.salary + (data.bonus || 0))} Rupees
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-6">
            <div
              className="h-10 col-span-6 flex items-center justify-center"
              style={{ border: "1px solid #000000" }}
            >
              This is a computer generated document, hence no signature is
              required
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Convert number to words */
function convertToWords(num) {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  if ((num = num.toString()).length > 9) return "Overflow";

  const n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;

  let str = "";
  str +=
    n[1] !== "00"
      ? (a[Number(n[1])] || b[n[1][0]] + a[n[1][1]]) + " Crore "
      : "";
  str +=
    n[2] !== "00"
      ? (a[Number(n[2])] || b[n[2][0]] + a[n[2][1]]) + " Lakh "
      : "";
  str +=
    n[3] !== "00"
      ? (a[Number(n[3])] || b[n[3][0]] + a[n[3][1]]) + " Thousand "
      : "";
  str += n[4] !== "0" ? a[Number(n[4])] + " Hundred " : "";
  str += n[5] !== "00" ? a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]] : "";

  return str.trim();
}
