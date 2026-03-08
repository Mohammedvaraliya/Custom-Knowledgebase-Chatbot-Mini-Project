import { useEffect, useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow.jsx";
import ThemeToggle from "@/components/chat/ThemeToggle.jsx";
import { Bot, Sparkles } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <div className="min-h-dvh flex flex-col bg-[#F7F6F3] dark:bg-[#0D0D0F] text-[#1A1A2E] dark:text-[#EAEAF0] transition-colors duration-500">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-300/30 via-indigo-200/20 to-transparent dark:from-violet-900/30 dark:via-indigo-900/20 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-sky-200/30 via-blue-100/20 to-transparent dark:from-sky-900/20 dark:via-blue-900/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-rose-200/20 via-pink-100/10 to-transparent dark:from-rose-900/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/[0.06] dark:border-white/[0.06] bg-[#F7F6F3]/80 dark:bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Bot size={20} className="text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold leading-tight tracking-tight truncate">
                KJSIM AI
              </h1>
              <p className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Sparkles size={10} className="text-violet-400" />
                Knowledge-powered assistant
              </p>
            </div>
          </div>

          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-2 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col">
        <ChatWindow />
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-[11px] text-slate-400 dark:text-slate-600 border-t border-black/[0.04] dark:border-white/[0.04]">
        Responses generated from KJSIM's knowledge base &nbsp;·&nbsp; Not saved
        between sessions
      </footer>
    </div>
  );
}
