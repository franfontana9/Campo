import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
};

export default function PrivacidadPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        Última actualización: mayo 2026
      </p>
      <h1 className="mt-2">Política de privacidad</h1>
      <p>
        Cómo Campo recolecta, usa y protege tu información. Esta política
        aplica al sitio campo.app y al producto asociado.
      </p>

      <h2>Qué datos recolectamos</h2>
      <ul>
        <li>
          <strong>De cuenta</strong>: nombre, razón social, email, teléfono,
          ubicación. Los proporcionás vos al crear cuenta o editar tu
          perfil.
        </li>
        <li>
          <strong>De uso</strong>: publicaciones que cargás, intereses
          enviados/recibidos, mensajes en hilos.
        </li>
        <li>
          <strong>Técnicos</strong>: IP, user-agent, cookies de sesión.
          Estrictamente para autenticación y seguridad.
        </li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Operar la plataforma (mostrar publicaciones, conectar partes).</li>
        <li>
          Mostrar tu identidad pública a la contraparte cuando hay interés
          mutuo.
        </li>
        <li>Verificar tu cuenta como «Empresa verificada» (manual).</li>
        <li>Mejorar el producto (analítica agregada, no individual).</li>
        <li>Cumplir obligaciones legales.</li>
      </ul>

      <h2>Qué compartimos</h2>
      <p>
        En el perfil público se muestra: razón social, ubicación
        (ciudad/provincia/país) y publicaciones activas. Tu teléfono y email
        se comparten <strong>sólo</strong> con la contraparte cuando hay
        interés aceptado por ambos lados. Nunca vendemos datos.
      </p>

      <h2>Tus derechos</h2>
      <ul>
        <li>Acceder a tus datos.</li>
        <li>Corregirlos o actualizarlos en «Mi perfil».</li>
        <li>
          Eliminar tu cuenta — la baja borra tus publicaciones e intereses
          activos.
        </li>
      </ul>

      <h2>Conservación</h2>
      <p>
        Mantenemos tus datos mientras tengas cuenta activa. Al darte de
        baja, los borramos en 30 días, salvo cuando una obligación legal o
        contractual exige conservarlos por más tiempo.
      </p>

      <h2>Contacto de privacidad</h2>
      <p>
        Para ejercer derechos o reportar un problema:{" "}
        <a href="mailto:privacy@campo.app">privacy@campo.app</a>.
      </p>
    </>
  );
}
