import { useMemo, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";
import {
  Loader2,
  Send,
  UserCircle,
  GraduationCap,
  BookOpen,
  FlaskConical,
  MapPin,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLES = ["all", "student", "faculty", "staff", "guest"];

const ROLE_ICONS = {
  all: UserCircle,
  student: GraduationCap,
  faculty: BookOpen,
  staff: FlaskConical,
  guest: MapPin,
};

const ROLE_COLORS = {
  all: "from-violet-500 to-indigo-500",
  student: "from-blue-500 to-cyan-500",
  faculty: "from-emerald-500 to-teal-500",
  staff: "from-orange-500 to-amber-500",
  guest: "from-pink-500 to-rose-500",
};

const SUGGESTED_QUESTIONS = [
  {
    icon: "🎓",
    label: "Scholarships & Financial Aid",
    sub: "Explore funding options",
    q: "Scholarships & Financial Aid Overview",
  },
  {
    icon: "📅",
    label: "Academic Calendar",
    sub: "Key dates & deadlines",
    q: "Academic Calendar Highlights",
  },
  {
    icon: "🔬",
    label: "Faculty Research Support",
    sub: "Grants & resources",
    q: "Faculty Research Support",
  },
  {
    icon: "🗺️",
    label: "Campus Tours & Visitor Info",
    sub: "Plan your visit",
    q: "Campus Tours & Visitor Info",
  },
];

export default function ChatWindow() {
  const [role, setRole] = useState("all");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your KJSIM AI Assistant. Ask me about admissions, library hours, parking, student services, and more.",
    },
  ]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  const RoleIcon = ROLE_ICONS[role] || UserCircle;

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend(e);
    }
  }

  async function onSend(e, preset = null) {
    e?.preventDefault();
    if (!canSend && !preset) return;

    const content = preset || input.trim();
    const userMsg = { id: crypto.randomUUID(), role: "user", content };

    const pending = [
      ...messages,
      userMsg,
      { id: `thinking-${Date.now()}`, role: "assistant", content: "Thinking…" },
    ];
    setMessages(pending);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], role }),
      });
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      const answerText = data.answer || "I could not generate a response.";
      const sources = Array.isArray(data.sources) ? data.sources : [];
      const sourceText =
        sources.length > 0
          ? "\n\n**Sources:**\n" +
            sources.map((s, i) => `${i + 1}. ${s.title}`).join("\n")
          : "";

      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answerText + sourceText,
        },
      ]);

      queueMicrotask(() => {
        listRef.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const isFirstLoad = messages.length === 1;

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-140px)] sm:h-[calc(100dvh-160px)]">
      {/* Card shell */}
      <div className="flex-1 flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border border-black/[0.07] dark:border-white/[0.07] bg-white/70 dark:bg-[#111114]/70 backdrop-blur-xl shadow-2xl shadow-black/[0.08] dark:shadow-black/40">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/60 dark:bg-[#111114]/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-violet-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
              Chat Assistant
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>

          {/* Role selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group inline-flex items-center gap-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.05] px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md">
                <div
                  className={`h-5 w-5 rounded-md bg-gradient-to-br ${ROLE_COLORS[role]} flex items-center justify-center`}
                >
                  <RoleIcon size={11} className="text-white" />
                </div>
                <span className="hidden sm:block capitalize">{role}</span>
                <ChevronDown
                  size={12}
                  className="opacity-50 group-hover:opacity-80 transition-opacity"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 rounded-xl border border-black/[0.08] dark:border-white/[0.08] shadow-xl shadow-black/10 dark:shadow-black/30 bg-white dark:bg-[#1A1A22] p-1">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 pb-1">
                View as
              </DropdownMenuLabel>
              {ROLES.map((r) => {
                const Icon = ROLE_ICONS[r] || UserCircle;
                return (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => setRole(r)}
                    className="flex items-center gap-2 rounded-lg cursor-pointer text-sm font-medium px-2 py-1.5"
                  >
                    <div
                      className={`h-6 w-6 rounded-md bg-gradient-to-br ${ROLE_COLORS[r]} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={13} className="text-white" />
                    </div>
                    <span className="capitalize">{r}</span>
                    {r === role && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto px-3 sm:px-5 md:px-8 py-5 sm:py-8 space-y-5 scroll-smooth"
          ref={listRef}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(120,120,140,0.2) transparent",
          }}
        >
          {isFirstLoad ? (
            <WelcomeScreen onSend={onSend} />
          ) : (
            <>
              {messages.map((m, i) => (
                <div
                  key={m.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${i * 30}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <MessageBubble role={m.role} content={m.content} />
                </div>
              ))}
              {loading && <TypingIndicator />}
            </>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-black/[0.06] dark:border-white/[0.06] p-3 sm:p-4 bg-white/60 dark:bg-[#111114]/60 backdrop-blur-md">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 140) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about the institution…"
                rows={1}
                className="w-full resize-none rounded-xl sm:rounded-2xl border border-black/[0.09] dark:border-white/[0.09] bg-white dark:bg-[#1A1A22] px-4 py-3 pr-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500/30 dark:focus:ring-violet-400/30 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 max-h-[140px] overflow-y-auto"
                style={{ minHeight: "48px" }}
              />
            </div>
            <button
              onClick={(e) => onSend(e)}
              disabled={!canSend}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white px-4 sm:px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
              style={{ height: "48px" }}
            >
              <Send size={16} />
              <span className="hidden sm:block">Send</span>
            </button>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-600 text-center">
            Press{" "}
            <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
              Enter
            </kbd>{" "}
            to send ·{" "}
            <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
              Shift+Enter
            </kbd>{" "}
            for new line
          </p>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onSend }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 sm:gap-8 px-2 py-8">
      {/* Hero icon */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <Sparkles size={28} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 blur-xl opacity-30 -z-10 scale-110" />
        </div>
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            How can I help you?
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose a topic or type your own question
          </p>
        </div>
      </div>

      {/* Suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {SUGGESTED_QUESTIONS.map(({ icon, label, sub, q }) => (
          <button
            key={q}
            onClick={(e) => onSend(e, q)}
            className="group relative flex items-center gap-4 rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.04] hover:bg-violet-50/80 dark:hover:bg-violet-900/20 px-5 py-4 text-left transition-all duration-200 hover:border-violet-300/60 dark:hover:border-violet-700/60 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          >
            <span className="text-2xl shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                {label}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {sub}
              </p>
            </div>
            <span className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-violet-500">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
        <Sparkles size={14} />
      </div>
      <div className="rounded-2xl px-4 py-3 bg-white dark:bg-[#1A1A22] border border-black/[0.06] dark:border-white/[0.06] shadow-sm inline-flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-violet-400 dark:bg-violet-500 animate-bounce"
            style={{
              animationDelay: `${i * 150}ms`,
              animationDuration: "900ms",
            }}
          />
        ))}
      </div>
    </div>
  );
}
