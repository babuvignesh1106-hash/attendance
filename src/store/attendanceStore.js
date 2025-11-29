import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_BASE = "https://attendance-backend-bqhw.vercel.app/attendance";

export const useAttendanceStore = create(
  persist(
    (set, get) => ({
      isCheckedIn: false,
      startTime: null,
      elapsedTime: 0,
      timerInterval: null,
      isOnBreak: false,
      breakCount: 0,
      breakStart: null,
      breakElapsed: 0,
      date: new Date().toDateString(),

      // ✅ CHECK-IN
      checkIn: async () => {
        if (get().isCheckedIn) return;

        const username = localStorage.getItem("name") || "unknown";

        try {
          await axios.post(`${API_BASE}/check-in`, { username });

          const now = Date.now();
          const interval = setInterval(() => get().resumeTimerTick(), 1000);

          set({
            isCheckedIn: true,
            startTime: now,
            timerInterval: interval,
            breakElapsed: 0,
            breakCount: 0,
            isOnBreak: false,
            breakStart: null,
            elapsedTime: 0,
            date: new Date().toDateString(),
          });
        } catch (err) {
          console.error("Check-in failed:", err);
        }
      },

      // ✅ TOGGLE BREAK
      toggleBreak: async () => {
        if (!get().isCheckedIn) return;

        const username = localStorage.getItem("name") || "unknown";

        try {
          if (get().isOnBreak) {
            // End break
            await axios.post(`${API_BASE}/end-break`, { username });
            const now = Date.now();
            const breakDuration = now - get().breakStart!;
            set({
              isOnBreak: false,
              breakElapsed: get().breakElapsed + breakDuration,
              breakStart: null,
            });
          } else {
            // Start break
            await axios.post(`${API_BASE}/start-break`, { username });
            set({
              isOnBreak: true,
              breakCount: get().breakCount + 1,
              breakStart: Date.now(),
            });
          }
        } catch (err) {
          console.error("Break toggle failed:", err);
        }
      },

      // ✅ CHECK-OUT
      checkOut: async () => {
        if (!get().isCheckedIn) return;

        const username = localStorage.getItem("name") || "unknown";

        if (get().timerInterval) clearInterval(get().timerInterval);

        try {
          await axios.post(`${API_BASE}/check-out`, { username });
        } catch (err) {
          console.error("Check-out failed:", err);
        }

        set({
          isCheckedIn: false,
          startTime: null,
          timerInterval: null,
          isOnBreak: false,
          breakStart: null,
          breakElapsed: 0,
          elapsedTime: 0,
          breakCount: 0,
          date: new Date().toDateString(),
        });
      },

      // ✅ TIMER TICK
      resumeTimerTick: () => {
        const now = Date.now();
        let workedTime = now - get().startTime! - get().breakElapsed;

        if (get().isOnBreak && get().breakStart) {
          workedTime -= now - get().breakStart;
        }

        set({ elapsedTime: workedTime });

        // Auto checkout if date changed
        const currentDate = new Date().toDateString();
        if (get().date !== currentDate) get().checkOut();

        // Optional: Auto checkout at 12:00 AM
        const d = new Date();
        if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) {
          get().checkOut();
        }
      },

      // ✅ RESUME TIMER
      resumeTimer: () => {
        if (!get().isCheckedIn) return;
        if (get().timerInterval) clearInterval(get().timerInterval);
        const interval = setInterval(() => get().resumeTimerTick(), 1000);
        set({ timerInterval: interval });
      },

      // ✅ RESET
      reset: () => {
        if (get().timerInterval) clearInterval(get().timerInterval);
        set({
          isCheckedIn: false,
          startTime: null,
          elapsedTime: 0,
          timerInterval: null,
          isOnBreak: false,
          breakCount: 0,
          breakStart: null,
          breakElapsed: 0,
          date: new Date().toDateString(),
        });
      },
    }),
    {
      name: "attendance-storage",
      partialize: (state) => ({
        isCheckedIn: state.isCheckedIn,
        startTime: state.startTime,
        elapsedTime: state.elapsedTime,
        isOnBreak: state.isOnBreak,
        breakCount: state.breakCount,
        breakElapsed: state.breakElapsed,
        breakStart: state.breakStart,
        date: state.date,
      }),
    }
  )
);
