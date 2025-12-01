import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaChevronDown,
  FaChevronUp,
  FaUserShield,
  FaTable,
  FaMoneyCheckAlt,
  FaUsers,
  FaRegCalendarAlt,
} from "react-icons/fa";
import EmpSidebarItem from "./EmpSidebarItem";
import { ROUTES } from "../../constants/routes";

const EmpSidebar = ({ isOpen, onNavigate, activePage }) => {
  const [openPermission, setOpenPermission] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "employee";
    setRole(storedRole);
  }, []);

  const permissionItems = [
    { label: "Leave Request", route: ROUTES.LEAVEDASHBOARD },
    { label: "Permission Request", route: ROUTES.PERMISSIONDASHBOARD },
  ];

  return (
    <aside
      className={`fixed left-0 h-full w-60 bg-[#0077b6] text-white shadow-lg transition-transform duration-300 z-[900] ${
        isOpen ? "translate-x-0" : "-translate-x-60"
      }`}
    >
      {/* Dashboard */}
      <EmpSidebarItem
        icon={<FaTachometerAlt />}
        label="Dashboard"
        onClick={() => onNavigate(ROUTES.DASHBOARD)}
        active={activePage === ROUTES.DASHBOARD}
      />

      {/* Calendar */}
      <EmpSidebarItem
        icon={<FaRegCalendarAlt />}
        label="Calendar"
        onClick={() => onNavigate(ROUTES.CALENDARGRID)}
        active={activePage === ROUTES.CALENDARGRID}
      />

      {/* ADMIN ONLY SECTION */}
      {role === "admin" && (
        <>
          {/* Employees */}
          <EmpSidebarItem
            icon={<FaUsers />}
            label="Employees"
            onClick={() => onNavigate(ROUTES.STAFF_DASHBOARD)}
            active={activePage === ROUTES.STAFF_DASHBOARD}
          />

          {/* Admin Dashboard */}
          <EmpSidebarItem
            icon={<FaTable />}
            label="Admin Dashboard"
            onClick={() => onNavigate(ROUTES.ADMINDASHBOARD)}
            active={activePage === ROUTES.ADMINDASHBOARD}
          />

          {/* Payroll – direct click (DROPDOWN REMOVED) */}
          <EmpSidebarItem
            icon={<FaMoneyCheckAlt />}
            label="Payroll"
            onClick={() => onNavigate(ROUTES.PAYROLL)}
            active={activePage === ROUTES.PAYROLL_DASHBOARD}
          />
        </>
      )}

      {/* EMPLOYEE ONLY SECTION */}
      {role === "employee" && (
        <EmpSidebarItem
          icon={<FaMoneyCheckAlt />}
          label="New Emp Payroll"
          onClick={() => onNavigate(ROUTES.NEW_EMP_PAY)}
          active={activePage === ROUTES.NEW_EMP_PAY}
        />
      )}

      {/* Permission Dropdown (Visible for ALL roles) */}
      <div className="mx-2 mt-3">
        <button
          className="w-full flex items-center justify-between bg-[#023e8a] px-4 py-3 rounded-lg text-lg font-semibold hover:bg-[#0353a4] transition"
          onClick={() => setOpenPermission((prev) => !prev)}
        >
          <span className="flex items-center gap-2">
            <FaUserShield /> Permission
          </span>
          {openPermission ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        <div
          className={`bg-gray-100 rounded-lg shadow-md mt-2 overflow-hidden transition-all duration-300 ${
            openPermission ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {permissionItems.map((item, i) => (
            <div
              key={i}
              className={`text-center px-3 py-2 m-2 rounded-md bg-white text-[#0077b6] text-sm font-medium cursor-pointer hover:bg-blue-50 hover:scale-[1.02] transition ${
                activePage === item.route ? "bg-blue-100 font-bold" : ""
              }`}
              onClick={() => onNavigate(item.route)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default EmpSidebar;
