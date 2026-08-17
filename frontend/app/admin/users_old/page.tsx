"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import { Settings, Plus, Users, Shield, Check, X, Mail, Lock, User as UserIcon } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("datalytixq_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

      const [usersRes, rolesRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/users`, { headers }),
        fetch(`${baseUrl}/api/admin/roles`, { headers })
      ]);

      if (usersRes.ok && rolesRes.ok) {
        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();
        setUsers(usersData.users);
        setRoles(rolesData.roles);
        if (rolesData.roles.length > 0) {
          setFormData(prev => ({ ...prev, role_id: rolesData.roles[0].id }));
        }
      } else {
        const err = await usersRes.json();
        setError(err.error || "No autorizado");
      }
    } catch (e) {
      console.error(e);
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const token = localStorage.getItem("datalytixq_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

      const res = await fetch(`${baseUrl}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok && data.ok) {
        setSuccess("Usuario creado correctamente");
        setShowModal(false);
        setFormData({ full_name: "", email: "", password: "", role_id: roles[0]?.id || "" });
        fetchData(); // Reload table
      } else {
        setError(data.error || "Error al crear usuario");
      }
    } catch (e: any) {
      setError(e.message || "Error inesperado");
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto p-8 relative">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="text-slate-500" /> Administración</h1>
            <p className="text-sm text-slate-500 mt-1">Gestión de Accesos y Roles</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo Usuario
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2"><X className="w-4 h-4"/>{error}</div>}
        {success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-6 text-sm font-medium border border-emerald-100 flex items-center gap-2"><Check className="w-4 h-4"/>{success}</div>}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1 max-h-[800px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <th className="p-4">Usuario</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center text-slate-500">Cargando...</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {user.full_name?.substring(0,2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-sm">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold flex items-center gap-1 w-max">
                      <Shield className="w-3 h-3" /> {user.role_name}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.is_active ? 
                      <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Activo</span> : 
                      <span className="text-rose-500 text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Inactivo</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create User Modal */}
        {showModal && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b border-slate-100">
                <h3 className="font-bold text-lg flex items-center gap-2"><Users className="w-5 h-5 text-indigo-600"/> Crear Usuario</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleCreateUser} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Nombre Completo</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Ej. Juan Pérez" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="juan@empresa.com" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Contraseña Temporal</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Mínimo 8 caracteres" minLength={8} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Rol Asignado</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select required value={formData.role_id} onChange={e => setFormData({...formData, role_id: e.target.value})} className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 appearance-none bg-white">
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">Guardar Usuario</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
