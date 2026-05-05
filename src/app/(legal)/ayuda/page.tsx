import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ayuda",
  description: "Centro de ayuda de Campo — cómo publicar, contactar y operar.",
};

export default function AyudaPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        Centro de ayuda
      </p>
      <h1 className="mt-2">¿Cómo te ayudamos?</h1>
      <p>
        Lo más buscado en Campo. Si no encontrás lo que necesitás, escribinos
        en <Link href="/contacto">contacto</Link>.
      </p>

      <h2>Empezar</h2>
      <h3>¿Cómo creo una cuenta?</h3>
      <p>
        Andá a <Link href="/register">crear cuenta</Link>, completá razón
        social, contacto y ubicación. La cuenta queda activa al instante;
        la verificación como «Empresa verificada» se hace en menos de 24 h.
      </p>
      <h3>¿Qué tipo de usuario tengo que elegir?</h3>
      <p>
        <strong>Vendedor</strong> si vas a publicar oferta, <strong>comprador</strong>{" "}
        si vas a buscar granos, <strong>ambos</strong> si hacés las dos cosas
        (corredor, broker, cooperativa). Lo podés cambiar después en
        «Mi perfil».
      </p>

      <h2>Publicar y operar</h2>
      <h3>¿Cómo publico una oferta?</h3>
      <p>
        En tu panel, «Nueva publicación». Cargás grano, toneladas, ubicación,
        precio (o modalidad «A convenir»), fecha de entrega y descripción.
        Aparece en el marketplace al guardar.
      </p>
      <h3>¿Qué pasa cuando alguien muestra interés?</h3>
      <p>
        Recibís el mensaje en «Intereses recibidos». Podés aceptarlo o
        rechazarlo. Cuando aceptás, se comparte el contacto entre las dos
        partes y la negociación sigue por fuera.
      </p>

      <h2>Comisiones y cobros</h2>
      <h3>¿Campo cobra alguna comisión?</h3>
      <p>
        No. Durante el MVP, publicar y mostrar interés es gratis. A futuro
        vamos a sumar servicios pagos opcionales (Campo Crédito, logística,
        verificación premium) — el marketplace base se mantiene gratuito.
      </p>

      <h2>Confianza</h2>
      <h3>¿Cómo se verifica un vendedor?</h3>
      <p>
        Manualmente: revisamos razón social, contacto y antecedentes. La
        marca «Empresa verificada» refleja esa revisión. Próximamente vamos
        a sumar verificación automática vía CUIT / Tax ID.
      </p>
      <h3>¿Qué pasa si tengo problemas con una contraparte?</h3>
      <p>
        Reportá la publicación o usuario desde el detalle, o escribinos
        directo a soporte. Revisamos cada reporte y, si corresponde,
        suspendemos la cuenta.
      </p>
    </>
  );
}
