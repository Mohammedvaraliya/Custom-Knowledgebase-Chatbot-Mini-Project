import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative inline-flex items-center gap-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <span
        className={`transition-transform duration-300 ${
          isDark ? "rotate-0 text-amber-400" : "-rotate-12 text-slate-500"
        }`}
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </span>
      <span className="hidden sm:block">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
