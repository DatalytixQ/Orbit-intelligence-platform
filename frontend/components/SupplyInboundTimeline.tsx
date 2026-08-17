"use client";



type InboundItem = {
  item_id: string;
  item_name?: string;
  inbound_qty: string | number;
  next_expected_date: string;
  is_critical?: boolean;
};

export default function SupplyInboundTimeline({ data }: { data: InboundItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No hay embarques en tránsito registrados</p>
      </div>
    );
  }

  const isFallback = data.length > 0 && !data[0].is_critical;

  const formatNumber = (val: number) => new Intl.NumberFormat('es-AR').format(val);
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  };

  return (
    <div className="flex flex-col h-full">
      {isFallback && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <p className="text-sm font-medium text-emerald-800">Quiebres críticos cubiertos</p>
            <p className="text-xs text-emerald-700 mt-0.5">Mostrando los próximos ingresos regulares al inventario.</p>
          </div>
        </div>
      )}
      <div className="overflow-y-auto h-full pr-2 space-y-3">
        {data.map((item, idx) => {
        const title = item.item_name || `Item ${item.item_id || 'Desconocido'}`;
        return (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-10 w-10 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground line-clamp-1">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Llegada estimada: {formatDate(item.next_expected_date)}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                +{formatNumber(Number(item.inbound_qty))} un.
              </span>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
