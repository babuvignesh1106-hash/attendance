// src/stores/attendanceStore.js
import { create } from "zustand";
import axios from "axios";

const API = "https://attendance-backend-bqhw.vercel.app/attendance";

export const useAttendanceStore = create((set, get) => ({
  // STATE
  isCheckedIn: false,
  isOnBreak: false,
  startTime: null, // ms timestamp
  elapsedTime: 0, // ms
  breakStart: null, // ms timestamp
  breakElapsed: 0, // ms (accumulated)
  breakCount: 0,

  timerInterval: null,

  username: localStorage.getItem("name") || "maari",

  // INTERNAL TIMER START
  _startTimer: () => {
    if (get().timerInterval) {
      clearInterval(get().timerInterval);
      set({ timerInterval: null });
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const start = get().startTime;
      if (!start) {
        set({ elapsedTime: 0 });
        return;
      }

      let worked = now - start - get().breakElapsed;

      if (get().isOnBreak && get().breakStart) {
        worked -= now - get().breakStart;
      }

      set({ elapsedTime: worked >= 0 ? worked : 0 });
    }, 1000);

    set({ timerInterval: interval });
  },

  _stopTimer: () => {
    if (get().timerInterval) {
      clearInterval(get().timerInterval);
      set({ timerInterval: null });
    }
  },

  // CHECK IN
  checkIn: async () => {
    const username = get().username;
    try {
      const res = await axios.post(`${API}/check-in`, { username });
      const startMs = new Date(res.data.startTime).getTime();

      set({
        isCheckedIn: true,
        isOnBreak: false,
        startTime: startMs,
        breakStart: null,
        breakElapsed: 0,
        breakCount: 0,
        elapsedTime: 0,
      });

      get()._startTimer();
    } catch (err) {
      throw err;
    }
  },

  // START BREAK
  startBreak: async () => {
    const username = get().username;
    try {
      await axios.post(`${API}/start-break`, { username });
      set({
        isOnBreak: true,
        breakStart: Date.now(),
        breakCount: get().breakCount + 1,
      });
    } catch (err) {
      throw err;
    }
  },

  // END BREAK
  endBreak: async () => {
    const username = get().username;
    const bstart = get().breakStart;
    if (!bstart) return;

    try {
      await axios.post(`${API}/end-break`, { username });

      const now = Date.now();
      const passed = now - bstart;

      set({
        isOnBreak: false,
        breakStart: null,
        breakElapsed: get().breakElapsed + passed,
      });
    } catch (err) {
      throw err;
    }
  },

  // ✅ ADDED: TOGGLE BREAK
  toggleBreak: async () => {
    const { isOnBreak, startBreak, endBreak } = get();
    if (isOnBreak) {
      await endBreak();
    } else {
      await startBreak();
    }
  },

  // CHECK OUT
  checkOut: async () => {
    const username = get().username;
    try {
      await axios.post(`${API}/check-out`, { username });

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
      throw err;
    }
  },

  // RESUME FROM BACKEND
  resumeFromBackend: async () => {
    const username = get().username;
    try {
      const res = await axios.get(`${API}`);
      const todayOpen = Array.isArray(res.data)
        ? res.data.find((r) => r.username === username && !r.endTime)
        : null;

      if (!todayOpen) return;

      const start = new Date(todayOpen.startTime).getTime();
      const totalBreakMs = (todayOpen.totalBreakDuration || 0) * 1000;
      const onBreak = todayOpen.currentBreakStart != null;
      const breakStartMs = onBreak
        ? new Date(todayOpen.currentBreakStart).getTime()
        : null;

      set({
        isCheckedIn: true,
        startTime: start,
        breakCount: todayOpen.breakCount || 0,
        breakElapsed: totalBreakMs,
        isOnBreak: onBreak,
        breakStart: breakStartMs,
      });

      get()._startTimer();
    } catch (err) {
      throw err;
    }
  },

  // Alias for UI
  resumeTimer: async () => {
    return get().resumeFromBackend();
  },

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
      timerInterval: null,
    });
  },
}));
