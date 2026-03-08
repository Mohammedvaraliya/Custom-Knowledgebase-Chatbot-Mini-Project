import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeExternalLinks from "rehype-external-links";
import { Sparkles } from "lucide-react";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`group flex ${isUser ? "justify-end" : "justify-start"} w-full`}
    >
      <div
        className={`flex items-end gap-2 sm:gap-3 max-w-[92%] sm:max-w-[80%] md:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        {isUser ? (
          <div className="shrink-0 mb-0.5 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shadow-sm">
            <User size={14} className="text-slate-600 dark:text-slate-300" />
          </div>
        ) : (
          <div className="shrink-0 mb-0.5 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
            <Sparkles size={13} className="text-white" />
          </div>
        )}

        {/* Bubble */}
        <div className="relative">
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-shadow duration-200 ${
              isUser
                ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm shadow-violet-500/20"
                : "bg-white dark:bg-[#1A1A22] text-slate-800 dark:text-slate-100 border border-black/[0.06] dark:border-white/[0.06] rounded-bl-sm"
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{content}</p>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-p:leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline prose-code:text-violet-600 dark:prose-code:text-violet-400 prose-code:bg-violet-50 dark:prose-code:bg-violet-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-mono prose-pre:bg-[#111827] prose-pre:shadow-xl prose-pre:rounded-xl prose-ul:my-1.5 prose-li:my-0.5 prose-strong:font-semibold prose-strong:text-slate-800 dark:prose-strong:text-slate-100">
                <ReactMarkdown
                  rehypePlugins={[
                    rehypeHighlight,
                    [
                      rehypeExternalLinks,
                      { target: "_blank", rel: ["noopener", "noreferrer"] },
                    ],
                  ]}
                  components={{
                    pre: ({ node, ...props }) => (
                      <pre
                        className="my-2 rounded-xl overflow-auto text-sm"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, className, children, ...props }) =>
                      inline ? (
                        <code {...props}>{children}</code>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      ),
                    a: ({ node, ...props }) => <a {...props} />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Copy button — assistant only */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-150 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-[#1A1A22] border border-black/[0.08] dark:border-white/[0.08] text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-sm hover:shadow-md"
            >
              {copied ? (
                <Check size={10} className="text-emerald-500" />
              ) : (
                <Copy size={10} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
