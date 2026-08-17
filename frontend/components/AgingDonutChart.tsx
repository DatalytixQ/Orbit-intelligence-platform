type AgingDonutProps = {
    current: number;
    overdue1_30: number;
    overdue31_90: number;
    overdue90: number;
    total: number;
};

export default function AgingDonutChart({
    current,
    overdue1_30,
    overdue31_90,
    overdue90,
    total,
}: AgingDonutProps) {

    const pct = (v: number) => total > 0 ? (v / total) * 100 : 0;

    const c = pct(current);
    const a = pct(overdue1_30);
    const b = pct(overdue31_90);
    const d = pct(overdue90);

    const style = {
        background: `conic-gradient(
      #22c55e 0 ${c}%,
      #f59e0b ${c}% ${c + a}%,
      #f97316 ${c + a}% ${c + a + b}%,
      #ef4444 ${c + a + b}% 100%
    )`,
    };

    return (
        <div className="flex items-center gap-6">

            <div className="relative h-44 w-44 rounded-full" style={style}>
                <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-card">
                    <p className="text-xs text-muted-foreground">Cartera vencida</p>
                    <p className="text-2xl font-bold text-foreground">
                        {(100 - c).toFixed(0)}%
                    </p>
                </div>
            </div>

            <div className="text-sm space-y-2">
                <Legend label="No vencido" value={current} color="bg-green-500" />
                <Legend label="1-30 días" value={overdue1_30} color="bg-amber-500" />
                <Legend label="31-90 días" value={overdue31_90} color="bg-orange-500" />
                <Legend label="+90 días" value={overdue90} color="bg-red-500" />
            </div>

        </div>
    );
}

function Legend({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="flex items-center gap-2 text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${color}`} />
                {label}
            </span>
            <span className="font-semibold">$ {value.toFixed(1)}M</span>
        </div>
    );
}