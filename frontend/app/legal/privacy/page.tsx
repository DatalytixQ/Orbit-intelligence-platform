"use client";

import React from "react";
import AppShell from "@/components/layout/AppShell";

export default function PrivacyPolicyPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-12 bg-white dark:bg-slate-900 shadow-sm rounded-2xl my-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          POLÍTICA DE PRIVACIDAD – DATALYTIX QUEST
        </h1>
        <p className="text-sm text-slate-500 mb-8">Última actualización: [FECHA]</p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h3>1. Introducción</h3>
          <p>
            Datalytix Quest (“nosotros”, “nuestro”, “la Empresa”) respeta su privacidad y se compromete a proteger sus datos personales. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos su información cuando visita nuestro sitio web o utiliza nuestros Servicios SaaS, agentes de IA y automatizaciones.
          </p>

          <h3>2. Responsable del tratamiento y contacto</h3>
          <p>
            <strong>Responsable:</strong> Datalytix Quest<br/>
            <strong>Dirección:</strong> [DIRECCIÓN COMPLETA], Santiago, Chile<br/>
            <strong>Email de privacidad:</strong> privacy@datalytixquest.com
          </p>
          <p>
            Para efectos de la Ley 21.719 de Protección de Datos Personales (Chile) y GDPR, Datalytix Quest actúa como Responsable del tratamiento de datos de visitantes y como Encargado del tratamiento (procesador) respecto de los datos personales que nuestros clientes nos entregan en los Servicios SaaS.
          </p>

          <h3>3. Datos que recopilamos</h3>
          <p>
            <strong>Datos proporcionados por usted:</strong> Nombre, correo, empresa, datos de pago y facturación. Además, recopilamos los datos operacionales, archivos, prompts y configuraciones que introduzca en la plataforma.<br/>
            <strong>Datos automáticos:</strong> Telemetría, dirección IP, tipo de navegador, fechas de acceso, errores y cookies.
          </p>

          <h3>4. Finalidades y bases legales del tratamiento</h3>
          <p>
            Utilizamos sus datos personales para:<br/>
            - Proveer funcionalidades solicitadas y ejecutar el contrato.<br/>
            - Procesar pagos.<br/>
            - Analizar patrones de uso y corregir errores (interés legítimo).<br/>
            - Responder soporte (ejecución del contrato).
          </p>

          <h3>5. Compartición de datos</h3>
          <p>
            No vendemos sus datos personales. Compartimos información solo con proveedores de infraestructura cloud (ej. AWS, GCP), procesadores de pagos (Stripe), servicios transaccionales (SendGrid) y herramientas de monitoreo. Estos terceros actúan como encargados del tratamiento bajo estrictas instrucciones de confidencialidad.
          </p>

          <h3>6. Transferencias internacionales de datos</h3>
          <p>
            Sus datos pueden ser transferidos y procesados en países distintos al suyo. Implementamos salvaguardas apropiadas como Cláusulas Contractuales Estándar (SCC) cuando aplican.
          </p>

          <h3>7. Retención de datos</h3>
          <p>
            Conservamos sus datos solo mientras sea necesario. Al eliminar su cuenta, eliminaremos o anonimizaremos sus datos personales en un plazo de [30/60/90] días, salvo que exista obligación legal de conservarlos.
          </p>

          <h3>8. Sus derechos</h3>
          <p>
            Dependiendo de su ubicación (Chile, UE, etc.), tiene derecho a: Acceso, Rectificación, Eliminación, Limitación del tratamiento, Portabilidad, y Oposición. <br/>
            Para ejercer sus derechos, envíe un correo a <strong>privacy@datalytixquest.com</strong>. Responderemos en los plazos legales aplicables (ej. 30 días bajo Ley 21.719 en Chile).
          </p>

          <h3>9. Seguridad de los datos</h3>
          <p>
            Implementamos medidas técnicas y organizativas como cifrado en tránsito (TLS) y en reposo (AES-256), controles de acceso y monitoreo. Ningún sistema es 100% seguro.
          </p>

          <h3>10. Menores de edad</h3>
          <p>
            Nuestros Servicios no están dirigidos a menores de edad y no recopilamos intencionalmente sus datos.
          </p>

          <h3>11. Cambios a esta Política</h3>
          <p>
            Podemos actualizar esta Política notificando mediante nuestro sitio web o por correo electrónico.
          </p>

        </div>
      </div>
    </AppShell>
  );
}
