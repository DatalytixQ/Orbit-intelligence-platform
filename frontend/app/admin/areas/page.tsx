"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { fetchFromApiClient } from "@/lib/api.client";

type Area = {
  id: string;
  name: string;
  created_at: string;
  users_count: number;
};

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [areaName, setAreaName] = useState("");

  useEffect(() => {
    fetchAreas();
  }, []);

  async function fetchAreas() {
    try {
      const data = await fetchFromApiClient("/api/admin/areas");
      setAreas(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setAreaName("");
    setShowModal(true);
  }

  function openEdit(area: Area) {
    setEditingId(area.id);
    setAreaName(area.name);
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await fetchFromApiClient(`/api/admin/areas/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ name: areaName })
        });
      } else {
        await fetchFromApiClient("/api/admin/areas", {
          method: "POST",
          body: JSON.stringify({ name: areaName })
        });
      }
      setShowModal(false);
      fetchAreas();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que deseas eliminar esta Área? Se eliminará de todos los usuarios asociados.")) return;
    try {
      await fetchFromApiClient(`/api/admin/areas/${id}`, { method: "DELETE" });
      fetchAreas();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  if (loading) return <AppShell><div className="p-8">Cargando...</div></AppShell>;

  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Áreas</h1>
            <p className="text-sm text-slate-500 mt-1">Divisiones lógicas, regiones o sucursales de tu empresa.</p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            + Nueva Área
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              No hay áreas creadas.
            </div>
          ) : (
            areas.map(area => (
              <div key={area.id} className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer" onClick={() => window.location.href = `/admin/areas/${area.id}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {area.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{area.name}</h3>
                      <p className="text-sm text-slate-500">{new Date(area.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEdit(area); }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editar Área"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(area.id); }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar Área"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 py-2 px-3 rounded-lg w-fit group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                  👥 {area.users_count} usuarios registrados
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-slate-900">{editingId ? "Editar Área" : "Nueva Área"}</h2>
              <form onSubmit={handleSave}>
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nombre del Área</label>
                  <input
                    type="text"
                    required
                    value={areaName}
                    onChange={e => setAreaName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Ej. Comercial, Logística..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
