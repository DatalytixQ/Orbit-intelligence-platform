import React, { useState, useEffect } from 'react';
import { ChevronDown, Download, Maximize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface TabOption {
  id: string;
  label: string;
}

export interface UnifiedDashboardHeaderProps {
  title: string;
  activeTab: string;
  tabs: TabOption[];
  onTabChange: (tabId: string) => void;
  selectedEmpresa: string;
  setSelectedEmpresa: (val: string) => void;
  selectedMoneda: string;
  setSelectedMoneda: (val: string) => void;
  selectedChannel?: string;
  setSelectedChannel?: (val: string) => void;
  selectedRep?: string;
  setSelectedRep?: (val: string) => void;
  startDate?: string;
  setStartDate?: (val: string) => void;
  endDate?: string;
  setEndDate?: (val: string) => void;
  metricMode?: 'monto' | 'cantidad';
  setMetricMode?: (val: 'monto' | 'cantidad') => void;
}

export function FilterDropdown({ label, value, options, onChange, allLabel }: { label: string, value: string, options?: {id: string, name: string}[], onChange?: (val: string) => void, allLabel?: string }) {
  if (options) {
    return (
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 shrink-0 hover:border-indigo-400 transition-colors relative cursor-pointer group">
        <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">{label}</span>
        <select 
          className="appearance-none bg-transparent font-semibold text-slate-800 dark:text-white truncate max-w-[140px] focus:outline-none cursor-pointer pr-4"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        >
          <option value="all">{allLabel || 'Todos'}</option>
          {options.map(opt => <option key={opt.id} value={opt.id} className="text-slate-800">{opt.name}</option>)}
        </select>
        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 pointer-events-none group-hover:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 shrink-0 cursor-not-allowed opacity-80">
      <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">{label}</span>
      <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[120px]">{value}</span>
    </div>
  );
}

export default function UnifiedDashboardHeader({
  title,
  activeTab,
  tabs,
  onTabChange,
  selectedEmpresa,
  setSelectedEmpresa,
  selectedMoneda,
  setSelectedMoneda,
  selectedChannel,
  setSelectedChannel,
  selectedRep,
  setSelectedRep,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  metricMode,
  setMetricMode
}: UnifiedDashboardHeaderProps) {
  const tF = useTranslations('Filters');
  const tC = useTranslations('Commercial');

  const [filtersData, setFiltersData] = useState<any>({ subsidiaries: [], currencies: [], channels: [], reps: [] });
  const [etlStatus, setEtlStatus] = useState<any>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    const token = localStorage.getItem('datalytixq_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchFilters = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/kpi/filters`, { headers });
        if (res.ok) {
          const data = await res.json();
          setFiltersData(data);
        }
      } catch (e) {
        console.error("Failed to load filters", e);
      }
    };

    const fetchEtlStatus = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/kpi/system/etl-status`, { headers });
        if (res.ok) {
          const data = await res.json();
          setEtlStatus(data);
        }
      } catch (e) {
        console.error("Failed to load ETL status", e);
      }
    };

    fetchFilters();
    fetchEtlStatus();
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 flex flex-col">
      <div className="w-full flex justify-center mt-4 mb-2">
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl space-x-1 w-fit overflow-x-auto shadow-inner">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-14 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
         <div className="flex items-center gap-4">
           <h1 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
             {title}
           </h1>
         </div>
         <div className="flex items-center gap-4 text-sm">
           <div className="text-xs text-slate-400 font-medium">
             Última actualización: {etlStatus?.last_etl_sync 
               ? new Date(etlStatus.last_etl_sync).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) 
               : '—'} (NetSuite)
           </div>
           <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors">
             <Download className="w-4 h-4" /> Exportar
           </button>
           <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors">
             <Maximize2 className="w-4 h-4" />
           </button>
         </div>
      </div>

      {/* Global Filters Bar */}
      <div className="h-14 flex items-center px-6 gap-4 overflow-x-auto no-scrollbar text-sm">
        <FilterDropdown label={tF('company')} value={selectedEmpresa} options={filtersData.subsidiaries} onChange={setSelectedEmpresa} allLabel={tF('all')} />
        <FilterDropdown label={tF('currency')} value={selectedMoneda} options={filtersData.currencies} onChange={setSelectedMoneda} allLabel={tF('all')} />
        
        {setSelectedChannel && (
          <FilterDropdown label={tF('channel')} value={selectedChannel || 'all'} options={filtersData.channels} onChange={setSelectedChannel} allLabel={tF('all')} />
        )}
        
        {setSelectedRep && (
          <FilterDropdown label={tF('representative')} value={selectedRep || 'all'} options={filtersData.reps} onChange={setSelectedRep} allLabel={tF('all')} />
        )}

        {setStartDate && setEndDate && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 shrink-0">
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">{tF('period')}</span>
            <input type="date" value={startDate || ''} onChange={e => setStartDate(e.target.value)} className="bg-transparent text-xs outline-none cursor-pointer" />
            <span className="text-slate-400">a</span>
            <input type="date" value={endDate || ''} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-xs outline-none cursor-pointer" />
          </div>
        )}

        {metricMode && setMetricMode && (
          <div className="ml-auto flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 shadow-inner">
            <button
              onClick={() => setMetricMode('monto')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${metricMode === 'monto' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              $ {tC('amount')}
            </button>
            <button
              onClick={() => setMetricMode('cantidad')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${metricMode === 'cantidad' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              # {tC('quantity')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
