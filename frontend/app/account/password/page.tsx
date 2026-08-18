"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { fetchFromApiClient } from "@/lib/api.client";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleChangePassword() {
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    setLoading(true);

    try {
      const data = await fetchFromApiClient("/api/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (data && data.ok === false) {
        throw new Error(data.error || "No se pudo actualizar la contraseña");
      }

      setMessage("Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-4 py-6">
        <h1 className="text-xl font-bold text-slate-900">
          Cambiar contraseña
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Actualiza tu contraseña de acceso a Datalytix Quest.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">
                Contraseña actual
              </label>
              <p className="text-[10px] text-slate-400 mb-1">
                Requerido por seguridad para verificar tu identidad antes de realizar el cambio.
              </p>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleChangePassword();
                }}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full rounded-lg bg-[#17384F] py-2.5 text-sm font-semibold text-white hover:bg-[#102b3e] disabled:opacity-60"
            >
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}