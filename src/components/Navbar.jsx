import { FaBars } from "react-icons/fa";
import { useAttendanceStore } from "../store/attendanceStore";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CheckOutDialog from "./CheckOutDialog";
import LogoutDialog from "./LogoutDialog";

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Navbar({ onToggleSidebar }) {
  const { isCheckedIn, checkIn, checkOut, elapsedTime, isOnBreak } =
    useAttendanceStore();

  const [showCheckOutDialog, setShowCheckOutDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const workedTimeFormatted = formatTime(elapsedTime);

  const handleLogoutClick = () => setShowLogoutDialog(true);
  const confirmLogout = () => {
    if (isCheckedIn) checkOut();
    localStorage.clear();
    navigate("/");
    setShowLogoutDialog(false);
  };
  const cancelLogout = () => setShowLogoutDialog(false);

  const handleCheckOutClick = () => setShowCheckOutDialog(true);
  const confirmCheckOut = () => {
    checkOut();
    setShowCheckOutDialog(false);
  };
  const cancelCheckOut = () => setShowCheckOutDialog(false);

  return (
    <>
      <nav className="bg-[#0b2c5d] shadow-md fixed w-full top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="text-white text-xl hover:text-gray-300 "
            >
              <FaBars />
            </button>

            <img src={Logo} alt="Logo" className="h-10 w-10 object-contain" />
            <span className="text-white font-semibold text-lg">
              Employee Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white text-black font-mono px-3 py-1 rounded-md shadow-md min-w-[120px] text-center">
              {workedTimeFormatted} {isOnBreak && "(On Break)"}
            </div>

            {!isCheckedIn ? (
              <button
                onClick={checkIn}
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md shadow-md transition-all"
              >
                Check-In
              </button>
            ) : (
              <button
                onClick={handleCheckOutClick}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md shadow-md transition-all"
              >
                Check-Out
              </button>
            )}

            <button
              onClick={handleLogoutClick}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md shadow-md transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showCheckOutDialog && (
        <CheckOutDialog
          workedTime={workedTimeFormatted}
          onConfirm={confirmCheckOut}
          onCancel={cancelCheckOut}
        />
      )}

      {showLogoutDialog && (
        <LogoutDialog onConfirm={confirmLogout} onCancel={cancelLogout} />
      )}
    </>
  );
}
