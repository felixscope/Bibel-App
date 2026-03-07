"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface BibleChatProps {
  bookName: string;
  chapterNumber: number;
  selectedVerses: { verse: number; text: string }[];
  translationName?: string;
  externalOpen?: boolean;
  onExternalOpenHandled?: () => void;
}

function FormattedText({ text }: { text: string }) {
  // Parse **bold** and *italic* inline markdown
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function BibleChat({
  bookName,
  chapterNumber,
  selectedVerses,
  translationName,
  externalOpen,
  onExternalOpenHandled,
}: BibleChatProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // External open trigger (from VerseActionBar)
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
      onExternalOpenHandled?.();
    }
  }, [externalOpen, onExternalOpenHandled]);

  // AutoFocus textarea when panel opens (desktop only — on mobile the keyboard would cover suggested prompts)
  useEffect(() => {
    if (isOpen && window.matchMedia("(min-width: 768px)").matches) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Click-outside to close (exclude FAB to avoid race condition)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        fabRef.current && !fabRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Context label
  const contextLabel =
    selectedVerses.length > 0
      ? `${bookName} ${chapterNumber}:${selectedVerses[0].verse}${selectedVerses.length > 1 ? `–${selectedVerses[selectedVerses.length - 1].verse}` : ""}`
      : `${bookName} ${chapterNumber}`;

  const handleSend = useCallback(async (overrideText?: string) => {
    const text = overrideText || input.trim();
    if (!text || isStreaming) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            bookName,
            chapter: chapterNumber,
            translationName,
            selectedVerses:
              selectedVerses.length > 0 ? selectedVerses : undefined,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "API error");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + chunk },
          ];
        });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content:
            error instanceof Error && error.message !== "API error"
              ? error.message
              : "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, bookName, chapterNumber, selectedVerses]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  if (!mounted) return null;

  const fab = (
    <motion.button
      ref={fabRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => setIsOpen(!isOpen)}
      className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-4 md:bottom-8 md:right-8 z-[9998] w-12 h-12 rounded-full bg-[var(--accent)] text-white shadow-lg hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center"
      aria-label={isOpen ? "Chat schließen" : "KI-Begleiter öffnen"}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.svg
            key="close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.15 }}
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="chat"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.15 }}
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );

  const panel = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed z-[9999] flex flex-col bg-[var(--bg-elevated)] border border-[var(--border)] shadow-xl rounded-2xl overflow-hidden
            inset-x-4 bottom-20 h-[70dvh] max-h-[600px]
            md:inset-x-auto md:right-24 md:bottom-8 md:w-96"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
            <div className="min-w-0">
              <h2 className="chapter-title text-lg text-[var(--text-primary)] truncate">
                Bibelstudium-Begleiter
              </h2>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {contextLabel}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  onClick={handleNewChat}
                  className="px-2 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Neu
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              >
                <svg
                  className="w-4 h-4 text-[var(--text-secondary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
                <p className="text-sm text-[var(--text-muted)] text-center">
                  Was möchtest du wissen?
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {(selectedVerses.length > 0
                    ? [
                        "Erkläre die markierten Verse",
                        "Historischer Hintergrund",
                        "Was bedeutet das für mein Leben?",
                      ]
                    : [
                        "Worum geht es in diesem Kapitel?",
                        "Historischer Hintergrund",
                        "Was kann ich daraus lernen?",
                      ]
                  ).map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      disabled={isStreaming}
                      className="px-3 py-1.5 rounded-full text-xs border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-40"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[var(--accent)] text-white rounded-2xl rounded-br-sm"
                      : "bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-2xl rounded-bl-sm"
                  }`}
                >
                  {msg.content ? (
                    <FormattedText text={msg.content} />
                  ) : (
                    <span className="inline-block w-2 h-4 bg-[var(--text-muted)] animate-pulse rounded-sm" />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[var(--border)] shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Frage stellen..."
                rows={1}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                disabled={isStreaming}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                className="p-2 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Senden"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {createPortal(fab, document.body)}
      {createPortal(panel, document.body)}
    </>
  );
}
