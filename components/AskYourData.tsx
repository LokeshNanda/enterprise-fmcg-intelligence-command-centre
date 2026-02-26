"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserOpenAIKey, setUserOpenAIKey } from "@/lib/openaiKey";
import type { DashboardData } from "@/lib/types";

interface AskYourDataProps {
  data: DashboardData | null;
}

export function AskYourData({ data }: AskYourDataProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasStoredKey(!!getUserOpenAIKey());
  }, [isOpen, showKeyInput]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuestion("");
      setAnswer(null);
      setError(null);
      setShowKeyInput(false);
    }
  }, [isOpen]);

  const handleSaveKey = () => {
    setUserOpenAIKey(apiKeyInput.trim() || null);
    setApiKeyInput("");
    setShowKeyInput(false);
    setHasStoredKey(!!apiKeyInput.trim());
    window.dispatchEvent(new Event("openai-key-changed"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setAnswer(null);
    setError(null);

    const userKey = getUserOpenAIKey();

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          data: data ?? undefined,
          openaiApiKey: userKey ?? undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong");
        return;
      }

      setAnswer(json.answer ?? "No answer received.");
    } catch (err) {
      setError("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] lg:bottom-6 lg:right-6 z-50 w-14 h-14 min-w-[44px] min-h-[44px] rounded-full bg-accent/90 text-[#0A0F1C] shadow-lg shadow-accent/30 flex items-center justify-center hover:bg-accent transition-colors touch-manipulation"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Ask your data"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 bottom-4 z-[70] w-[calc(100%-2rem)] max-h-[85vh] lg:inset-auto lg:bottom-6 lg:right-6 lg:w-full lg:max-w-md lg:max-h-none rounded-2xl bg-[#0A0F1C] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Ask Your Data
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                    title={hasStoredKey ? "Change API key" : "Add your OpenAI API key"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15 14m4 0 4 4v-4m0 4h4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4 max-h-64 overflow-y-auto">
                {showKeyInput && (
                  <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                    <label className="text-xs text-gray-500 block mb-2">OpenAI API Key (optional)</label>
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/50"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveKey}
                        className="px-3 py-1.5 rounded-lg text-xs bg-accent/20 text-accent hover:bg-accent/30"
                      >
                        Save
                      </button>
                      {hasStoredKey && (
                        <button
                          onClick={() => { setUserOpenAIKey(null); setApiKeyInput(""); setHasStoredKey(false); window.dispatchEvent(new Event("openai-key-changed")); }}
                          className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-400"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mb-3">
                  Ask questions about your dashboard data in natural language.
                  {!hasStoredKey && " Add your OpenAI API key (key icon above) or set OPENAI_API_KEY in .env."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. Which state has the highest risk?"
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                  />
                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="w-full py-2.5 rounded-xl bg-accent/20 text-accent font-medium hover:bg-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Thinking..." : "Ask"}
                  </button>
                </form>

                <AnimatePresence>
                  {answer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20"
                    >
                      <div className="text-sm text-gray-200 whitespace-pre-wrap">
                        {answer}
                      </div>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
