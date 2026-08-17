"use client";

import { useState } from "react";
import { fetchFromApiClient } from "@/lib/api.client";

type Alert = { level: string; title: string; message: string };

type Action = {
    domain?: string;
    priority: string;
    action: string;
    reference?: string | null;
    customer_name?: string;
};

type DomainAnalytics = {
    diagnostics: { status: string; summary: string };
    alerts: Alert[];
    drivers: { main_driver?: string };
    actions: Action[];
};

type ExecutiveAnalytics = {
    generated_at: string;
    finance: DomainAnalytics;
    sales: DomainAnalytics;
    inventory: DomainAnalytics;
    executive_summary: string[];
    next_best_actions: Action[];
};

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

const FILTERS = ["Todo", "Finanzas", "Comercial", "Inventario"];

export default function ExecutiveInsightsPanel({ data }: { data: ExecutiveAnalytics }) {
    const [filter, setFilter] = useState("Todo");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            content: "Hola, puedo ayudarte a revisar finanzas, ventas, inventario y acciones sugeridas.",
        },
    ]);

    const actions =
        filter === "Todo"
            ? data.next_best_actions
            : data.next_best_actions.filter((a) => a.domain === filter);

    async function handleSend() {
        const cleanQuestion = question.trim();
        if (!cleanQuestion || loading) return;

        setQuestion("");
        setLoading(true);

        setMessages((prev) => [
            ...prev,
            { role: "user", content: cleanQuestion },
        ]);

        try {
            const response = await fetchFromApiClient("/api/ai/chat-v2", {
                method: "POST",
                body: JSON.stringify({ question: cleanQuestion }),
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: response.answer || "No pude generar una respuesta.",
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "No pude conectar con el asistente. Verifica que el backend esté activo.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="mt-3 grid grid-cols-12 gap-3">
            <div className="col-span-8 rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-[15px] font-bold text-foreground">Panel ejecutivo</h2>

                    <div className="flex gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                    <InsightCard title="Finanzas" value={data.finance.diagnostics.status} text={data.finance.diagnostics.summary} />
                    <InsightCard title="Comercial" value={data.sales.diagnostics.status} text={data.sales.diagnostics.summary} />
                    <InsightCard title="Inventario" value={data.inventory.diagnostics.status} text={data.inventory.diagnostics.summary} />
                </div>

                <div className="mt-4 rounded-xl border border-border bg-muted p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Resumen ejecutivo
                    </p>
                    <div className="mt-2 space-y-1">
                        {data.executive_summary.map((item, index) => (
                            <p key={index} className="text-[11px] text-muted-foreground">• {item}</p>
                        ))}
                    </div>
                </div>

                <div className="mt-4 max-h-[300px] overflow-auto rounded-xl border border-border">
                    <table className="w-full text-[11px]">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2 text-left">Área</th>
                                <th className="px-3 py-2 text-left">Prioridad</th>
                                <th className="px-3 py-2 text-left">Referencia</th>
                                <th className="px-3 py-2 text-left">Acción sugerida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actions.map((a, index) => (
                                <tr key={index} className="border-t border-border">
                                    <td className="px-3 py-3 font-semibold text-foreground">{a.domain || "-"}</td>
                                    <td className="px-3 py-3 font-bold text-red-700">{a.priority}</td>
                                    <td className="px-3 py-3 text-muted-foreground">{a.reference || a.customer_name || "-"}</td>
                                    <td className="px-3 py-3 text-muted-foreground">{a.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <aside className="col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">Asistente IA</p>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                        Activo
                    </span>
                </div>

                <div className="mt-4 max-h-[360px] space-y-3 overflow-auto">
                    {messages.map((m, index) => (
                        <div
                            key={index}
                            className={`rounded-xl px-3 py-2 text-[11px] ${m.role === "user"
                                    ? "ml-8 bg-primary text-primary-foreground"
                                    : "mr-8 bg-muted text-muted-foreground"
                                }`}
                        >
                            {m.content}
                        </div>
                    ))}

                    {loading && (
                        <div className="mr-8 rounded-xl bg-muted px-3 py-2 text-[11px] text-muted-foreground">
                            Analizando datos...
                        </div>
                    )}
                </div>

                <div className="mt-4 flex gap-2">
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                        placeholder="Pregúntale al asistente..."
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[11px] text-foreground"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground disabled:opacity-50"
                    >
                        Enviar
                    </button>
                </div>
            </aside>
        </section>
    );
}

function InsightCard({ title, value, text }: { title: string; value: string; text: string }) {
    return (
        <div className="rounded-xl border border-border bg-muted p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
            <p className="mt-2 text-sm font-bold text-foreground">{value}</p>
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{text}</p>
        </div>
    );
}