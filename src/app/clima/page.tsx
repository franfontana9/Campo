import { redirect } from "next/navigation";

/** Redirect a la vista de mapa unificada con la capa de clima activa. */
export default function ClimaPage() {
  redirect("/mapa?layer=clima");
}
