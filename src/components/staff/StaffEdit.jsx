import React, { useEffect, useState } from "react";

export default function StaffEdit({ setActivePage }) {
  const staffId = localStorage.getItem("editStaffId");
  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    designation: "",
    salary: "",
    pancard: "",
    dateOfJoining: "",
    location: "",
  });

  useEffect(() => {
    if (!staffId) return;
    fetch(`http://localhost:8000/staff/${staffId}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [staffId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8000/staff/${staffId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("Staff updated successfully!");
      if (setActivePage) setActivePage("STAFF_LIST");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Edit Staff
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
          <button
            type="button"
            onClick={() => setActivePage("STAFF_LIST")}
            className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Update Staff
          </button>
        </div>
      </form>
    </div>
  );
}
