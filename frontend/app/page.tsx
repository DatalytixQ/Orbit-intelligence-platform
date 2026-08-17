"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Activity,
  Zap,
  FolderOpen,
  Wallet,
  Settings,
  Bot,
  Search,
  Save,
  Calendar,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const t = useTranslations('Dashboard');
  const tNav = useTranslations('Navigation');

  const defaultLayout: Layout[] = [
    { i: "etl_status", x: 0, y: 0, w: 4, h: 2, static: !isEditing },
    { i: "insights", x: 4, y: 0, w: 4, h: 2, static: !isEditing },
    { i: "calendar", x: 8, y: 0, w: 4, h: 2, static: !isEditing },
  ];

  const [layout, setLayout] = useState<Layout[]>(defaultLayout);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("datalytixq_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));

    const saved = localStorage.getItem("orbit_home_layout");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLayout(parsed.map((l: Layout) => ({ ...l, static: true })));
      } catch (e) {
        console.error("Failed to parse saved layout");
      }
    }
  }, [router]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (isEditing) setLayout(newLayout);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      const layoutToSave = layout.map(l => ({ ...l, static: true }));
      setLayout(layoutToSave);
      localStorage.setItem("orbit_home_layout", JSON.stringify(layoutToSave));
    } else {
      setLayout(layout.map(l => ({ ...l, static: false })));
    }
    setIsEditing(!isEditing);
  };

  const favoriteReports = [
    { title: "Financial", subtitle: "Directorio Chile", category: "Finanzas", link: "/finance-dashboard", icon: <Wallet className="w-5 h-5 text-rose-500" /> },
    { title: "Oportunidades", subtitle: "Directorio Chile", category: "Comercial", link: "/crm-dashboard", icon: <FolderOpen className="w-5 h-5 text-amber-500" /> },
    { title: "Operacional", subtitle: "Walties", category: "Operaciones", link: "#", icon: <Activity className="w-5 h-5 text-emerald-500" /> },
    { title: "MRR Control", subtitle: "Directorio Chile", category: "Finanzas", link: "#", icon: <Activity className="w-5 h-5 text-rose-500" /> },
    { title: "KPIs Utilización", subtitle: "Walties", category: "Oficial", link: "#", icon: <Zap className="w-5 h-5 text-amber-500" /> },
    { title: "Consumo PBI", subtitle: "Walties", category: "Oficial", link: "#", icon: <LayoutDashboard className="w-5 h-5 text-indigo-500" /> },
  ];

  if (!mounted || !user) return null;

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />

      {/* CENTER COLUMN (Main Content) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 flex flex-col h-14 shrink-0">
          <div className="flex-1 flex items-center justify-between px-6">
             <div className="flex-1 max-w-xl">
                 <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder={tNav('search_placeholder')}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 dark:text-slate-200"
                    />
                 </div>
             </div>
             <div className="flex items-center gap-4 text-sm ml-4">
               <button 
                 onClick={toggleEditMode}
                 className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                   isEditing ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                 }`}
               >
                 {isEditing ? <><Save className="w-3 h-3" /> Guardar</> : <><Settings className="w-3 h-3" /> Configurar</>}
               </button>
               <button className="flex items-center gap-2 text-xs font-bold text-white bg-slate-900 px-4 py-1.5 rounded-full hover:bg-slate-800 transition-colors">
                 <Bot className="w-4 h-4 text-rose-500" /> Orbitbot
               </button>
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer text-slate-700">
                 {user.full_name?.substring(0,2).toUpperCase() || 'US'}
               </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-slate-950 p-4 md:p-6 custom-scrollbar flex gap-6">
          
          <div className="flex-1 flex flex-col gap-6">
            {/* Top Row: Hero Banner & KPIs */}
            <div className="flex flex-col xl:flex-row gap-4">
              <div className="flex-1 rounded-2xl relative overflow-hidden shadow-sm flex items-center p-8 justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 11px)' }}></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
                <div className="relative z-10 text-white">
                  <p className="text-sm text-indigo-200 font-medium mb-1 tracking-wide uppercase">{t('welcome_back')}</p>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{user.full_name || 'Usuario'}</h1>
                  <p className="mt-2 text-sm text-slate-300 max-w-md">{t('hero_subtitle')}</p>
                </div>
              </div>

              <div className="w-full xl:w-72 flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between items-center h-full">
                  <div>
                    <p className="text-xs font-bold text-slate-500">UF</p>
                    <p className="text-lg font-bold text-slate-800">39.934,33 CLP</p>
                  </div>
                  <Activity className="w-8 h-8 text-emerald-500 opacity-20" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between items-center h-full">
                  <div>
                    <p className="text-xs font-bold text-slate-500">Dólar</p>
                    <p className="text-lg font-bold text-slate-800">886,09 CLP</p>
                  </div>
                  <Activity className="w-8 h-8 text-rose-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Pinned Reports */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" /> {t('reports')}
                </h2>
                <Search className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoriteReports.map((report, idx) => (
                  <Link href={report.link} key={idx}>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer flex justify-between items-start group h-full">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{report.icon}</div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{report.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{report.subtitle}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{report.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widgets Area */}
            <div className="flex-1 mt-4">
               <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-slate-500" /> {t('widgets')}
                  </h2>
               </div>
               
               <div className="relative">
                 {isEditing && (
                   <div className="absolute -top-10 right-0 z-50 bg-indigo-500 text-white px-3 py-1 text-xs rounded-full shadow-lg font-bold animate-pulse flex items-center gap-2">
                     <LayoutDashboard className="w-3 h-3" /> Arrastra para reordenar
                   </div>
                 )}
                 <GridLayout
                   className="layout -mx-3"
                   layout={layout}
                   cols={12}
                   rowHeight={120}
                   width={900} // Approximate width for main col
                   onLayoutChange={handleLayoutChange}
                   isDraggable={isEditing}
                   isResizable={isEditing}
                   margin={[12, 12]}
                 >
                   <div key="etl_status" className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col ${isEditing ? 'ring-2 ring-indigo-500 cursor-move' : ''}`}>
                     <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Estado ETL
                     </h3>
                     <div className="flex-1 overflow-y-auto space-y-2">
                       <div className="flex justify-between text-[11px]"><span className="text-emerald-500 font-bold">• Financial</span><span className="text-slate-400">hace una hora</span></div>
                       <div className="flex justify-between text-[11px]"><span className="text-emerald-500 font-bold">• Referidos</span><span className="text-slate-400">hace una hora</span></div>
                       <div className="flex justify-between text-[11px]"><span className="text-emerald-500 font-bold">• Oportunidades</span><span className="text-slate-400">hace 2 horas</span></div>
                     </div>
                   </div>

                   <div key="insights" className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col relative overflow-hidden ${isEditing ? 'ring-2 ring-indigo-500 cursor-move' : ''}`}>
                     <h3 className="text-xs font-bold text-rose-500 flex items-center gap-1 mb-2">
                       ? Sabías Qué
                     </h3>
                     <p className="text-[10px] font-bold text-rose-400 text-center mt-2 mb-1 uppercase">Ventas NetSuite</p>
                     <p className="text-xs text-slate-700 text-center font-medium leading-relaxed">
                       Las ventas del canal <strong>B2B Mayorista</strong> superaron las expectativas este mes.
                     </p>
                   </div>

                   <div key="calendar" className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col ${isEditing ? 'ring-2 ring-indigo-500 cursor-move' : ''}`}>
                     <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
                       <Calendar className="w-3 h-3 text-blue-500" /> Calendario
                     </h3>
                     <div className="flex-1 space-y-3">
                       <div className="border-l-2 border-indigo-500 pl-2">
                         <div className="text-[9px] text-indigo-500 font-bold">HOY - 10:00</div>
                         <div className="text-[11px] font-semibold text-slate-700 truncate">Comité Ventas</div>
                       </div>
                       <div className="border-l-2 border-slate-300 pl-2 opacity-60">
                         <div className="text-[9px] text-slate-500 font-bold">MAÑANA - 15:00</div>
                         <div className="text-[11px] font-semibold text-slate-700 truncate">Revisión S&OP</div>
                       </div>
                     </div>
                   </div>
                 </GridLayout>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden lg:flex w-72 flex-col gap-6">
             <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-slate-500"/> Workspaces</h3>
                </div>
                <div className="text-xs font-semibold text-slate-500 mb-2">Sesiones recientes</div>
                <div className="space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-xs font-bold text-slate-700">Comité Operacional 14-ABR</p>
                    <p className="text-[10px] text-slate-400">Operacional - hace 2 días</p>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-xs font-bold text-slate-700">Prueba - 13-04-2026</p>
                    <p className="text-[10px] text-slate-400">hace 3 días</p>
                  </div>
                </div>
             </div>
             
             <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-slate-500"/> Novedades</h3>
                  <span className="text-xs text-rose-500 cursor-pointer">Ver todas</span>
                </div>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-2 h-2 rounded-full border border-white bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 group-[.is-active]:bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-1rem)] md:w-[calc(50%-1.5rem)] p-1 ml-3">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900 text-[11px]">Workspace ya disponible</div>
                      </div>
                      <div className="text-slate-500 text-[9px]">hace 16 días</div>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-2 h-2 rounded-full border border-white bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 group-[.is-active]:bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-1rem)] md:w-[calc(50%-1.5rem)] p-1 ml-3">
                      <div className="font-bold text-slate-900 text-[11px]">Centro de Soporte en barra</div>
                      <div className="text-slate-500 text-[9px]">hace 2 meses</div>
                    </div>
                  </div>
                </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
}