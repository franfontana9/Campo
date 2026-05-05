import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones",
};

export default function TerminosPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        Última actualización: mayo 2026
      </p>
      <h1 className="mt-2">Términos y condiciones</h1>
      <p>
        Estos términos rigen el uso de Campo (campo.app), el marketplace
        global de granos físicos. Al crear una cuenta o usar el sitio,
        aceptás lo que sigue. Esta es una versión MVP — los términos
        pueden actualizarse y se notificará en caso de cambios materiales.
      </p>

      <h2>1. Qué es Campo</h2>
      <p>
        Campo es una plataforma de descubrimiento y contacto entre
        vendedores y compradores de granos físicos. <strong>No es</strong>{" "}
        una plataforma de pagos, no garantiza operaciones, no actúa como
        corredor ni broker, y no participa de la negociación entre las
        partes.
      </p>

      <h2>2. Quién puede usarlo</h2>
      <p>
        Personas mayores de 18 años o personas jurídicas (empresas,
        cooperativas, etc.) actuando con autoridad para operar
        comercialmente. Los datos cargados deben ser veraces.
      </p>

      <h2>3. Publicaciones y operaciones</h2>
      <ul>
        <li>
          Las publicaciones son responsabilidad exclusiva del vendedor.
        </li>
        <li>
          Campo puede moderar, pausar o eliminar publicaciones que
          incumplan estos términos o sean reportadas con razón válida.
        </li>
        <li>
          La negociación, los contratos comerciales, el pago, la entrega
          y cualquier conflicto entre partes ocurren <strong>fuera</strong>{" "}
          de Campo.
        </li>
      </ul>

      <h2>4. Uso aceptable</h2>
      <ul>
        <li>No publicar contenido falso, engañoso o ilegal.</li>
        <li>No automatizar consultas o scrapear el sitio.</li>
        <li>No suplantar identidad ajena.</li>
        <li>No usar Campo para evadir obligaciones fiscales o aduaneras.</li>
      </ul>

      <h2>5. Limitación de responsabilidad</h2>
      <p>
        Campo se ofrece «tal cual». No garantizamos disponibilidad continua,
        veracidad de las publicaciones, cumplimiento de las contrapartes ni
        resultados comerciales. La responsabilidad de Campo se limita al
        servicio de conexión.
      </p>

      <h2>6. Cambios</h2>
      <p>
        Estos términos pueden cambiar. Cambios materiales se notifican por
        email a usuarios registrados con al menos 15 días de antelación.
      </p>

      <h2>7. Contacto</h2>
      <p>
        Por dudas sobre estos términos: <a href="/contacto">contacto</a>.
      </p>
    </>
  );
}
