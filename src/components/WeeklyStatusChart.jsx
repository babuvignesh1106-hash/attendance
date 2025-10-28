import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

// 🎨 Color codes
const WEEKDAY_BLUE = "#7dd3fc";
const WEEKEND_YELLOW = "#fffa93";
const INACTIVE_GRAY = "#d1d5db";
const GRID_COLOR = "#e5e7eb";

// ✅ Custom X-Axis Label
const CustomXAxisTick = ({ x, y, payload }) => {
  const isWeekend = payload.value === "Sat" || payload.value === "Sun";
  return (
    <text
      x={x}
      y={y + 15}
      textAnchor="middle"
      fontSize={14}
      fill={isWeekend ? "#9ca3af" : "#374151"}
      fontWeight={isWeekend ? "bold" : "normal"}
    >
      {payload.value}
    </text>
  );
};

// ✅ Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { workedDuration, breakCount } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 rounded p-2 shadow">
        <p className="font-semibold">{label}</p>
        <p>Worked Hours: {workedDuration.toFixed(2)} hrs</p>
        <p>Breaks Taken: {breakCount}</p>
      </div>
    );
  }
  return null;
};

// ✅ Helper to get Monday of current week
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0–6 (Sun–Sat)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust for Sunday
  return new Date(d.setDate(diff));
};

// ✅ Helper to check if a date is in current week
const isDateInCurrentWeek = (date) => {
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const d = new Date(date);
  return d >= startOfWeek && d <= endOfWeek;
};

export default function WeeklyStatusChart() {
  const [data, setData] = useState([
    { day: "Mon", workedDuration: 0, breakCount: 0 },
    { day: "Tue", workedDuration: 0, breakCount: 0 },
    { day: "Wed", workedDuration: 0, breakCount: 0 },
    { day: "Thu", workedDuration: 0, breakCount: 0 },
    { day: "Fri", workedDuration: 0, breakCount: 0 },
    { day: "Sat", workedDuration: 0, breakCount: 0 },
    { day: "Sun", workedDuration: 0, breakCount: 0 },
  ]);

  const storedUsername = localStorage.getItem("name");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("http://localhost:8000/attendance");
        const attendanceData = res.data || [];

        if (!storedUsername) return;

        // Filter by username and current week
        const userData = attendanceData.filter(
          (entry) =>
            entry.username === storedUsername &&
            entry.startTime &&
            isDateInCurrentWeek(entry.startTime)
        );

        // Initialize week data
        const weekData = {
          Mon: { workedDuration: 0, breakCount: 0 },
          Tue: { workedDuration: 0, breakCount: 0 },
          Wed: { workedDuration: 0, breakCount: 0 },
          Thu: { workedDuration: 0, breakCount: 0 },
          Fri: { workedDuration: 0, breakCount: 0 },
          Sat: { workedDuration: 0, breakCount: 0 },
          Sun: { workedDuration: 0, breakCount: 0 },
        };

        // ✅ Group entries by date
        const groupedByDate = {};
        userData.forEach((entry) => {
          const dateKey = new Date(entry.startTime).toDateString();
          if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
          groupedByDate[dateKey].push(entry);
        });

        // ✅ Sum all worked durations and break counts for each date
        Object.keys(groupedByDate).forEach((dateKey) => {
          const entries = groupedByDate[dateKey];

          // Sum total workedDuration (in seconds) and breakCount
          const totalWorkedSeconds = entries.reduce(
            (sum, e) => sum + (e.workedDuration || 0),
            0
          );
          const totalBreakCount = entries.reduce(
            (sum, e) => sum + (e.breakCount || 0),
            0
          );

          const weekday = new Date(entries[0].startTime).toLocaleDateString(
            "en-US",
            { weekday: "short" }
          );

          // Convert seconds to hours
          const workedHours = totalWorkedSeconds / 3600;

          if (weekData[weekday]) {
            weekData[weekday].workedDuration += workedHours;
            weekData[weekday].breakCount += totalBreakCount;
          }
        });

        // ✅ Convert to chart-friendly array
        const chartData = Object.keys(weekData).map((day) => ({
          day,
          ...weekData[day],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [storedUsername]);

  return (
    <div className="flex flex-col items-center justify-start h-full w-full py-8">
      <div className="text-center flex flex-col items-center justify-start font-sans text-sm w-full space-y-4">
        <h2 className="text-2xl font-bold text-blue-600 tracking-wide">
          Weekly Status Chart
        </h2>
        {storedUsername && (
          <p className="text-gray-500 mb-2">
            Showing data for{" "}
            <span className="font-semibold text-gray-700">
              {storedUsername}
            </span>
          </p>
        )}

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="day" tick={<CustomXAxisTick />} />
            <YAxis
              type="number"
              domain={[0, 14]}
              ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
              interval={0}
              allowDataOverflow
              allowDecimals={true}
              tick={{ fill: "#374151", fontSize: 14, fontWeight: "bold" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "14px" }} />

            <Bar dataKey="workedDuration" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => {
                const isWeekend = entry.day === "Sat" || entry.day === "Sun";
                let fillColor;

                if (isWeekend) {
                  fillColor = WEEKEND_YELLOW;
                } else if (entry.workedDuration === 0) {
                  fillColor = INACTIVE_GRAY;
                } else {
                  fillColor = WEEKDAY_BLUE;
                }

                return <Cell key={`bar-${index}`} fill={fillColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
