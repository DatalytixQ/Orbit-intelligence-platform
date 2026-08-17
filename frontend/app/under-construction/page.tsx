"use client";

import React from "react";
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import { HardHat, AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnderConstructionPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-500 mb-6">
            <HardHat className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Módulo en Construcción
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Este reporte o sección se encuentra actualmente en desarrollo y pronto estará disponible.
          </p>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" /> Volver Atrás
          </button>
        </div>
      </div>
    </div>
  );
}
