import { useState, useEffect } from "react";
import { useAttendanceStore } from "../store/attendanceStore";

import EmployeeDetails from "../components/EmployeeDetails";
import TodaySummary from "../components/TodaySummary";
import BreakTime from "../components/BreakTime";
import Navbar from "../components/Navbar";
import EmpSidebar from "../components/sidebar/EmpSidebar";
import WeeklyStatusChart from "../components/WeeklyStatusChart";
import { ROUTES } from "../constants/routes";
import CalendarGrid from "../components/calendar/CalendarGrid";
import Admin from "../components/admin/Admin";
import LeaveRequestForm from "./LeaveRequestForm";
import AdminForm from "../components/admin/AdminForm";
import PermissionRequestForm from "../components/PermissionRequestForm";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // sidebar initially closed
  const [activePage, setActivePage] = useState(ROUTES.DASHBOARD);

  const resumeTimer = useAttendanceStore((state) => state.resumeTimer);
  useEffect(() => {
    resumeTimer();
  }, [resumeTimer]);

  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Header Navbar */}
      <header className="w-full fixed top-0 left-0 z-50 shadow-md bg-white">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </header>

      <div className="flex pt-[70px]">
        {/* Sidebar */}
        <div
          className={`fixed top-[70px] left-0 h-[calc(100vh-70px)] transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "w-64" : "w-0"
          }`}
        >
          <EmpSidebar
            isOpen={isSidebarOpen}
            onNavigate={setActivePage}
            activePage={activePage}
          />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <main className="relative p-4 sm:p-8 overflow-y-auto origin-top lg:scale-[0.9] xl:scale-[0.9]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6  ">
              {activePage === ROUTES.DASHBOARD && (
                <>
                  <div className="col-span-2 bg-white p-4 rounded-xl shadow-md h-full flex flex-col">
                    <EmployeeDetails />
                  </div>
                  <div className="col-span-2 bg-white p-4 rounded-xl shadow-md h-full flex flex-col">
                    <BreakTime />
                  </div>
                  <div className="col-span-4 bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
                    <TodaySummary />
                  </div>
                  <div className="col-span-4 bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
                    <WeeklyStatusChart />
                  </div>
                  <div className="col-span-4  bg-white p-6 rounded-xl shadow-md h-full flex flex-col pointer-events-none">
                    <CalendarGrid />
                  </div>
                </>
              )}

              {activePage === ROUTES.CALENDARGRID && (
                <div className="col-span-8 bg-white p-6 rounded-xl shadow-md h-full">
                  <CalendarGrid />
                </div>
              )}

              {activePage === ROUTES.ADMIN && (
                <div className="col-span-8 p-6 rounded-xl  h-full">
                  <Admin />
                </div>
              )}
              {activePage === ROUTES.LeaveRequestForm && (
                <div className="col-span-8 p-6 rounded-xl  h-full">
                  <LeaveRequestForm />
                </div>
              )}
              {activePage === ROUTES.PERMISSIONREQUESTFORM && (
                <div className="col-span-8 p-6 rounded-xl  h-full">
                  <PermissionRequestForm />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
