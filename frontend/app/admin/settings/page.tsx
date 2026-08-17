"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { fetchFromApiClient } from "@/lib/api.client";

type Policy = {
  category: string;
  policy_key: string;
  policy_value: string;
  description: string;
};

export default function SettingsPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("localization");

  const tabs = [
    { id: "localization", label: "Localización y Moneda" },
    { id: "finance", label: "Finanzas & Riesgo" },
    { id: "inventory", label: "Inventarios" },
    { id: "supply", label: "Abastecimiento" },
    { id: "sales", label: "Comercial & Metas" },
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchFromApiClient("/api/settings");
        if (res.ok) {
          setPolicies(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (category: string, key: string, value: string) => {
    setPolicies(policies.map(p => 
      p.category === category && p.policy_key === key ? { ...p, policy_value: value } : p
    ));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetchFromApiClient("/api/settings", {
        method: "PUT",
        body: JSON.stringify({ policies })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppShell><div className="p-8">Cargando configuraciones...</div></AppShell>;

  const filteredPolicies = policies.filter(p => p.category === activeTab);

  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configuración del Negocio</h1>
            <p className="text-sm text-slate-500 mt-1">Administra los parámetros base, reglas de riesgo y metas globales.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
            {saved && <span className="text-white ml-2">✓</span>}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex min-h-[500px]">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-slate-200 bg-slate-50 p-4">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>

            <div className="space-y-6">
              {filteredPolicies.length === 0 ? (
                <p className="text-slate-500 text-sm">No hay configuraciones para esta categoría.</p>
              ) : (
                filteredPolicies.map(policy => (
                  <div key={policy.policy_key} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">
                      {policy.description || policy.policy_key}
                      <span className="ml-2 text-xs text-slate-400 font-mono">({policy.policy_key})</span>
                    </label>
                    <input
                      type="text"
                      className="border border-slate-300 rounded-lg px-4 py-2 w-full max-w-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                      value={policy.policy_value}
                      onChange={(e) => handleChange(policy.category, policy.policy_key, e.target.value)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
