// src/store/attendanceStore.js
import { create } from "zustand";
import axios from "axios";

const API = "https://attendance-backend-bqhw.vercel.app/attendance";
const JSON_HEADERS = { headers: { "Content-Type": "application/json" } };

let _interval = null;

// Format milliseconds → HH:MM:SS
const formatMs = (ms = 0) => {
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export const useAttendanceStore = create((set, get) => ({
  username: localStorage.getItem("name") || "user-no-name",

  // STATE
  isCheckedIn: false,
  isOnBreak: false,
  startTime: null,
  elapsedTime: 0,
  breakStart: null,
  breakElapsed: 0,
  breakCount: 0,

  // TIMER --------------------------
  _startTimer: () => {
    get()._stopTimer();
    if (!get().startTime) return;

    _interval = setInterval(() => {
      const now = Date.now();

      let worked = now - get().startTime - get().breakElapsed;

      if (get().isOnBreak && get().breakStart) {
        worked -= now - get().breakStart;
      }

      set({ elapsedTime: worked >= 0 ? worked : 0 });
    }, 1000);
  },

  _stopTimer: () => {
    if (_interval) {
      clearInterval(_interval);
      _interval = null;
    }
  },

  // CHECK-IN ------------------------
  checkIn: async () => {
    const username = get().username;
    try {
      const res = await axios.post(
        `${API}/check-in`,
        { username },
        JSON_HEADERS
      );
      const data = res.data;

      // FIXED: parse backend UTC time correctly
      const startMs = Date.parse(data.startTime);

      set({
        isCheckedIn: true,
        startTime: startMs,
        breakCount: data.breakCount || 0,
        breakElapsed: (data.totalBreakDuration || 0) * 1000,
        isOnBreak: false,
        breakStart: null,
        elapsedTime: 0,
      });

      get()._startTimer();
    } catch (err) {
      console.error("CHECK-IN ERROR:", err);
      if (err.response?.data?.message) alert(err.response.data.message);
    }
  },

  // BREAK START ------------------------
  startBreak: async () => {
    const username = get().username;

    try {
      const res = await axios.post(
        `${API}/start-break`,
        { username },
        JSON_HEADERS
      );
      const data = res.data;

      get()._stopTimer();

      set({
        isOnBreak: true,
        breakStart: Date.parse(data.currentBreakStart), // FIXED
        breakCount: data.breakCount,
      });
    } catch (err) {
      console.error("START BREAK ERROR:", err);
      if (err.response?.data?.message) alert(err.response.data.message);
    }
  },

  // BREAK END ------------------------
  endBreak: async () => {
    const username = get().username;
    const bstart = get().breakStart;

    if (!bstart) return;

    try {
      const res = await axios.post(
        `${API}/end-break`,
        { username },
        JSON_HEADERS
      );
      const data = res.data;

      set({
        isOnBreak: false,
        breakStart: null,
        breakElapsed: (data.totalBreakDuration || 0) * 1000,
      });

      get()._startTimer();
    } catch (err) {
      console.error("END BREAK ERROR:", err);
      if (err.response?.data?.message) alert(err.response.data.message);
    }
  },

  toggleBreak: async () => {
    if (get().isOnBreak) await get().endBreak();
    else await get().startBreak();
  },

  // CHECK-OUT ------------------------
  checkOut: async () => {
    const username = get().username;

    try {
      await axios.post(`${API}/check-out`, { username }, JSON_HEADERS);

      get()._stopTimer();

      set({
        isCheckedIn: false,
        isOnBreak: false,
        startTime: null,
        elapsedTime: 0,
        breakStart: null,
        breakElapsed: 0,
        breakCount: 0,
      });
    } catch (err) {
      console.error("CHECK-OUT ERROR:", err);
      if (err.response?.data?.message) alert(err.response.data.message);
    }
  },

  // RESUME SESSION ------------------------
  resumeFromBackend: async () => {
    const username = get().username;
    try {
      const res = await axios.get(`${API}`);
      const data = Array.isArray(res.data) ? res.data : res.data.records || [];

      const todayOpen = data.find((r) => r.username === username && !r.endTime);

      if (!todayOpen) return;

      const startMs = Date.parse(todayOpen.startTime); // FIXED
      const breakElapsed = (todayOpen.totalBreakDuration || 0) * 1000;

      const onBreak = todayOpen.currentBreakStart != null;

      const breakStartMs = onBreak
        ? Date.parse(todayOpen.currentBreakStart) // FIXED
        : null;

      set({
        isCheckedIn: true,
        startTime: startMs,
        breakElapsed,
        breakCount: todayOpen.breakCount || 0,
        isOnBreak: onBreak,
        breakStart: breakStartMs,
      });

      get()._startTimer();
    } catch (err) {
      console.error("RESUME ERROR:", err);
    }
  },

  resumeTimer: async () => get().resumeFromBackend(),

  // RESET ------------------------
  resetLocal: () => {
    get()._stopTimer();
    set({
      isCheckedIn: false,
      isOnBreak: false,
      startTime: null,
      elapsedTime: 0,
      breakStart: null,
      breakElapsed: 0,
      breakCount: 0,
    });
  },

  // FORMATTER
  formatElapsed: (ms) => formatMs(ms),
}));
