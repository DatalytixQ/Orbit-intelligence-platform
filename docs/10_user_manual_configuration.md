# Manual de Usuario: Configuración Multi-Tenant, Usuarios, Roles y Áreas

Este manual detalla el proceso para administrar la plataforma de manera segura, operando bajo un entorno **Multi-Tenant (Múltiples Clientes aislados)** y un framework robusto de control de accesos (RBAC).

## 1. Conceptos Base

*   **Tenant (Cliente)**: Cada cuenta en la plataforma opera como un "Tenant" único (identificado por \`client_id\`). Absolutamente todos los datos (ventas, finanzas, supply chain) están estrictamente particionados. Los usuarios de un Tenant no pueden bajo ninguna circunstancia acceder o visualizar datos de otro Tenant.
*   **Usuarios (Users)**: Individuos que acceden a la plataforma usando sus credenciales.
*   **Roles**: Conjunto de permisos asignados a un usuario que define **qué acciones** puede realizar en la plataforma (ej. Administrador, Ejecutivo de Ventas).
*   **Áreas (Workspaces)**: Segmentación lógica de las vistas analíticas dentro de la plataforma (ej. Área de Finanzas, Área de Ventas, Área de Supply Chain).

---

## 2. Configuración de Usuarios

### Creación de un Nuevo Usuario
1.  Navega al panel de **Administración** -> **Usuarios**.
2.  Haz clic en el botón **"Nuevo Usuario"**.
3.  Completa la siguiente información:
    *   **Nombre Completo**: Nombre visible en la plataforma.
    *   **Email**: Dirección de correo electrónico y credencial de inicio de sesión.
    *   **Contraseña Provisional**: Asignar una clave temporal. El sistema obligará al usuario a cambiarla tras el primer inicio de sesión por motivos de seguridad.
    *   **Rol**: Seleccionar el nivel de autorización correspondiente (ver sección de Roles).
4.  **Confirmación de Tenant**: Por seguridad, el usuario creado quedará automáticamente vinculado al mismo \`client_id\` del administrador que lo está creando.

### Edición y Desactivación
*   **Editar**: Permite modificar el Rol o el nombre del usuario. No se puede modificar el Email.
*   **Desactivar**: (Botón de estado *Activo/Inactivo*). Al marcar a un usuario como *Inactivo*, se revoca su token inmediatamente y no podrá iniciar sesión. **No se eliminan registros de la base de datos** para preservar la auditoría histórica de sus acciones.

---

## 3. Sistema de Roles (RBAC)

La plataforma provee roles predeterminados que dictan el nivel de control y las vistas disponibles:

*   **Administrador Global**: Control total sobre el sistema, incluyendo facturación, auditorías transversales y configuración estructural (Generalmente restringido al equipo de soporte de la plataforma).
*   **Administrador de Tenant (Admin)**: Máxima autoridad dentro del cliente (`client_id`). Puede crear, editar y desactivar usuarios, modificar configuraciones de negocio y acceder a todos los Workspaces.
*   **Ejecutivo C-Level**: Acceso de solo lectura a métricas de alto nivel en todas las Áreas (Ventas, Finanzas, Supply). Puede tomar decisiones y disparar flujos, pero no configurar políticas.
*   **Analista de Ventas / Finanzas / Supply**: Acceso acotado exclusivamente al Área o Workspace correspondiente a su función.

---

## 4. Configuración de Áreas (Workspaces)

Las Áreas de trabajo permiten segmentar la interfaz de usuario para que cada persona vea solo lo relevante para su trabajo.

### Asignación de Accesos a Áreas
El acceso a un área específica (ej. *Ventas* o *Supply Chain*) se define al momento de asignar el Rol del usuario, pero puede refinarse mediante **Permisos Específicos** en el panel de configuración:

1.  Ve a **Administración** -> **Roles y Permisos**.
2.  Selecciona el usuario que deseas configurar.
3.  Habilita o deshabilita los accesos a los distintos módulos:
    *   \[x] Módulo Comercial (Ventas por Representante, Top Clientes).
    *   \[x] Módulo Financiero (DSO, Cuentas por Cobrar).
    *   \[ ] Módulo Supply Chain (Network Graph, Inventario).

### Personalización de Políticas por Área
Para garantizar que las alertas y semáforos de riesgo estén alineados con la realidad de tu empresa:
1.  Ve a **Configuración** -> **Business Policies**.
2.  Selecciona el área que deseas ajustar (ej. *Finanzas*).
3.  Modifica el umbral (ej. *Cambiar "DSO_RISK_THRESHOLD" de 45 días a 60 días*).
4.  **Impacto**: Esto recalculará instantáneamente la severidad (Crítico, Alerta, Normal) en todos los tableros del Área seleccionada.
