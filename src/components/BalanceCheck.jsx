import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BalanceCheck() {
  const username = localStorage.getItem("name"); // get name from localStorage
  const [balanceData, setBalanceData] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(
          `https://attendance-backend-bqhw.vercel.app/leaves/balance/${username}`
        );
        setBalanceData(res.data);
      } catch (err) {
        console.error(err);
        setBalanceData(null); // just keep it null if error
      }
    };

    if (username) fetchBalance();
  }, [username]);

  const leaveTypes = [
    "sickLeave",
    "personalLeave",
    "earnedLeave",
    "maternityLeave",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Leave Balance - {username}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-left">
          {leaveTypes.map((type) => (
            <div
              key={type}
              className="bg-green-100 p-4 rounded-xl flex flex-col items-center justify-center"
            >
              <h3 className="font-semibold text-gray-700">
                {type
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </h3>
              <span className="text-xl font-bold text-green-700">
                {balanceData ? balanceData[type] : 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
