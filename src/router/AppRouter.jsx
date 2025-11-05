// src/routes/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // ✅ Correct import
import { ROUTES } from "../constants/routes";
import Dashboard from "../pages/Dashboard";
import EmpSidebar from "../components/sidebar/EmpSidebar";
import EmpSidebarItem from "../components/sidebar/EmpSidebarItem";
import CalendarGrid from "../components/calendar/CalendarGrid";
import WeeklyStatusChart from "../components/WeeklyStatusChart";
import Admin from "../components/admin/Admin";
import Calendar from "../components/calendar/Calendar";
import EmployeePopup from "../components/calendar/EmployeePopup";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../router/ProtectedRoute"; // ✅ Add this for route protection
import CheckOutDialog from "../components/CheckOutDialog";
import LeaveRequestForm from "../pages/LeaveRequestForm";
import PermissionRequestForm from "../components/PermissionRequestForm";
import BalanceCheck from "../components/BalanceCheck";
import LeaveDashboard from "../components/leave/LeaveDashboard";
import Approved from "../components/leave/Approved";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />

        {/* Protected Routes */}
        <Route
          element={<ProtectedRoute />} // ✅ Protect all routes below
        >
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.SIDEBAR} element={<EmpSidebar />} />
          <Route path={ROUTES.SIDEBARITEM} element={<EmpSidebarItem />} />
          <Route path={ROUTES.CALENDAR} element={<Calendar />} />
          <Route path={ROUTES.CALENDARGRID} element={<CalendarGrid />} />
          <Route path={ROUTES.EMPLOYEEPOPUP} element={<EmployeePopup />} />
          <Route
            path={ROUTES.WEEKLYSTATUSCHART}
            element={<WeeklyStatusChart />}
          />
          <Route path={ROUTES.ADMIN} element={<Admin />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckOutDialog />} />
          <Route
            path={ROUTES.LeaveRequestForm}
            element={<LeaveRequestForm />}
          />
          <Route
            path={ROUTES.PERMISSIONREQUESTFORM}
            element={<PermissionRequestForm />}
          />
          <Route path={ROUTES.BALANCECHECK} element={<BalanceCheck />} />
          <Route path={ROUTES.LEAVEDASHBOARD} element={<LeaveDashboard />} />
          <Route path={ROUTES.APPROVED} element={<Approved />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
