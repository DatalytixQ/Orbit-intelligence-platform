"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Folder,
  LayoutDashboard,
  LogOut,
  Globe,
  User
} from "lucide-react";
import { useTranslations } from "next-intl";
import { fetchFromApiClient } from "@/lib/api.client";

export default function DynamicSidebar() {
  const pathname = usePathname();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [areas, setAreas] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [openAreas, setOpenAreas] = useState<Record<string, boolean>>({});
  const t = useTranslations('Navigation');

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("datalytixq_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setPermissions(user.permissions || []);
        setIsAdmin(user.is_admin || false);
      }
    } catch (e) {
      console.error("Error reading user from localStorage", e);
    }
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const [aData, rData] = await Promise.all([
        fetchFromApiClient("/api/admin/areas"),
        fetchFromApiClient("/api/admin/reports")
      ]);

      setAreas(aData.areas);
      setReports(rData.reports);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleArea = (areaId: string) => {
    setOpenAreas(prev => ({ ...prev, [areaId]: !prev[areaId] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("datalytixq_token");
    localStorage.removeItem("datalytixq_user");
    document.cookie = "datalytixq_token=; path=/; max-age=0; SameSite=Lax";
    window.location.href = "/login";
  };

  const toggleLanguage = () => {
    const isEn = document.cookie.includes('NEXT_LOCALE=en');
    const nextLocale = isEn ? 'es' : 'en';
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <div className="w-16 md:w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 flex flex-col z-30 transition-all text-slate-300 h-screen shrink-0 font-sans">
      <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight cursor-pointer">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="hidden md:block">Orbit</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-2 md:px-3 flex flex-col gap-2 custom-scrollbar">
        {areas.map((area) => {
          // Filtrar reportes del área que el usuario tiene permitido ver
          const areaReports = reports.filter(r => r.area_id === area.id && (isAdmin || permissions.includes(r.id)));
          
          if (areaReports.length === 0) return null; // No mostrar el área si no tiene reportes permitidos
          
          const isOpen = openAreas[area.id] !== false; // Abierto por defecto

          return (
            <div key={area.id} className="flex flex-col mb-2">
              <button 
                onClick={() => toggleArea(area.id)}
                className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  <span className="hidden md:block uppercase tracking-wider text-xs">{area.name}</span>
                </div>
                <div className="hidden md:block">
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="mt-1 flex flex-col gap-1">
                  {areaReports.map(report => {
                    const isActive = pathname === report.path;
                    const activeClass = 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500 rounded-l-none font-bold';
                    const hoverClass = 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium';
                    
                    return (
                      <Link key={report.id} href={report.path}>
                        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${isActive ? activeClass : hoverClass}`}>
                          <LayoutDashboard className="w-4 h-4 shrink-0" />
                          <span className="hidden md:block truncate">{report.name}</span>
                        </button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
        {isAdmin && (
          <Link href="/admin">
            <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${pathname.startsWith('/admin') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Settings className="w-5 h-5 shrink-0" />
              <span className="hidden md:block truncate">{t('settings')}</span>
            </button>
          </Link>
        )}
        
        <Link href="/account">
          <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${pathname.startsWith('/account') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <User className="w-5 h-5 shrink-0" />
            <span className="hidden md:block truncate">{t('profile') || "Mi Perfil"}</span>
          </button>
        </Link>

        <button onClick={toggleLanguage} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
          <Globe className="w-5 h-5 shrink-0" />
          <span className="hidden md:block truncate">EN / ES</span>
        </button>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden md:block truncate">{t('logout')}</span>
        </button>

        <div className="mt-2 pt-2 border-t border-slate-800 flex flex-col gap-1 hidden md:flex">
          <Link href="/legal/terms" className="text-[10px] text-slate-500 hover:text-slate-300 px-3">Términos de Servicio</Link>
          <Link href="/legal/privacy" className="text-[10px] text-slate-500 hover:text-slate-300 px-3">Política de Privacidad</Link>
        </div>
      </div>
    </div>
  );
}
