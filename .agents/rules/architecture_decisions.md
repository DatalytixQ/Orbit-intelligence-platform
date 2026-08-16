# Arquitectura y Decisiones de Negocio (Orbit ERP Intelligence)

Este documento es el repositorio central de aprendizaje y decisiones arquitectónicas de la plataforma. **Cualquier agente que trabaje en el modelado de datos, ETL o visualización DEBE respetar estas definiciones.**

## 1. Costos y Rentabilidad (COGS)
En una solución conectada a un ERP (especialmente NetSuite), la confianza de Finanzas y Controllers depende de la precisión de los costos. Queda estrictamente prohibido mezclar o confundir costo estimado con costo contable.
- **Estimated Cost (`estimated_cogs`)**: Proviene de la línea de la transacción en el momento de la venta (ej. `costestimate` en NetSuite) o de multiplicar la cantidad por el costo estándar actual del maestro de artículos.
- **Actual Cost (`actual_cogs`)**: Es el costo real que impactó en contabilidad (GL Impact). En implementaciones maduras, se cruza la venta con el diario contable (GL) del Item Fulfillment o proceso de costeo.
- **Gross Profit**: Siempre deben existir dos métricas en el Data Mart: `estimated_gross_profit` (para uso comercial rápido/comisiones) y `actual_gross_profit` (para conciliación financiera).

## 2. Jerarquías (Subsidiarias, Clases, Departamentos)
NetSuite y otros ERPs manejan entidades en formato de árbol (parent/child).
- **Prohibición de filtros planos rígidos**: Los filtros en la aplicación nunca deben ser un simple `WHERE id = X` si la entidad tiene jerarquía. Deben resolverse incluyendo a todos los descendientes (ej. usando funciones recursivas como `get_subsidiary_tree()`).
- **Consolidadora Dinámica**: Nunca quemar en código el ID de la empresa consolidadora (ej. `vonderk`). La raíz del árbol siempre se detecta dinámicamente como el nodo donde `parent_id IS NULL`.

## 3. Forecast / Presupuestos
- No todos los clientes tienen el módulo de presupuestos configurado en su ERP.
- La visualización de "Trends" o comparativas YoY siempre debe estar preparada para graficar una tercera línea de "Forecast".
- Si el ERP no lo provee, se debe utilizar la tabla nativa de Orbit (`app_sales_forecast`) para que los clientes puedan cargarlo manualmente desde la aplicación.

## 4. UI/UX de Dashboards Ejecutivos
- **No Operatividad**: Las tablas de transacciones crudas no deben ser pestañas principales. Se ocultan en Drawers/Modales secundarios ("Ver Transacciones") diseñados para auditoría puntual.
- **Comparatividad Obligatoria**: Un número aislado no dice nada. Todo KPI principal o gráfico de evolución debe tener contexto (Variación YoY, Variación vs Mes Anterior, Variación vs Forecast).
- **Período Default Ejecutivo**: Por defecto, los dashboards comerciales deben abrir mostrando el año vigente (YTD - Year to Date) y no la historia completa, para evitar saturación visual y reflejar la preocupación ejecutiva inmediata.
- **Drill-down Orgánico**: Las agrupaciones (Categorías, Vendedores) siempre deben permitir expansión para llegar al detalle (Producto, Cliente) dentro de la misma visualización (Tablas expandibles).

## 5. Diseño Multi-Tenant y Límites de Datos (Tenant Boundaries)
- La plataforma Orbit es un B2B SaaS. Cada cliente es un tenant.
- **Toda tabla cruda (raw)** extraída de cualquier ERP debe incluir las columnas de auditoría: `source_system`, `client_id`, y `snapshot_ts`.
- Las consultas del Data Mart SIEMPRE deben preservar el `client_id` (o la jerarquía de subsidiarias validada) para asegurar que un usuario nunca pueda ver datos de otra empresa.

## 6. Filosofía ETL y Data Mart
- **ELT sobre ETL**: Extraemos datos de las APIs del ERP en bruto y con transformación mínima (`raw_ns_...`) y cargamos a PostgreSQL. Toda la lógica de negocio (KPIs, joins, renombre de campos) se realiza en la base de datos (capa Data Mart: `dm_...`).
- Esto permite recalcular históricos y cambiar la lógica de negocio instantáneamente sin volver a sincronizar millones de registros por API.

## 7. Internacionalización e Idioma (i18n)
- El idioma del sistema debe respetar la preferencia del usuario (`app_users.language_preference`). Si el usuario no definió preferencia, el sistema hereda la preferencia de la empresa/cliente (`clients.default_language`).
- Todos los textos de frontend y dashboards deben pasar por diccionarios de traducción, evitando textos "quemados" (hardcoded) en español o inglés en el frontend.
