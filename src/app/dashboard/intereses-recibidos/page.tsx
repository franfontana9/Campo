import { redirect } from "next/navigation";

/** Redirect a la bandeja unificada con la pestaña de Recibidos preseleccionada. */
export default async function InteresesRecibidosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  params.set("tipo", "recibidos");
  if (sp.status) params.set("status", sp.status);
  redirect(`/dashboard/intereses?${params.toString()}`);
}
