"use client";

type HealthDimension = {
  dimension: string;
  score: number;
};

type HealthScoreData = {
  overall_score: number;
  health_band: 'Optimal' | 'Warning' | 'Critical';
  dimensions: HealthDimension[];
  as_of?: string;
};

export default function BusinessHealthScore({ data }: { data: HealthScoreData | null }) {
  if (!data) return null;

  const getBandColor = (band: string) => {
    switch(band) {
      case 'Optimal': return 'text-emerald-600 bg-emerald-500/10 border-emerald-200/50';
      case 'Warning': return 'text-amber-600 bg-amber-500/10 border-amber-200/50';
      case 'Critical': return 'text-rose-600 bg-rose-500/10 border-rose-200/50';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className={`p-6 rounded-xl border shadow-sm ${getBandColor(data.health_band)}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">Business Health Score</h2>
          <p className="text-sm text-muted-foreground mt-1">Salud Integral del Negocio</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black">{data.overall_score}</span>
          <span className="text-lg font-medium text-muted-foreground">/100</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.dimensions.map((dim, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>{dim.dimension}</span>
              <span>{dim.score}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getProgressColor(dim.score)}`} 
                style={{ width: `${dim.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
