"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";

type Props = {
    data: {
        customer_name: string;
        participation_pct: number;
        customer_sales_ars?: number;
    }[];
};

function shortenName(value: string) {
    if (!value) return "-";
    return value.length > 22 ? `${value.slice(0, 22)}…` : value;
}

function formatCompactCurrency(value?: number) {
    if (value === undefined || value === null || Number.isNaN(value)) return "-";

    if (Math.abs(value) >= 1_000_000) {
        return `$ ${(value / 1_000_000).toFixed(1)} M`;
    }

    if (Math.abs(value) >= 1_000) {
        return `$ ${(value / 1_000).toFixed(0)} K`;
    }

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);
}

function buildChartData(
    data: {
        customer_name: string;
        participation_pct: number;
        customer_sales_ars?: number;
    }[]
) {
    return [...data]
        .map((item) => ({
            ...item,
            customer_name_short: shortenName(item.customer_name),
            participation_label: `${Number(item.participation_pct ?? 0).toFixed(2)}%`,
        }))
        .sort((a, b) => Number(b.participation_pct) - Number(a.participation_pct));
}

export default function TopCustomersBarChart({ data }: Props) {
    const chartData = buildChartData(data);

    if (!chartData.length) {
        return (
            <div className="flex h-[170px] items-center justify-center text-sm text-muted-foreground">
                Sin datos para mostrar
            </div>
        );
    }

    const maxValue = Math.max(...chartData.map((item) => Number(item.participation_pct || 0)));
    const domainMax = Math.max(5, Math.ceil(maxValue + 0.6));

    return (
        <div className="h-[170px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 6, right: 28, left: 8, bottom: 0 }}
                    barCategoryGap={10}
                >
                    <XAxis
                        type="number"
                        domain={[0, domainMax]}
                        tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        type="category"
                        dataKey="customer_name_short"
                        width={105}
                        tick={{ fontSize: 10, fill: "#475569" }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any, _name: any, payload: any) => {
                            const row = payload?.payload as
                                | { participation_pct: number; customer_sales_ars?: number }
                                | undefined;

                            return [
                                `${Number(value).toFixed(2)}% · ${formatCompactCurrency(row?.customer_sales_ars)}`,
                                "Participación",
                            ];
                        }}
                        labelFormatter={(_label, payload) => {
                            const row = payload?.[0]?.payload as { customer_name?: string } | undefined;
                            return row?.customer_name ?? "";
                        }}
                    />

                    <Bar
                        dataKey="participation_pct"
                        fill="#2563EB"
                        radius={[4, 4, 4, 4]}
                        barSize={18}
                    >
                        <LabelList
                            dataKey="participation_label"
                            position="right"
                            style={{ fill: "#0f172a", fontSize: 10, fontWeight: 600 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}