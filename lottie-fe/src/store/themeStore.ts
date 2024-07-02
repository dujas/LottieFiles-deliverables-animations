import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type ThemeMode = "dark" | "light";
type ThemeStoreType = {
  mode: ThemeMode;
  toggleTheme: () => void;
  initTheme: () => ThemeMode;
  updateSelector: (mode: ThemeMode) => void;
};

const useThemeStore = create<ThemeStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        mode: "light",
        toggleTheme: () => {
          const { mode, updateSelector } = get();
          const nextMode = "dark" === mode ? "light" : "dark";
          set({ mode: nextMode });
          updateSelector(nextMode);
        },
        initTheme: () => {
          const { mode, updateSelector } = get();
          updateSelector(mode);
          return mode;
        },
        updateSelector: (mode: ThemeMode) => {
          if ("dark" === mode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        },
      }),
      {
        name: "theme",
        version: 1,
      },
    ),
  ),
);

export default useThemeStore;
