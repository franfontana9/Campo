import { redirect } from "next/navigation";

/** Redirect a la vista de mapa unificada con la capa de ofertas activa. */
export default function GeografiaPage() {
  redirect("/mapa?layer=ofertas");
}
