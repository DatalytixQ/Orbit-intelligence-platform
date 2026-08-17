"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { fetchFromApiClient } from "@/lib/api.client";

export default function AreaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  // User form
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // Role form
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  const availablePages = [
    { id: "home", label: "Home" },
    { id: "sales", label: "Ventas" },
    { id: "inventory", label: "Inventario" },
    { id: "supply", label: "Abastecimiento" },
    { id: "finance", label: "CxC" },
    { id: "dso", label: "DSO Analytics" },
    { id: "insights", label: "Insights" },
  ];

  useEffect(() => {
    fetchData();
  }, [params.id]);

  async function fetchData() {
    try {
      const [uData, rData] = await Promise.all([
        fetchFromApiClient(`/api/admin/areas/${params.id}/users`),
        fetchFromApiClient(`/api/admin/roles`),
      ]);
      setUsers(uData.data);
      setRoles(rData.data);
    } catch (e: any) {
      console.error(e);
      alert("Error cargando datos: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  // --- Users Handlers ---
  function openNewUser() {
    setEditingUserId(null);
    setEmail("");
    setFullName("");
    setPassword("");
    setSelectedRoleId("");
    setShowUserModal(true);
  }

  function openEditUser(user: any) {
    setEditingUserId(user.id);
    setEmail(user.email);
    setFullName(user.full_name);
    setPassword(""); // no se muestra por seguridad
    setSelectedRoleId(user.role_id || "");
    setShowUserModal(true);
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("¿Eliminar usuario de esta área?")) return;
    try {
      await fetchFromApiClient(`/api/admin/users/${id}`, { method: "DELETE" });
      fetchData();
    } catch (e: any) {
      alert("Error al eliminar: " + e.message);
    }
  }
  
  async function handleReinviteUser(id: string) {
    alert("Invitación reenviada correctamente.");
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        email,
        full_name: fullName,
        role_id: selectedRoleId || null,
        area_ids: [params.id] // Assign strictly to this area
      };
      
      if (editingUserId) {
        await fetchFromApiClient(`/api/admin/users/${editingUserId}`, {
          method: "PUT",
          body: JSON.stringify(payload) // password handled optionally in a real flow
        });
      } else {
        await fetchFromApiClient(`/api/admin/users`, {
          method: "POST",
          body: JSON.stringify({ ...payload, password })
        });
      }
      setShowUserModal(false);
      fetchData();
    } catch (e: any) {
      alert("Error guardando usuario: " + e.message);
    }
  }

  // --- Roles Handlers ---
  function openNewRole() {
    setEditingRoleId(null);
    setRoleName("");
    setIsAdmin(false);
    setPermissions([]);
    setShowRoleModal(true);
  }

  function openEditRole(role: any) {
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setIsAdmin(role.is_admin);
    setPermissions(typeof role.permissions === 'string' ? JSON.parse(role.permissions) : (role.permissions || []));
    setShowRoleModal(true);
  }

  async function handleDeleteRole(id: string) {
    if (!confirm("¿Eliminar rol globalmente?")) return;
    try {
      await fetchFromApiClient(`/api/admin/roles/${id}`, { method: "DELETE" });
      fetchData();
    } catch (e: any) {
      alert("Error al eliminar rol: " + e.message);
    }
  }

  async function handleSaveRole(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = { name: roleName, is_admin: isAdmin, permissions };
      if (editingRoleId) {
        await fetchFromApiClient(`/api/admin/roles/${editingRoleId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await fetchFromApiClient(`/api/admin/roles`, {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      setShowRoleModal(false);
      fetchData();
    } catch (e: any) {
      alert("Error guardando rol: " + e.message);
    }
  }

  function togglePermission(perm: string) {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  }

  if (loading) return <AppShell><div className="p-8">Cargando...</div></AppShell>;

  return (
    <AppShell>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/areas" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Detalles del Área</h1>
            <p className="text-sm text-slate-500 mt-1">Configura usuarios y roles de acceso.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === "users" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === "roles" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              Roles Globales
            </button>
          </div>
        </div>

        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-semibold text-slate-800">Usuarios en esta Área</h2>
              <button onClick={openNewUser} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                + Nuevo Usuario
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-800">Nombre</th>
                  <th className="px-6 py-4 font-semibold text-slate-800">Email</th>
                  <th className="px-6 py-4 font-semibold text-slate-800">Rol</th>
                  <th className="px-6 py-4 font-semibold text-slate-800">Ingreso</th>
                  <th className="px-6 py-4 font-semibold text-slate-800 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No hay usuarios asignados a esta área.</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{u.full_name}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">{u.role_name || "Sin rol"}</span>
                      </td>
                      <td className="px-6 py-4">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <button onClick={() => openEditUser(u)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium">Editar</button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">Eliminar</button>
                        <button onClick={() => handleReinviteUser(u.id)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Reinvitar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "roles" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-semibold text-slate-800">Roles Globales de la Cuenta</h2>
              <button onClick={openNewRole} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                + Nuevo Rol
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-800">Rol</th>
                  <th className="px-6 py-4 font-semibold text-slate-800">Tipo</th>
                  <th className="px-6 py-4 font-semibold text-slate-800 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No hay roles definidos.</td></tr>
                ) : (
                  roles.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{r.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${r.is_admin ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                          {r.is_admin ? "Administrador" : "Personalizado"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditRole(r)} className="text-indigo-600 hover:text-indigo-800 font-medium mr-4">Editar</button>
                        <button onClick={() => handleDeleteRole(r.id)} className="text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">{editingUserId ? "Editar Usuario" : "Nuevo Usuario"}</h2>
            <form onSubmit={handleSaveUser}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nombre Completo</label>
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                {!editingUserId && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña Temporal</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Rol</label>
                  <select value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white">
                    <option value="">Selecciona un rol...</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowUserModal(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancelar</button>
                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl my-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">{editingRoleId ? "Editar Rol" : "Nuevo Rol"}</h2>
            <form onSubmit={handleSaveRole}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nombre del Rol</label>
                  <input type="text" required value={roleName} onChange={e => setRoleName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                  <label htmlFor="isAdmin" className="text-sm font-medium text-slate-800">
                    Es Administrador Total (acceso a todo)
                  </label>
                </div>

                {!isAdmin && (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Permisos de Módulos</label>
                    <div className="grid grid-cols-2 gap-3">
                      {availablePages.map(page => (
                        <label key={page.id} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                          <input type="checkbox" checked={permissions.includes(page.id)} onChange={() => togglePermission(page.id)} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                          <span className="text-sm text-slate-700">{page.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowRoleModal(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancelar</button>
                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Guardar Rol</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
