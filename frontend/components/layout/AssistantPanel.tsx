"use client";

import { useState, useEffect } from "react";
import { askDQBot } from "@/services/aiService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  suggestedQuestions?: string[];
};

export default function AssistantPanel() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hola, soy DQBot, tu super analista Datalytix Quest.",
    },
  ]);

  async function handleAsk() {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) return;

    setQuestion("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: cleanQuestion },
    ]);

    try {
      const data = await askDQBot(cleanQuestion);

      const isContextQuery = cleanQuestion.toLowerCase().startsWith("explorar") || cleanQuestion.toLowerCase().startsWith("analizar");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "No pude generar una respuesta.",
          suggestedQuestions: isContextQuery ? [] : (data.suggestedQuestions || []),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "No pude conectar con DQBot. Verifica que el backend esté activo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestedClick(suggestion: string) {
    setQuestion(suggestion);
    setTimeout(() => {
      document.getElementById("dqbot-ask-button")?.click();
    }, 100);
  }

  useEffect(() => {
    const handleOpenBot = (e: CustomEvent) => {
      setIsOpen(true);
      if (e.detail?.context) {
        const contexts = Array.isArray(e.detail.context) ? e.detail.context : [e.detail.context];
        const newSuggestions = contexts.map((c: any) => {
            // If context has a specific titulo, use it directly as the query
            if (c.titulo) return `Explorar: ${c.titulo}`;
            // Fallback by rule_id
            if (c.rule_id === "I001") return `Analizar quiebre inminente de stock`;
            if (c.rule_id === "I003") return `Analizar capital inmovilizado en inventario`;
            if (c.rule_id === "V001") return `Analizar cumplimiento comercial por vendedor`;
            if (c.rule_id === "V002") return `Analizar desviación de forecast comercial`;
            if (c.rule_id === "C001") return `Analizar riesgo de mora en cuentas por cobrar`;
            if (c.rule_id === "E002") return `Analizar riesgo por cliente deudor en supply`;
            if (c.rule_id === "S001") return `Analizar cronograma de embarques críticos`;
            // Fallback by domain
            if (c.domain === "Inventario") return `Analizar riesgo de quiebre de stock`;
            if (c.domain === "Ventas") return `Analizar desviación comercial`;
            if (c.domain === "Finanzas") return `Analizar riesgo de mora`;
            if (c.domain === "Abastecimiento") return `Analizar riesgo de desabastecimiento`;
            return `Explorar alerta ${c.rule_id}`;
        });
        
        setMessages(prev => {
            const last = prev[prev.length - 1];
            // If the last message is just the greeting and has no suggestions, we can replace it or just append.
            // But to avoid appending to a previous answer, ALWAYS push a new message if the last message is an answer.
            // A simple way is to check if prev length is 1 (only greeting).
            if (prev.length === 1 && last && last.role === 'assistant') {
                return [
                    {
                        ...last,
                        suggestedQuestions: Array.from(new Set([...(last.suggestedQuestions || []), ...newSuggestions]))
                    }
                ];
            }
            return [
                ...prev,
                { role: 'assistant', content: '¿Qué te gustaría revisar?', suggestedQuestions: newSuggestions }
            ];
        });
      }
    };
    window.addEventListener("open-dqbot", handleOpenBot as EventListener);
    
    // Auto-fetch initial state to get first suggestions if opened for the first time
    const fetchInitial = async () => {
        try {
            const data = await askDQBot("");
            // If the user already opened it via a trigger, we don't want to show the generic fallback suggestions
            if (data && data.suggestedQuestions) {
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    const existingSuggestions = last?.suggestedQuestions || [];
                    // Only add the backend suggestions if there are no context suggestions injected
                    const finalSuggestions = existingSuggestions.length > 0 ? existingSuggestions : data.suggestedQuestions;
                    return [
                        {
                            role: "assistant",
                            content: data.answer || "Hola, soy DQBot, tu super analista Datalytix Quest.",
                            suggestedQuestions: Array.from(new Set(finalSuggestions))
                        }
                    ];
                });
            }
        } catch(e) {}
    };
    fetchInitial();

    return () => {
      window.removeEventListener("open-dqbot", handleOpenBot as EventListener);
    };
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Popover */}
      {isOpen && (
        <aside className="fixed bottom-24 right-6 z-50 flex h-[650px] w-[550px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="border-b border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                <p className="text-sm font-bold text-card-foreground">DQBot</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Super analista Datalytix Quest.
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-auto p-4">
            {messages.map((message, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <div
                  className={`rounded-xl px-3 py-2 text-xs leading-relaxed overflow-hidden max-w-[480px] ${
                    message.role === "user"
                      ? "ml-8 bg-primary text-primary-foreground rounded-tr-sm self-end"
                      : "mr-8 bg-muted text-foreground rounded-tl-sm self-start"
                  }`}
                >
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      table: ({ node, ...props }) => (
                        <div className="w-full overflow-x-auto my-2 rounded border border-slate-200">
                          <table className="w-full text-left border-collapse" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => <th className="border-b border-slate-200 bg-slate-100 px-2 py-1.5 font-semibold text-slate-700 whitespace-nowrap" {...props} />,
                      td: ({ node, ...props }) => <td className="border-b border-slate-100 px-2 py-1.5 whitespace-nowrap" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold" {...props} />
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                {message.role === "assistant" && index === messages.length - 1 && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mr-8">
                    {message.suggestedQuestions.map((sq, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSuggestedClick(sq)}
                            className="bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors px-3 py-1.5 rounded-full text-[10px] font-medium text-left"
                        >
                            {sq}
                        </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="mr-8 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground rounded-tl-sm animate-pulse">
                Analizando datos...
              </div>
            )}
          </div>

          <div className="border-t border-border bg-muted/10 p-4">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAsk();
              }}
              placeholder="Pregunta sobre tu negocio..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <button
              id="dqbot-ask-button"
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Consultando..." : "Preguntar"}
            </button>
          </div>
        </aside>
      )}
    </>
  );
}