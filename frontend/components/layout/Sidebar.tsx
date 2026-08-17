"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/sales", label: "Ventas" },
  { href: "/inventory", label: "Inventario" },
  { href: "/supply", label: "Abastecimiento" },
  { href: "/finance", label: "CxC", permission: "finance", children: [{ href: "/finance/dso-analytics", label: "DSO Analytics" }] },
  { href: "/insights", label: "Insights", permission: "insights" },
];

type User = {
  full_name?: string;
  email?: string;
  client_name?: string;
  is_admin?: boolean;
  permissions?: string[];
  role_id?: string;
};

export default function Sidebar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("datalytixq_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("datalytixq_token");
    localStorage.removeItem("datalytixq_user");
    document.cookie = "datalytixq_token=; path=/; max-age=0";
    window.location.href = "/login";
  }

  const hasAccess = (permission?: string) => {
    if (!permission) return true; // Links sin permiso específico (ej. Home)
    if (user?.is_admin) return true;
    return user?.permissions?.includes(permission) || false;
  };

  return (
    <aside className="flex h-screen w-[250px] flex-col bg-slate-950 text-slate-100 border-r border-slate-800">
      <div className="border-b border-slate-800 p-5">
        <p className="text-xl font-bold">DQ Orbit</p>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Decision Intelligence Platform</p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-3 custom-scrollbar">
        {links.map((link) => {
          if (!hasAccess(link.permission)) return null;
          const isActive = pathname === link.href;
          return (
          <div key={link.href}>
            <Link
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-indigo-300"
              }`}
            >
              {link.label}
            </Link>

            {link.children && (
              <div className="ml-4 mt-1 space-y-1 border-l border-slate-800 pl-3">
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      pathname === child.href ? "text-white bg-indigo-500/20" : "text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )})}

        {user?.is_admin && (
          <div className="pt-6 pb-2">
            <button
              onClick={() => setOpenAdmin(!openAdmin)}
              className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 uppercase tracking-wider transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Administración
              </span>
              <span>{openAdmin ? "▾" : "▸"}</span>
            </button>
            
            {openAdmin && (
              <div className="mt-2 space-y-1 pl-2">
                <Link
                  href="/admin/areas"
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === "/admin/areas" || pathname.startsWith("/admin/areas/") ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  🏢 Áreas y Accesos
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="border-t border-slate-800 p-4 text-xs text-slate-400 bg-slate-950">
        <button
          type="button"
          onClick={() => setOpenProfile(!openProfile)}
          className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-900"
        >
          <p className="font-semibold text-slate-200">
            {user?.full_name || user?.email || "Usuario"}
          </p>
          <p className="mt-0.5 text-slate-500">{user?.is_admin ? "Administrador" : "Usuario"} ▾</p>
        </button>

        {openProfile && (
          <div className="mt-2 space-y-1 rounded-lg bg-slate-900 p-2 border border-slate-800">
            <Link
              href="/account/profile"
              className="block rounded-md px-2 py-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              Mi Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left rounded-md px-2 py-1.5 text-red-400 transition-colors hover:bg-slate-800 hover:text-red-300"
            >
              Cerrar Sesión
            </button>
          </div>
        )}

        <div className="mt-4 border-t border-slate-800 pt-3 px-1 text-slate-500">
          <p>Cliente: {user?.client_name || "N/D"}</p>
          <p className="mt-1">DQ Orbit v2.0</p>
        </div>
      </div>
    </aside>
  );
}