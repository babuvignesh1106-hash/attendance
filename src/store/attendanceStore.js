import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API = "http://localhost:8000/attendance";
const JSON_HEADERS = { headers: { "Content-Type": "application/json" } };

export const useAttendanceStore = create(
  persist(
    (set, get) => ({
      username: localStorage.getItem("name") || "user-no-name",

      // ---------------------------
      // STATE
      // ---------------------------
      isCheckedIn: false,
      isOnBreak: false,
      startTime: null, // timestamp in ms
      elapsedTime: 0, // milliseconds
      breakStart: null, // timestamp in ms for current break
      breakElapsed: 0, // total break duration in ms
      breakCount: 0,
      _interval: null,

      // ---------------------------
      // TIMER
      // ---------------------------
      _startTimer: () => {
        get()._stopTimer();
        if (!get().startTime) return;

        const interval = setInterval(() => {
          let worked = Date.now() - get().startTime - get().breakElapsed;
          if (get().isOnBreak && get().breakStart) {
            worked -= Date.now() - get().breakStart;
          }
          set({ elapsedTime: worked >= 0 ? worked : 0 });
        }, 1000);

        set({ _interval: interval });
      },

      _stopTimer: () => {
        if (get()._interval) {
          clearInterval(get()._interval);
          set({ _interval: null });
        }
      },

      // ---------------------------
      // CHECK-IN / CHECK-OUT
      // ---------------------------
      checkIn: async () => {
        const username = get().username;
        try {
          const res = await axios.post(
            `${API}/check-in`,
            { username },
            JSON_HEADERS
          );
          const data = res.data;

          const now = Date.now();
          set({
            isCheckedIn: true,
            startTime: now,
            breakCount: data.breakCount || 0,
            breakElapsed: (data.totalBreakDuration || 0) * 1000,
            isOnBreak: false,
            breakStart: null,
            elapsedTime: 0,
          });

          localStorage.setItem("startTime", now);
          get()._startTimer();
        } catch (err) {
          console.error("CHECK-IN ERROR:", err);
          if (err.response?.data?.message) alert(err.response.data.message);
        }
      },
      checkOut: async () => {
        get()._stopTimer(); // stop timer immediately
        localStorage.removeItem("startTime"); // clear local storage

        const username = get().username;
        try {
          await axios.post(`${API}/check-out`, { username }, JSON_HEADERS);
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

      // ---------------------------
      // BREAK HANDLERS
      // ---------------------------
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
            breakStart: new Date(data.currentBreakStart).getTime(),
            breakCount: data.breakCount,
          });
        } catch (err) {
          console.error("START BREAK ERROR:", err);
          if (err.response?.data?.message) alert(err.response.data.message);
        }
      },
      reset: () =>
        set({
          isCheckedIn: false,
          startTime: null,
          elapsedTime: 0,
          breakCount: 0,
          totalBreakDuration: 0,
          isOnBreak: false,
        }),
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

      // ---------------------------
      // RESUME TIMER
      // ---------------------------
      resumeTimer: () => {
        const storedStart = localStorage.getItem("startTime");
        if (storedStart) {
          const start = parseInt(storedStart);
          set({
            isCheckedIn: true,
            startTime: start,
            elapsedTime: Date.now() - start,
          });
          get()._startTimer();
        }
      },

      // ---------------------------
      // RESET STORE
      // ---------------------------
      resetLocal: () => {
        get()._stopTimer();
        localStorage.removeItem("startTime");
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

      // ---------------------------
      // FORMATTER
      // ---------------------------
      formatElapsed: (ms) => {
        const totalSec = Math.floor(ms / 1000);
        const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
        const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
        const s = String(totalSec % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
      },
    }),
    {
      name: "attendance-storage", // Persist in localStorage
      getStorage: () => localStorage,
    }
  )
);
