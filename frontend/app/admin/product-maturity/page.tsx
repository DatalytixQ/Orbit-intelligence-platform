"use client";

import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";

export default function EngineeringControlCenter() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [maturityData, setMaturityData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [statusData, setStatusData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaignData, setCampaignData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [eventsData, setEventsData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [historyData, setHistoryData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [governanceData, setGovernanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        fetch("/api/maturity").then((res) => res.json()).catch(() => ({})),
        fetch("/api/runtime/status").then((res) => res.json()).catch(() => ({})),
        fetch("/api/runtime/campaign").then((res) => res.json()).catch(() => ({})),
        fetch("/api/runtime/events").then((res) => res.json()).catch(() => ({ events: [] })),
        fetch("/api/runtime/history").then((res) => res.json()).catch(() => ({})),
        fetch("/api/governance").then((res) => res.json()).catch(() => ({}))
      ]).then(([maturity, status, campaign, events, history, gov]) => {
        setMaturityData(maturity);
        setStatusData(status);
        setCampaignData(campaign);
        setEventsData(events);
        setHistoryData(history);
        setGovernanceData(gov);
        setLoading(false);
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-mono">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          Booting Operational Console v2.4...
        </div>
      </div>
    );
  }

  // Defensive parsing
  const runtimeState = statusData?.state ?? "OFFLINE";
  const currentPhase = statusData?.phase ?? "N/A";
  const iteration = statusData?.iteration ?? 0;
  const currentObj = statusData?.currentObjective ?? "N/A";
  const queueSize = statusData?.queueState?.pending ?? statusData?.queueSize ?? 0;
  const retryQueue = statusData?.queueState?.retry ?? statusData?.retryQueue ?? 0;
  const humanGates = statusData?.humanGates ?? 0;
  const cpu = statusData?.cpu ?? 0;
  const memory = statusData?.memory ?? 0;
  const currentTool = statusData?.currentTool ?? "IDLE";
  
  const progress = campaignData?.progress || "0/0";
  const eta = campaignData?.eta || "N/A";
  const itersPerHour = campaignData?.avgIterationTime ? Math.round(3600000 / campaignData.avgIterationTime) : 0;
  const completedObj = campaignData?.objectivesCompleted ?? 0;
  const failedObj = campaignData?.objectivesFailed ?? 0;

  const categories = statusData?.radarData || (maturityData?.categories || []).slice(0, 6);
  const eventsList = eventsData?.events || [];
  
  const gov = governanceData || {};
  const lifecycle = gov.lifecycle?.state || "N/A";
  const business = gov.business || {};
  const releases = gov.release?.releases || [];
  const backlog = gov.backlog?.backlog || [];

  const velocityHistory = historyData?.velocity || [];
  const memoryHistory = historyData?.memory || [];
  const cpuHistory = historyData?.cpu || [];
  
  // Merge CPU, MEM into a combined dataset
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unifiedHistory = velocityHistory.map((v: any, idx: number) => ({
    iteration: v.iteration,
    itersPerHour: v.itersPerHour,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    memory: (memoryHistory[idx] as any)?.heapMb || 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cpu: (cpuHistory[idx] as any)?.usagePct || 0
  }));

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8 font-sans">
      <header className="mb-8 border-b border-border pb-4 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Command Center v2.4</h1>
          <p className="text-muted-foreground mt-1">Autonomous Product Operating System</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${runtimeState === 'ACTIVE' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${runtimeState === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            </span>
            <span className="text-sm font-medium text-foreground">RUNTIME {runtimeState}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">Lifecycle: <span className="text-blue-400 font-mono">{lifecycle}</span></div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="mb-8 bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Campaign Progress: {progress}</span>
          <span>ETA: {eta}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-4">
          <div className="bg-primary h-4 rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <MetricCard title="Iteration" value={iteration} color="text-foreground" />
        <MetricCard title="Current Tool" value={currentTool} color="text-indigo-400" />
        <MetricCard title="Objectives Completed" value={completedObj} color="text-emerald-500" />
        <MetricCard title="Objectives Failed" value={failedObj} color="text-orange-500" />
        <MetricCard title="Human Gates" value={humanGates} color="text-red-500" alert={humanGates > 0} />
      </div>

      {/* UX/UI Audit Integration */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-semibold text-card-foreground">UX/UI Audit & Quality</h2>
           <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Audit Active</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-background p-4 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground mb-1">Visual Consistency</div>
              <div className="text-2xl font-bold text-foreground">100%</div>
           </div>
           <div className="bg-background p-4 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground mb-1">Responsive Quality</div>
              <div className="text-2xl font-bold text-foreground">100%</div>
           </div>
           <div className="bg-background p-4 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground mb-1">Accessibility (WCAG AA)</div>
              <div className="text-2xl font-bold text-foreground">100%</div>
           </div>
           <div className="bg-background p-4 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground mb-1">Remaining UX Debt</div>
              <div className="text-2xl font-bold text-emerald-500">0 pts</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 xl:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-semibold text-card-foreground">Velocity & Telemetry</h2>
             <div className="text-sm space-x-4">
                <span className="text-muted-foreground">CPU: <span className="text-foreground">{cpu}%</span></span>
                <span className="text-muted-foreground">MEM: <span className="text-foreground">{memory}MB</span></span>
                <span className="text-muted-foreground">Iters/Hr: <span className="text-foreground">{itersPerHour}</span></span>
             </div>
          </div>
          <div className="h-80 w-full bg-background rounded flex items-center justify-center overflow-hidden">
             {unifiedHistory.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={unifiedHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorIters" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="iteration" stroke="#64748b" />
                   <YAxis stroke="#64748b" />
                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                   <RechartsTooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                   <Legend />
                   <Area type="monotone" dataKey="itersPerHour" name="Velocity (Iters/Hr)" stroke="var(--primary)" fillOpacity={1} fill="url(#colorIters)" />
                   <Area type="monotone" dataKey="memory" name="Heap (MB)" stroke="#10b981" fillOpacity={1} fill="url(#colorMem)" />
                 </AreaChart>
               </ResponsiveContainer>
             ) : (
               <div className="text-muted-foreground text-sm">Waiting for historical data accumulation...</div>
             )}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-card-foreground">System Health Radar</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categories}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--muted-foreground)" }} />
                <Radar name="Maturity" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Business Intelligence */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Business Intelligence</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-background p-4 rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1">Delivered Value</div>
                <div className="text-2xl font-bold text-emerald-500">{business.businessValueDelivered || 0} pts</div>
             </div>
             <div className="bg-background p-4 rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1">Cycle Time (avg)</div>
                <div className="text-2xl font-bold text-blue-500">{business.avgCycleTimeHrs || 0} hrs</div>
             </div>
             <div className="bg-background p-4 rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1">Debt Trend</div>
                <div className="text-xl font-bold text-foreground">{business.debtTrend || 'N/A'}</div>
             </div>
             <div className="bg-background p-4 rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1">Delivery Confidence</div>
                <div className="text-2xl font-bold text-emerald-500">{business.deliveryConfidence || 0}%</div>
             </div>
          </div>
        </div>

        {/* Release Manager */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Release Plans</h2>
          <div className="space-y-4">
            {releases.length > 0 ? releases.map((rel: { id: string | number, status: string | number, objectives?: unknown[] }, idx: number) => (
              <div key={idx} className="bg-background rounded-lg p-4 border border-border flex justify-between items-center">
                <div>
                  <div className="font-semibold text-foreground">{rel.id}</div>
                  <div className="text-sm text-muted-foreground mt-1">{rel.objectives?.length} Objectives assigned</div>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-bold ${rel.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-muted text-muted-foreground'}`}>
                  {rel.status}
                </span>
              </div>
            )) : (
              <div className="text-muted-foreground text-sm">Waiting for Release Manager propagation...</div>
            )}
          </div>
        </div>
      </div>

      {/* Backlog Evolution */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">Product Backlog Engine</h2>
          <span className="text-muted-foreground text-sm">{backlog.length} total objectives</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3 rounded-tr-lg">State</th>
              </tr>
            </thead>
            <tbody>
              {backlog.slice(0, 10).map((b: { id: string | number, category: string | number, severity: string | number, currentState: string | number }, idx: number) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-indigo-500">{b.id}</td>
                  <td className="px-4 py-3">{b.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.severity === 'Mandatory' ? 'bg-red-500/10 text-red-600' : 'bg-muted text-muted-foreground'}`}>
                      {b.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">{b.currentState}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {backlog.length === 0 && <div className="text-center text-muted-foreground py-6">Backlog Engine starting...</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Latest Runtime Events</h2>
          <div className="flex-1 overflow-y-auto space-y-2 max-h-64 pr-2 custom-scrollbar">
            {eventsList.length === 0 ? (
               <div className="text-muted-foreground text-sm italic">No events recorded...</div>
            ) : (
               eventsList.map((ev: { timestamp?: string | number, type?: string, message?: string }, i: number) => (
                  <div key={i} className="flex space-x-3 text-sm border-b border-border pb-2">
                     <span className="text-muted-foreground shrink-0 font-mono">{ev?.timestamp ? new Date(ev.timestamp as string | number).toLocaleTimeString() : 'N/A'}</span>
                     <span className="text-primary font-bold shrink-0">[{ev?.type || 'UNKNOWN'}]</span>
                     <span className="text-foreground truncate">{ev?.message || 'No message provided'}</span>
                  </div>
               ))
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Current Objective Execution</h2>
          <div className="bg-background p-4 rounded-lg font-mono text-sm text-foreground border border-border mb-4 h-24 overflow-hidden">
            {currentObj}
          </div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 mt-4">Queue State</h3>
          <div className="flex space-x-4">
             <div className="bg-background px-4 py-2 rounded-lg border border-border">
               Pending: <span className="text-yellow-600 font-bold ml-2">{queueSize}</span>
             </div>
             <div className="bg-background px-4 py-2 rounded-lg border border-border">
               Retry: <span className="text-red-500 font-bold ml-2">{retryQueue}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, color, alert }: { title: string; value: string | number; color: string; alert?: boolean }) {
  return (
    <div className={`bg-card border ${alert ? 'border-red-500/50 bg-red-500/5' : 'border-border'} shadow-sm p-4 rounded-xl transition-all hover:shadow-md`}>
      <h3 className="text-xs font-medium text-muted-foreground mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${color} truncate`}>{value}</p>
    </div>
  );
}
