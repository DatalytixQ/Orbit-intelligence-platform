/**
 * DQ Orbit — Drill Engine
 * 
 * Declarative drill-down and drill-through configuration.
 * No widget-specific logic — the engine interprets config objects.
 * 
 * Drill-Down: Año → Mes → Semana → Día → Factura
 * Drill-Through: Ventas → Cliente → Factura → Agente IA → "Explícame anomalías"
 */

export type DrillLevel = {
  dimension: string;      // e.g., "anio", "mes", "semana", "dia", "factura"
  label: string;          // Human-readable: "Año", "Mes", "Semana"
  aggregation?: string;   // SQL aggregation hint: "SUM", "COUNT", "AVG"
};

export type DrillConfig = {
  dimension: string;      // Root dimension name (e.g., "fecha", "geografia")
  levels: DrillLevel[];   // Ordered from top to bottom
};

export type DrillThroughTarget = {
  type: "route" | "widget" | "ai";
  route?: string;         // For type="route": Next.js route path
  widgetId?: string;      // For type="widget": target widget in same dashboard
  aiPrompt?: string;      // For type="ai": template prompt for DQBot
  params?: Record<string, string>; // Parameters to pass
};

export type DrillThroughConfig = {
  sourceWidget: string;   // Widget ID that triggers the drill-through
  targetField: string;    // Field in the source data that triggers
  targets: DrillThroughTarget[];
};

// Pre-built drill configurations for common dimensions
export const DRILL_CONFIGS: Record<string, DrillConfig> = {
  fecha: {
    dimension: "fecha",
    levels: [
      { dimension: "anio", label: "Año" },
      { dimension: "trimestre", label: "Trimestre" },
      { dimension: "mes", label: "Mes" },
      { dimension: "semana", label: "Semana" },
      { dimension: "dia", label: "Día" },
    ],
  },
  geografia: {
    dimension: "geografia",
    levels: [
      { dimension: "pais", label: "País" },
      { dimension: "region", label: "Región" },
      { dimension: "ciudad", label: "Ciudad" },
      { dimension: "sucursal", label: "Sucursal" },
    ],
  },
  producto: {
    dimension: "producto",
    levels: [
      { dimension: "categoria", label: "Categoría" },
      { dimension: "subcategoria", label: "Sub-categoría" },
      { dimension: "item", label: "Producto" },
      { dimension: "sku", label: "SKU" },
    ],
  },
  cliente: {
    dimension: "cliente",
    levels: [
      { dimension: "segmento", label: "Segmento" },
      { dimension: "cliente", label: "Cliente" },
      { dimension: "orden", label: "Orden de Venta" },
      { dimension: "factura", label: "Factura" },
    ],
  },
};

/**
 * Get the next drill level given a config and current depth.
 * Returns null if already at the deepest level.
 */
export function getNextDrillLevel(config: DrillConfig, currentDepth: number): DrillLevel | null {
  if (currentDepth >= config.levels.length - 1) return null;
  return config.levels[currentDepth + 1];
}

/**
 * Get the drill breadcrumb path for display.
 */
export function getDrillBreadcrumb(
  config: DrillConfig,
  activeValues: { dimension: string; value: string; label: string }[]
): { dimension: string; label: string; value: string }[] {
  return activeValues.map((v) => {
    const level = config.levels.find((l) => l.dimension === v.dimension);
    return {
      dimension: v.dimension,
      label: level?.label || v.dimension,
      value: v.label,
    };
  });
}

/**
 * Build a drill-through prompt for the AI panel.
 * Example: "Explícame las anomalías de ventas para el cliente ACME Corp en Marzo 2026"
 */
export function buildDrillThroughAiPrompt(
  target: DrillThroughTarget,
  context: Record<string, string>
): string {
  let prompt = target.aiPrompt || "Analiza los datos seleccionados";
  
  // Replace template variables: {{customer_name}}, {{period}}, etc.
  Object.entries(context).forEach(([key, value]) => {
    prompt = prompt.replace(new RegExp(`{{${key}}}`, "g"), value);
  });
  
  return prompt;
}
