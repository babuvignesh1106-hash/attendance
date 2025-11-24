import React, { useEffect, useState } from "react";
import StaffTable from "./StaffTable";
import { ROUTES } from "../../constants/routes";

export default function StaffList({ setActivePage }) {
  const [staff, setStaff] = useState([]);

  const fetchStaff = async () => {
    try {
      const res = await fetch(
        "https://attendance-backend-bqhw.vercel.app/staff"
      );
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;

    try {
      await fetch(`https://attendance-backend-bqhw.vercel.app/staff/${id}`, {
        method: "DELETE",
      });
      fetchStaff();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (staff) => {
    localStorage.setItem("editStaffId", staff.id);
    if (setActivePage) setActivePage(ROUTES.STAFF_EDIT);
  };

  const handleAdd = () => {
    if (setActivePage) setActivePage(ROUTES.STAFF_FORM);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Staff Records
      </h2>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Staff
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <StaffTable data={staff} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}
