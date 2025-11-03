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
  Label,
} from "recharts";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

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

// ✅ Get start of week (Monday)
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// ✅ Check if a date is in the same week
const isDateInWeek = (date, weekStart) => {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const d = new Date(date);
  return d >= start && d <= end;
};

// ✅ Format week range
const formatWeekRange = (startDate) => {
  const end = new Date(startDate);
  end.setDate(startDate.getDate() + 6);
  const options = { month: "short", day: "numeric" };
  return `${startDate.toLocaleDateString(
    "en-US",
    options
  )} – ${end.toLocaleDateString("en-US", options)}`;
};

export default function WeeklyStatusChart() {
  const [data, setData] = useState([]);
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [weekLabel, setWeekLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const storedUsername = localStorage.getItem("name");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://attendance-backend-bqhw.vercel.app/attendance"
        );
        const attendanceData = res.data || [];

        if (!storedUsername) {
          console.warn("⚠️ No stored username found in localStorage");
          setData([]);
          setLoading(false);
          return;
        }

        const userData = attendanceData.filter(
          (entry) =>
            entry.username?.toLowerCase() === storedUsername?.toLowerCase() &&
            entry.startTime &&
            isDateInWeek(entry.startTime, weekStart)
        );

        const weekData = {
          Mon: { workedDuration: 0, breakCount: 0 },
          Tue: { workedDuration: 0, breakCount: 0 },
          Wed: { workedDuration: 0, breakCount: 0 },
          Thu: { workedDuration: 0, breakCount: 0 },
          Fri: { workedDuration: 0, breakCount: 0 },
          Sat: { workedDuration: 0, breakCount: 0 },
          Sun: { workedDuration: 0, breakCount: 0 },
        };

        // Group by date
        const groupedByDate = {};
        userData.forEach((entry) => {
          const dateKey = new Date(entry.startTime).toDateString();
          if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
          groupedByDate[dateKey].push(entry);
        });

        Object.keys(groupedByDate).forEach((dateKey) => {
          const entries = groupedByDate[dateKey];
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

          const workedHours = totalWorkedSeconds / 3600;
          if (weekData[weekday]) {
            weekData[weekday].workedDuration += workedHours;
            weekData[weekday].breakCount += totalBreakCount;
          }
        });

        const chartData = Object.keys(weekData).map((day) => ({
          day,
          ...weekData[day],
        }));

        setData(chartData);
        setWeekLabel(formatWeekRange(weekStart));
      } catch (error) {
        console.error("❌ Error fetching attendance:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [weekStart, storedUsername]);

  const handlePrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newStart);
  };

  const today = new Date();

  return (
    <div className="flex flex-col items-center justify-start h-full w-full py-8">
      <div className="w-full max-w-3xl flex flex-col items-center font-sans">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">
          Weekly Status Chart
        </h2>

        {storedUsername && (
          <p className="text-gray-500 mb-4">
            Showing data for{" "}
            <span className="font-semibold text-gray-700">
              {storedUsername}
            </span>
          </p>
        )}

        {/* Week Navigation */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handlePrevWeek}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow"
          >
            <IoChevronBack className="text-xl text-gray-700" />
          </button>
          <span className="text-lg font-semibold text-gray-700">
            {weekLabel}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow"
          >
            <IoChevronForward className="text-xl text-gray-700" />
          </button>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="day" tick={<CustomXAxisTick />} />
            <YAxis
              type="number"
              domain={[0, 14]}
              ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
              tick={{ fill: "#374151", fontSize: 14, fontWeight: "bold" }}
            >
              <Label
                value="Hours"
                angle={-90}
                position="insideLeft"
                style={{
                  textAnchor: "middle",
                  fill: "#6b7280",
                  fontSize: 14,
                }}
              />
            </YAxis>

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "14px" }} />

            <Bar
              dataKey="workedDuration"
              radius={[6, 6, 0, 0]}
              minPointSize={20}
            >
              {data.map((entry, index) => {
                const isWeekend = entry.day === "Sat" || entry.day === "Sun";
                const isNonWorking = entry.workedDuration === 0;
                const dayIndex = [
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ].indexOf(entry.day);
                const entryDate = new Date(weekStart);
                entryDate.setDate(weekStart.getDate() + dayIndex);
                const isFuture = entryDate > today;

                let fillColor;
                if (isFuture) fillColor = INACTIVE_GRAY;
                else if (isWeekend || isNonWorking) fillColor = WEEKEND_YELLOW;
                else fillColor = WEEKDAY_BLUE;

                return <Cell key={`bar-${index}`} fill={fillColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* 🎨 Color Legend */}
        <div className="flex justify-center items-center gap-6 mt-6 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#7dd3fc] border" />
            <span>Worked Days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#fffa93] border" />
            <span>Non-working / Weekend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#d1d5db] border" />
            <span>Future Days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
