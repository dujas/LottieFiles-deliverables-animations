import { useEffect } from "react";
import useThemeStore from "@/store/themeStore";
import Icon from "@/shared/view/icon";

const ThemeSwitcher = () => {
  const toggleTheme = useThemeStore((x) => x.toggleTheme);
  const initTheme = useThemeStore((x) => x.initTheme);
  const mode = useThemeStore((x) => x.mode);

  useEffect(() => {
    initTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center gap-4">
      <div
        onClick={() => toggleTheme()}
        className={`cursor-pointer ${"dark" === mode ? "text-slate-400" : ""}`}
      >
        {mode === "dark" ? <Icon name="sun" /> : <Icon name="moon" />}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
