"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

type SalesCategoryItem = {
    item_class: string;
    month: string;
    sales_net_amount: number;
};

type Props = {
    data: SalesCategoryItem[];
};

function formatMonth(value: string) {
    const [year, month] = value.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("es-AR", {
        month: "short",
        year: "2-digit",
    });
}

function formatCompactNumber(value: number) {
    if (Math.abs(value) >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)} M`;
    }

    if (Math.abs(value) >= 1_000) {
        return `${(value / 1_000).toFixed(0)} K`;
    }

    return `${value}`;
}

function buildChartData(data: SalesCategoryItem[]) {
    // 1. Calculate total sales per category across all time to find the top ones
    const categoryTotals = new Map<string, number>();
    for (const row of data) {
        const cat = row.item_class || "Sin categoría";
        categoryTotals.set(cat, (categoryTotals.get(cat) || 0) + Number(row.sales_net_amount ?? 0));
    }

    // 2. Identify Top 3 categories, the rest will be "Otros"
    const sortedCategories = Array.from(categoryTotals.entries())
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
        
    const topCategories = new Set(sortedCategories.slice(0, 3));

    // 3. Group data by month
    const grouped = new Map<string, Record<string, string | number>>();
    for (const row of data) {
        const month = row.month;
        const originalCategory = row.item_class || "Sin categoría";
        const category = topCategories.has(originalCategory) ? originalCategory : "Otros";

        if (!grouped.has(month)) {
            grouped.set(month, { month });
        }

        const current = grouped.get(month)!;
        current[category] = (Number(current[category]) || 0) + Number(row.sales_net_amount ?? 0);
    }

    const finalData = Array.from(grouped.values()).sort((a, b) =>
        String(a.month).localeCompare(String(b.month))
    );

    return { 
      chartData: finalData, 
      categories: Array.from(topCategories).concat(sortedCategories.length > 3 ? ["Otros"] : []) 
    };
}

// Premium Slate/Indigo palette to reduce visual noise
const COLORS = [
    "#4F46E5", // Indigo 600 (Primary)
    "#0EA5E9", // Sky 500 (Secondary)
    "#F59E0B", // Amber 500 (Tertiary)
    "#CBD5E1", // Slate 300 (Otros)
];

export default function SalesCategoryChart({ data }: Props) {
    if (!data?.length) {
        return (
            <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                Sin datos para mostrar
            </div>
        );
    }

    const { chartData, categories } = buildChartData(data);

    return (
        <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 16, right: 8, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickFormatter={formatMonth}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={(value) => formatCompactNumber(Number(value))}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        width={55}
                    />
                    <Tooltip
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any, name: any) => [
                            new Intl.NumberFormat("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                maximumFractionDigits: 0,
                            }).format(Number(value)),
                            name,
                        ]}
                        labelFormatter={(label) => formatMonth(String(label))}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    {categories.map((category, index) => (
                        <Bar
                            key={category}
                            dataKey={category}
                            stackId="salesByCategory"
                            fill={COLORS[index % COLORS.length]}
                            radius={index === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}