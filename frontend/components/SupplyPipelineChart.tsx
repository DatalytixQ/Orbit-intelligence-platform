"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type SupplyData = {
  item_id: number;
  item_name: string;
  deliverable_revenue: number;
  revenue_at_supply_risk: number;
};

export default function SupplyPipelineChart({ data }: { data: (SupplyData & { expected_ship_date?: string })[] }) {
  // We will group data chronologically
  // Since we want chronological order, we can sort the original data dates first or rely on the fact that we can parse the month string,
  // but it's easier to sort the raw data first, then group it.
  
  // Sort raw data by date
  const sortedRawData = [...(data || [])].sort((a, b) => {
    if (!a.expected_ship_date) return 1;
    if (!b.expected_ship_date) return -1;
    return new Date(a.expected_ship_date).getTime() - new Date(b.expected_ship_date).getTime();
  });

  // Use actual current date for "Backlog" calculation, so we don't merge future months when projecting
  const realToday = new Date();
  realToday.setHours(0, 0, 0, 0);

  const orderedGroupedData = sortedRawData.reduce((acc: Record<string, { Entregable: number, EnRiesgo: number, isVencidas?: boolean }>, curr) => {
    if (!curr.expected_ship_date) return acc;
    const date = new Date(curr.expected_ship_date);
    const isPast = date.getTime() < realToday.getTime();
    
    let formattedKey = "";
    if (isPast) {
      formattedKey = "Backlog";
    } else {
      const monthKey = new Intl.DateTimeFormat('es-AR', { month: 'short', year: '2-digit' }).format(date);
      formattedKey = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);
    }

    if (!acc[formattedKey]) {
      acc[formattedKey] = { Entregable: 0, EnRiesgo: 0, isVencidas: isPast };
    }
    
    acc[formattedKey].Entregable += Number(curr.deliverable_revenue) || 0;
    acc[formattedKey].EnRiesgo += Number(curr.revenue_at_supply_risk) || 0;
    
    return acc;
  }, {});

  // Sort so "Backlog" is first, then the rest chronologically
  const chartData = Object.entries(orderedGroupedData)
    .map(([name, values]) => ({
      name,
      ...values
    }))
    .sort((a, b) => {
      if (a.isVencidas) return -1;
      if (b.isVencidas) return 1;
      return 0; // The rest is already sorted chronologically by the raw data sort
    });

  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return "0";
    if (tickItem >= 1000000) return `$${(tickItem / 1000000).toFixed(1)}M`;
    return `$${(tickItem / 1000).toFixed(0)}k`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#64748b' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <YAxis 
          tickFormatter={formatYAxis} 
          tick={{ fontSize: 12, fill: '#64748b' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          formatter={(value: unknown) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(value) || 0)}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar dataKey="Entregable" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
        <Bar dataKey="EnRiesgo" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
