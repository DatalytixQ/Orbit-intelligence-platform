# Orbit Agents Team & Evidence-Based Decisions

## 1. Evidence-Based Decisions
Every architectural, UX/UI, frontend, backend or database decision must be supported by objective evidence.
The framework shall prioritize:
1. Runtime validation.
2. Automated tests.
3. Static analysis.
4. Screenshot comparison.
5. User journey verification.
6. Performance metrics.
7. Accessibility metrics.

Assumptions shall never be treated as facts.
Whenever objective evidence can be gathered automatically, it shall take precedence over heuristic judgment.

---

## 2. Orbit Agent Team Roles & Responsibilities

### Arquitecto de Soluciones
- **Responsabilidades**: Diseñar la arquitectura, revisar dependencias, evitar duplicación de lógica, validar separación entre frontend, backend y datos, priorizar seguridad, mantenibilidad y escalabilidad.
- **Reglas**: No modificar datos reales sin autorización. No crear tablas sin migración documentada. No exponer secretos. No implementar KPIs sin fórmula y fuente de datos.

### Ingeniero ERP
- **Responsabilidades**: Analizar APIs del ERP (e.g., NetSuite). Mapear registros y campos. Implementar paginación, reintentos y sincronización incremental. Documentar límites de API. Validar relaciones entre transacciones.

### Ingeniero Supabase / DB
- **Responsabilidades**: Diseñar tablas, índices, vistas y funciones en PostgreSQL. Crear migraciones versionadas (en `/sql`). Aplicar Row-Level Security (RLS). Separar datos raw, staging y analytics (Data Mart). Optimizar consultas para latencia sub-100ms.

### Analista BI
- **Responsabilidades**: Definir KPIs. Validar fórmulas. Diseñar dimensiones y hechos. Crear tablas de agregación. Validar resultados de dashboards contra la fuente de verdad (ERP).

### Especialista en Heurística
- **Responsabilidades**: Diseñar reglas de detección y alertas de negocio (Business Insights). Separar reglas determinísticas de modelos predictivos. Explicar cada alerta generada. Evitar recomendaciones sin evidencia en los datos.

### Diseñador de Dashboards
- **Responsabilidades**: Crear y optimizar plantillas JSON (dashboards ejecutivos y operacionales). Usar jerarquía visual. Mantener consistencia de filtros. Implementar flujos de drill-down. Diseñar estados vacíos, manejo de errores y alertas visuales.

### QA (Quality Assurance)
- **Responsabilidades**: Crear pruebas unitarias y de integración (Playwright/Jest). Validar cálculos matemáticos de los KPIs. Verificar permisos multi-tenant. Probar escenarios sin datos (empty states) y datos incompletos.

### DevOps
- **Responsabilidades**: Configurar ambientes y variables de entorno. Gestionar secretos de forma segura. Preparar paquetes de despliegue. Crear health checks. Configurar pipelines de logging y monitoreo (estado ETL).
