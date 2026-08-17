"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { fetchFromApiClient } from "@/lib/api.client";

type Role = {
  id: string;
  name: string;
  is_admin: boolean;
  permissions: string[];
  created_at: string;
};

const availablePages = [
  { id: "home", label: "Home" },
  { id: "sales", label: "Ventas" },
  { id: "inventory", label: "Inventario" },
  { id: "supply", label: "Abastecimiento" },
  { id: "finance", label: "CxC" },
  { id: "dso", label: "DSO Analytics" },
  { id: "insights", label: "Insights" },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      const data = await fetchFromApiClient("/api/admin/roles");
      // Prevent undefined or string permissions breaking the frontend
      setRoles(data.data.map((r: any) => ({
        ...r,
        permissions: typeof r.permissions === 'string' ? JSON.parse(r.permissions) : (r.permissions || [])
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setRoleName("");
    setIsAdmin(false);
    setPermissions([]);
    setShowModal(true);
  }

  function openEdit(role: Role) {
    setEditingId(role.id);
    setRoleName(role.name);
    setIsAdmin(role.is_admin);
    setPermissions(role.permissions);
    setShowModal(true);
  }

  function togglePermission(perm: string) {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = { name: roleName, is_admin: isAdmin, permissions };
      if (editingId) {
        await fetchFromApiClient(`/api/admin/roles/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await fetchFromApiClient("/api/admin/roles", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      setShowModal(false);
      fetchRoles();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que deseas eliminar este Rol? Los usuarios que tengan este rol perderán acceso si no les reasignas otro.")) return;
    try {
      await fetchFromApiClient(`/api/admin/roles/${id}`, { method: "DELETE" });
      fetchRoles();
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Roles Globales</h1>
            <p className="text-sm text-slate-500 mt-1">Configura los permisos de acceso a los módulos de la plataforma.</p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            + Nuevo Rol
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-800">Nombre del Rol</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Tipo</th>
                <th className="px-6 py-4 font-semibold text-slate-800">Permisos</th>
                <th className="px-6 py-4 font-semibold text-slate-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No hay roles creados.
                  </td>
                </tr>
              ) : (
                roles.map(role => (
                  <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{role.name}</td>
                    <td className="px-6 py-4">
                      {role.is_admin ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                          Administrador Total
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                          Usuario Restringido
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {role.is_admin ? "Todos" : (role.permissions?.join(", ") || "Ninguno")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(role)} className="text-indigo-600 hover:text-indigo-800 font-medium mr-4">Editar</button>
                      <button onClick={() => handleDelete(role.id)} className="text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-slate-900">{editingId ? "Editar Rol" : "Nuevo Rol"}</h2>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nombre del Rol</label>
                  <input
                    type="text"
                    required
                    value={roleName}
                    onChange={e => setRoleName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Ej. Comercial, Analista..."
                  />
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">¿Es Administrador Total?</span>
                  </label>
                  <p className="mt-1 text-xs text-slate-500 pl-6">
                    Tendrá acceso a todas las páginas y configuraciones del sistema.
                  </p>
                </div>

                {!isAdmin && (
                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Páginas Permitidas</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availablePages.map((page) => (
                        <label key={page.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permissions.includes(page.id)}
                            onChange={() => togglePermission(page.id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          {page.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
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
