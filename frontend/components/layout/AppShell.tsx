"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import AssistantPanel from "./AssistantPanel";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("datalytixq_token");

    if (!token) {
      document.cookie = "datalytixq_token=; path=/; max-age=0";
      window.location.href = "/login";
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Validando sesión...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 h-screen shrink-0 overflow-y-auto">
        <Sidebar />
      </aside>

      <section className="min-w-0 flex-1 overflow-auto">
        {children}
      </section>

      <AssistantPanel />
    </main>
  );
}