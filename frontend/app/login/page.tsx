"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@vonderk.com");
  const [password, setPassword] = useState("Admin1234!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations('Auth');

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo iniciar sesión");
      }

      localStorage.setItem("datalytixq_token", data.token);
      localStorage.setItem("datalytixq_user", JSON.stringify(data.user));
      
      // Store in cookie for Server Components
      document.cookie = `datalytixq_token=${data.token}; path=/; max-age=28800; SameSite=Lax`;

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="hidden w-1/2 flex-col justify-between bg-[#17384F] p-10 text-white lg:flex">
        <div>
          <h1 className="text-3xl font-bold">DQ Orbit</h1>
          <p className="mt-2 text-sm text-white/70">
            Decision Intelligence Platform
          </p>
        </div>

        <div>
          <p className="text-2xl font-semibold">
            Inteligencia operacional sobre tu ERP.
          </p>
          <p className="mt-3 max-w-md text-sm text-white/70">
            Visualiza ventas, inventario, CxC, insights y agentes IA desde una plataforma SaaS segura.
          </p>
        </div>

        <p className="text-xs text-white/50">
          © 2026 DQ Orbit
        </p>
      </section>

      <section className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            {t('login_title')}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {t('login_subtitle')}
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-lg bg-[#17384F] py-2.5 text-sm font-semibold text-white hover:bg-[#102b3e] disabled:opacity-60"
            >
              {loading ? "..." : t('enter')}
            </button>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400 space-y-1">
            <p>Acceso protegido por cliente, usuario y rol.</p>
            <p>
              <a href="/legal/terms" className="hover:underline hover:text-slate-600">Términos de Servicio</a>
              {" • "}
              <a href="/legal/privacy" className="hover:underline hover:text-slate-600">Política de Privacidad</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}