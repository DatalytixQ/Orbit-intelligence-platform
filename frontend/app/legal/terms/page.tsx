"use client";

import React from "react";
import AppShell from "@/components/layout/AppShell";

export default function TermsOfServicePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-12 bg-white dark:bg-slate-900 shadow-sm rounded-2xl my-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          TÉRMINOS DE SERVICIO – DATALYTIX QUEST
        </h1>
        <p className="text-sm text-slate-500 mb-8">Última actualización: [FECHA]</p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h3>1. Introducción y aceptación</h3>
          <p>
            Bienvenido/a a Datalytix Quest (“nosotros”, “nuestro”, “la Empresa”). Estos Términos de
            Servicio (“Términos”) regulan el acceso y uso de nuestro sitio web y nuestros productos y servicios SaaS, plataformas, aplicaciones, APIs, dashboards, agentes de IA, automatizaciones y cualquier otro servicio digital que ofrezcamos (“Servicios”).
          </p>
          <p>
            Al registrarte, acceder o utilizar los Servicios, tú (“Cliente”, “Usuario”, “usted”) aceptas quedar vinculado/a por estos Términos. Si no estás de acuerdo, no utilices los Servicios.
          </p>

          <h3>2. Descripción del servicio</h3>
          <p>
            Datalytix Quest ofrece servicios B2B SaaS y profesionales relacionados con:
            Transformación digital y consultoría tecnológica. Inteligencia operacional, datos y analítica. Automatización de procesos. Inteligencia artificial aplicada.
          </p>

          <h3>3. Elegibilidad y registro de cuenta</h3>
          <p>
            Los Servicios están dirigidos a empresas, organizaciones y profesionales que actúan en el marco de su actividad económica.
            El Cliente es responsable de mantener la confidencialidad de sus credenciales.
          </p>

          <h3>4. Licencia de uso y propiedad intelectual</h3>
          <p>
            Sujeto al cumplimiento de estos Términos y al pago de las tarifas aplicables, otorgamos al Cliente una licencia no exclusiva, intransferible, revocable, no sublicenciable, para usar los Servicios.
            Todos los derechos de propiedad intelectual sobre el código, software, algoritmos, modelos de IA e interfaces pertenecen a Datalytix Quest o a sus licenciantes.
          </p>
          <p>
            El Cliente conserva todos los derechos sobre los datos, documentos y archivos que cargue (“Datos del Cliente”).
          </p>

          <h3>5. Uso aceptable y restricciones</h3>
          <p>
            Queda prohibido, entre otros: Acceder o intentar acceder a los Servicios mediante medios distintos a las interfaces y APIs proporcionadas. Realizar ingeniería inversa. Usar los Servicios para actividades ilegales. Sobrecargar la infraestructura.
          </p>
          <p>
            <strong>IA y contenido generado:</strong> El Cliente es responsable del contenido que introduzca como input y del uso que dé a los outputs generados por la IA.
          </p>

          <h3>6. Pagos, suscripciones y renovación</h3>
          <p>
            Las tarifas aplicables son las indicadas en la propuesta comercial u orden de servicio. Los Servicios se facturan por adelantado. Las suscripciones se renuevan automáticamente por el mismo periodo salvo cancelación.
          </p>

          <h3>7. Nivel de servicio (SLA) y disponibilidad</h3>
          <p>
            Para los planes que incluyan SLA, nos comprometemos a un objetivo de disponibilidad mensual para los Servicios principales.
          </p>

          <h3>8. Privacidad y protección de datos</h3>
          <p>
            El tratamiento de datos personales se rige por nuestra Política de Privacidad. Datalytix Quest puede actuar como encargado del tratamiento (procesador) respecto de los datos personales que el Cliente nos entregue para ser procesados.
          </p>

          <h3>9. Seguridad</h3>
          <p>
            Implementamos medidas técnicas y organizativas razonables para proteger los Servicios y los Datos del Cliente, incluyendo cifrado en tránsito y en reposo.
          </p>

          <h3>10. Modificaciones a los Servicios y a los Términos</h3>
          <p>
            Podemos actualizar estos Términos. Los cambios materiales se notificarán con antelación razonable.
          </p>

          <h3>11. Duración y terminación</h3>
          <p>
            Podemos suspender o terminar los Servicios si el Cliente incumple estos Términos y no remedia en un plazo razonable tras notificación, o si existe riesgo de seguridad.
          </p>

          <h3>12. Limitación de responsabilidad</h3>
          <p>
            Los Servicios se prestan “tal cual”. En la máxima medida permitida por la ley, Datalytix Quest no será responsable por daños indirectos, incidentales, o lucro cesante.
          </p>

          <h3>13. Ley aplicable y jurisdicción</h3>
          <p>
            Estos Términos se rigen por las leyes de la República de Chile. Cualquier controversia se someterá a los tribunales competentes de Santiago, Chile.
          </p>

          <br/>
          <p className="text-sm text-slate-500">
            Para cuestiones relacionadas con estos Términos: <br/>
            Email: legal@datalytixquest.com <br/>
            Dirección: [DIRECCIÓN COMPLETA DE DATALYTIX QUEST]
          </p>
        </div>
      </div>
    </AppShell>
  );
}
