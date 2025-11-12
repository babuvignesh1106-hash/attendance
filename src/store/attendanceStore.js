import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export const useAttendanceStore = create(
  persist(
    (set, get) => ({
      // ✅ STATE
      isCheckedIn: false,
      startTime: null,
      elapsedTime: 0,
      timerInterval: null,
      isOnBreak: false,
      breakCount: 0,
      breakStart: null,
      breakElapsed: 0,
      date: new Date().toDateString(), // store current date

      // ✅ CHECK-IN
      checkIn: () => {
        if (get().isCheckedIn) return;

        const now = Date.now();

        // 🕒 Start real-time timer
        const interval = setInterval(() => {
          const nowTime = Date.now();
          let workedTime = nowTime - get().startTime - get().breakElapsed;

          if (get().isOnBreak && get().breakStart) {
            const breakTime = nowTime - get().breakStart;
            workedTime -= breakTime;
          }

          set({ elapsedTime: workedTime });

          // 🔹 Detect date change (crossed midnight)
          const storedDate = new Date(get().date);
          const currentDate = new Date();
          const isDateChanged =
            storedDate.getDate() !== currentDate.getDate() ||
            storedDate.getMonth() !== currentDate.getMonth() ||
            storedDate.getFullYear() !== currentDate.getFullYear();

          if (isDateChanged) {
            console.log("🕛 Date changed → Auto check-out triggered!");
            get().autoCheckOutOnDateChange();
          }
        }, 1000);

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
      },

      // ✅ CHECK-OUT
      checkOut: async () => {
        const {
          startTime,
          elapsedTime,
          breakCount,
          breakElapsed,
          isCheckedIn,
          timerInterval,
        } = get();

        if (!isCheckedIn) return;

        if (timerInterval) clearInterval(timerInterval);

        try {
          const username = localStorage.getItem("name") || "unknown";
          const data = {
            startTime: new Date(startTime).toISOString(),
            endTime: new Date().toISOString(),
            workedDuration: Math.floor(elapsedTime / 1000), // in seconds
            breakCount,
            totalBreakDuration: Math.floor(breakElapsed / 1000),
            username,
          };

          await axios.post(
            "https://attendance-backend-bqhw.vercel.app/attendance",
            data
          );

          console.log("✅ Auto checkout completed and data saved!");
        } catch (error) {
          console.error("❌ Attendance check-out failed:", error);
        }

        // 🧹 Reset after checkout
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

      // ✅ AUTO CHECKOUT on date change
      autoCheckOutOnDateChange: async () => {
        const { timerInterval } = get();
        if (timerInterval) clearInterval(timerInterval); // stop running timer
        await get().checkOut();
      },

      // ✅ TOGGLE BREAK
      toggleBreak: () => {
        if (!get().isCheckedIn) return;

        if (get().isOnBreak) {
          const now = Date.now();
          const breakDuration = now - get().breakStart;
          set({
            isOnBreak: false,
            breakElapsed: get().breakElapsed + breakDuration,
            breakStart: null,
          });
        } else {
          set({
            isOnBreak: true,
            breakCount: get().breakCount + 1,
            breakStart: Date.now(),
          });
        }
      },

      // ✅ RESET ATTENDANCE
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

      // ✅ RESUME TIMER (AFTER PAGE REFRESH)
      resumeTimer: () => {
        if (!get().isCheckedIn || get().timerInterval) return; // prevent duplicate intervals

        const interval = setInterval(() => {
          const now = Date.now();
          let workedTime = now - get().startTime - get().breakElapsed;

          if (get().isOnBreak && get().breakStart) {
            const breakTime = now - get().breakStart;
            workedTime -= breakTime;
          }

          set({ elapsedTime: workedTime });

          // 🔹 Check for date change
          const storedDate = new Date(get().date);
          const currentDate = new Date();
          const isDateChanged =
            storedDate.getDate() !== currentDate.getDate() ||
            storedDate.getMonth() !== currentDate.getMonth() ||
            storedDate.getFullYear() !== currentDate.getFullYear();

          if (isDateChanged) {
            console.log("🕛 Date changed → Auto check-out triggered!");
            get().autoCheckOutOnDateChange();
          }
        }, 1000);

        set({ timerInterval: interval });
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

// 🧼 Optional cleanup when tab closes (stops interval safely)
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    const { timerInterval } = useAttendanceStore.getState();
    if (timerInterval) clearInterval(timerInterval);
  });
}
