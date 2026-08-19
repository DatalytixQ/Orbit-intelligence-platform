"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchFromApiClient } from "@/lib/api.client";
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import { Settings, Users, Shield, LayoutDashboard, Folder, Tags, Zap, Plus, X, Check, Save, Edit, Trash2, Loader2 } from "lucide-react";

type TabType = "users" | "roles" | "reports" | "areas" | "tags" | "automations" | "areas_access";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("areas_access");
  
  // Data States
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uData, rData, aData, repData] = await Promise.all([
        fetchFromApiClient("/api/admin/users"),
        fetchFromApiClient("/api/admin/roles"),
        fetchFromApiClient("/api/admin/areas"),
        fetchFromApiClient("/api/admin/reports")
      ]);

      setUsers(uData.users);
      setRoles(rData.roles);
      setAreas(aData.areas);
      setReports(repData.reports);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "areas_access", label: "Áreas y Accesos", icon: <Folder className="w-4 h-4" /> },
    { id: "users", label: "Usuarios", icon: <Users className="w-4 h-4" /> },
    { id: "roles", label: "Roles", icon: <Shield className="w-4 h-4" /> },
    { id: "reports", label: "Reportes", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "tags", label: "Etiquetas", icon: <Tags className="w-4 h-4" /> },
    { id: "automations", label: "Automatizaciones", icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto relative p-6 md:p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
            <Settings className="w-6 h-6 text-indigo-500" /> Configuración Global
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de Accesos, Roles y Tableros</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400">Cargando datos...</div>
          ) : (
            <>
              {activeTab === "areas_access" && <AreasTab areas={areas} reports={reports} refreshData={fetchData} />}

              {activeTab === "roles" && <RolesTab roles={roles} areas={areas} reports={reports} refreshData={fetchData} />}
              
              {activeTab === "users" && <UsersTab users={users} roles={roles} refreshData={fetchData} />}

              {activeTab === "reports" && <ReportsTab reports={reports} areas={areas} refreshData={fetchData} />}
              {(activeTab === "tags" || activeTab === "automations") && <div className="text-slate-500 flex flex-col items-center justify-center py-20"><Zap className="w-12 h-12 text-slate-300 mb-4"/>Próximamente disponible</div>}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

// ==========================================
// PESTAÑA: ÁREAS
// ==========================================
function AreasTab({ areas, reports, refreshData }: { areas: any[], reports: any[], refreshData: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const openNew = () => { setEditing(null); setName(""); setShowModal(true); };
  const openEdit = (a: any) => { setEditing(a); setName(a.name); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Nombre obligatorio");
    setLoading(true);
    try {
      const url = editing ? `/api/admin/areas/${editing.id}` : "/api/admin/areas";
      const method = editing ? "PUT" : "POST";
      await fetchFromApiClient(url, { method, body: JSON.stringify({ name }) });
      setShowModal(false);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta área?")) return;
    try {
      await fetchFromApiClient(`/api/admin/areas/${id}`, { method: "DELETE" });
      refreshData();
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold">Áreas disponibles para administrar</h2>
          <p className="text-sm text-slate-500">Gestiona accesos de usuarios a las áreas de la plataforma.</p>
        </div>
        <button onClick={openNew} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Nueva Área
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {areas.map(a => {
          const areaReportsCount = reports.filter(r => r.area_id === a.id).length;
          return (
            <div key={a.id} className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors bg-white relative group shadow-sm hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-800">{a.name}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(a)} className="text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(a.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Reportes asociados:</span> <span className="font-semibold">{areaReportsCount}</span></div>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg">{editing ? "Editar Área" : "Nueva Área"}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Ej: Recursos Humanos" />
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PESTAÑA: ROLES
// ==========================================
function RolesTab({ roles, areas, reports, refreshData }: { roles: any[], areas: any[], reports: any[], refreshData: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [roleName, setRoleName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedReports, setSelectedReports] = useState<Record<string, { can_update: boolean }>>({});

  const openNew = () => {
    setEditing(null);
    setRoleName("");
    setIsAdmin(false);
    setSelectedReports({});
    setShowModal(true);
  };

  const openEdit = (role: any) => {
    setEditing(role);
    setRoleName(role.name);
    setIsAdmin(role.is_admin);
    const repMap: Record<string, { can_update: boolean }> = {};
    if (role.reports) {
      role.reports.forEach((r: any) => {
        repMap[r.report_id] = { can_update: r.can_update };
      });
    }
    setSelectedReports(repMap);
    setShowModal(true);
  };

  const toggleReport = (reportId: string) => {
    setSelectedReports(prev => {
      const next = { ...prev };
      if (next[reportId]) delete next[reportId];
      else next[reportId] = { can_update: false };
      return next;
    });
  };

  const toggleCanUpdate = (reportId: string) => {
    setSelectedReports(prev => {
      if (!prev[reportId]) return prev;
      return { ...prev, [reportId]: { ...prev[reportId], can_update: !prev[reportId].can_update } };
    });
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return alert("El nombre del rol es obligatorio");
    setLoading(true);

    const formattedReports = Object.keys(selectedReports).map(id => ({
      report_id: id,
      can_update: selectedReports[id].can_update
    }));

    try {
      const url = editing ? `/api/admin/roles/${editing.id}` : "/api/admin/roles";
      const method = editing ? "PUT" : "POST";
      await fetchFromApiClient(url, {
        method,
        body: JSON.stringify({ name: roleName, is_admin: isAdmin, reports: formattedReports })
      });
      setShowModal(false);
      refreshData();
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Error al guardar rol");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este rol?")) return;
    try {
      await fetchFromApiClient(`/api/admin/roles/${id}`, { method: "DELETE" });
      refreshData();
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Listado de Roles</h2>
        <button onClick={openNew} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo Rol
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
              <th className="p-4">Nombre del Rol</th>
              <th className="p-4">Nivel de Acceso</th>
              <th className="p-4">Reportes Asignados</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-semibold text-sm">{role.name}</td>
                <td className="p-4">
                  {role.is_admin ? (
                    <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold border border-rose-100">Administrador Total</span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">Personalizado</span>
                  )}
                </td>
                <td className="p-4 text-sm text-slate-600">
                  {role.is_admin ? "Todos los reportes" : `${role.reports?.length || 0} reportes`}
                </td>
                <td className="p-4 text-right flex justify-end gap-3">
                   <button onClick={() => openEdit(role)} className="text-indigo-500 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"><Edit className="w-3 h-3"/> Editar</button>
                   <button onClick={() => handleDelete(role.id)} className="text-slate-400 hover:text-rose-500 text-xs font-bold flex items-center gap-1"><Trash2 className="w-3 h-3"/> Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg">{editing ? "Editar Rol" : "Nuevo Rol"}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="mb-6">
                <input type="text" required placeholder="Ej: Gerencia Comercial" value={roleName} onChange={e => setRoleName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <Toggle checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
                <span className="text-sm font-semibold text-slate-700">Admin</span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-4 border-b border-slate-100 pb-2">Reportes</h4>
              <div className={`space-y-1 ${isAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
                {areas.map(area => {
                  const areaReports = reports.filter(r => r.area_id === area.id);
                  if (areaReports.length === 0) return null;
                  return (
                    <div key={area.id} className="mb-4">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">{area.name}</h5>
                      <div className="space-y-1">
                        {areaReports.map(report => {
                          const isSelected = !!selectedReports[report.id];
                          const canUpdate = selectedReports[report.id]?.can_update || false;
                          return (
                            <div key={report.id} className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors">
                              <div className="flex items-center gap-3">
                                <Toggle checked={isSelected} onChange={() => toggleReport(report.id)} />
                                <span className="text-sm text-slate-700 font-medium">{report.name}</span>
                              </div>
                              {isSelected && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <span className="text-xs text-slate-400">Puede actualizar</span>
                                  <input type="checkbox" checked={canUpdate} onChange={() => toggleCanUpdate(report.id)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                                </label>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleSaveRole} disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Guardar Rol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PESTAÑA: USUARIOS
// ==========================================
function UsersTab({ users, roles, refreshData }: { users: any[], roles: any[], refreshData: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  const openNew = () => { setEditing(null); setFullName(""); setEmail(""); setPassword(""); setRoleId(""); setShowModal(true); };
  const openEdit = (user: any) => { setEditing(user); setFullName(user.full_name); setEmail(user.email); setPassword(""); setRoleId(user.role_id || ""); setShowModal(true); };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !roleId) return alert("Nombre, email y rol son obligatorios");
    if (!editing && !password) return alert("Contraseña obligatoria para usuarios nuevos");
    setLoading(true);

    try {
      const url = editing ? `/api/admin/users/${editing.id}` : "/api/admin/users";
      const method = editing ? "PUT" : "POST";
      const body: any = { full_name: fullName, email, role_id: roleId };
      if (password) body.password = password;

      await fetchFromApiClient(url, { method, body: JSON.stringify(body) });
      setShowModal(false);
      refreshData(); 
    } catch (e: any) {
      alert(e.message || "Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await fetchFromApiClient(`/api/admin/users/${id}`, { method: "DELETE" });
      refreshData();
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Usuarios Activos</h2>
        <button onClick={openNew} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><th className="p-3">Nombre</th><th className="p-3">Email</th><th className="p-3">Rol</th><th className="p-3 text-right">Acciones</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium">{u.full_name}</td>
                <td className="p-3 text-slate-500">{u.email}</td>
                <td className="p-3"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{u.role_name || "Sin Rol"}</span></td>
                <td className="p-3 text-right flex justify-end gap-3">
                   <button onClick={() => openEdit(u)} className="text-indigo-500 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"><Edit className="w-3 h-3"/> Editar</button>
                   <button onClick={() => handleDelete(u.id)} className="text-slate-400 hover:text-rose-500 text-xs font-bold flex items-center gap-1"><Trash2 className="w-3 h-3"/> Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg">{editing ? "Editar Usuario" : "Nuevo Usuario"}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre Completo</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Ej: Juan Pérez" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="juan@empresa.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{editing ? "Nueva Contraseña (Opcional)" : "Contraseña Temporal"}</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="********" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rol Asignado</label>
                  <select value={roleId} onChange={e => setRoleId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option value="">Seleccione un rol...</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleSaveUser} disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PESTAÑA: REPORTES
// ==========================================
function ReportsTab({ reports, areas, refreshData }: { reports: any[], areas: any[], refreshData: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [areaId, setAreaId] = useState("");

  const openNew = () => { setEditing(null); setName(""); setPath(""); setAreaId(""); setShowModal(true); };
  const openEdit = (report: any) => { setEditing(report); setName(report.name); setPath(report.path); setAreaId(report.area_id || ""); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !path || !areaId) return alert("Nombre, ruta y área son obligatorios");
    setLoading(true);

    try {
      const url = editing ? `/api/admin/reports/${editing.id}` : "/api/admin/reports";
      const method = editing ? "PUT" : "POST";
      await fetchFromApiClient(url, { method, body: JSON.stringify({ name, path, area_id: areaId }) });
      setShowModal(false);
      refreshData();
    } catch (e: any) {
      alert(e.message || "Error al guardar reporte");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este reporte?")) return;
    try {
      await fetchFromApiClient(`/api/admin/reports/${id}`, { method: "DELETE" });
      refreshData();
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Gestión de Reportes</h2>
        <button onClick={openNew} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo Reporte
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><th className="p-3">Nombre</th><th className="p-3">Ruta (URL)</th><th className="p-3">Área</th><th className="p-3 text-right">Acciones</th></tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-indigo-400"/> {r.name}</td>
                <td className="p-3 text-slate-500 font-mono text-xs">{r.path}</td>
                <td className="p-3"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{r.area_name || "Sin Área"}</span></td>
                <td className="p-3 text-right flex justify-end gap-3">
                   <button onClick={() => openEdit(r)} className="text-indigo-500 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"><Edit className="w-3 h-3"/> Editar</button>
                   <button onClick={() => handleDelete(r.id)} className="text-slate-400 hover:text-rose-500 text-xs font-bold flex items-center gap-1"><Trash2 className="w-3 h-3"/> Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg">{editing ? "Editar Reporte" : "Nuevo Reporte"}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Reporte</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Ej: Ventas Mensuales" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ruta del Dashboard (URL Path)</label>
                  <input type="text" value={path} onChange={e => setPath(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Ej: /dashboard/ventas-mensuales" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Área a la que pertenece</label>
                  <select value={areaId} onChange={e => setAreaId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option value="">Seleccione un área...</option>
                    {areas.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Toggle Component
function Toggle({ checked, onChange }: { checked: boolean, onChange: () => void }) {
  return (
    <div onClick={onChange} className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${checked ? 'bg-indigo-500' : 'bg-slate-300'}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </div>
  );
}
