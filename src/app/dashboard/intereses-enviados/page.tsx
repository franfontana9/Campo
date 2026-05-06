import { redirect } from "next/navigation";

/** Redirect a la bandeja unificada con la pestaña de Enviados preseleccionada. */
export default async function InteresesEnviadosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  params.set("tipo", "enviados");
  if (sp.status) params.set("status", sp.status);
  redirect(`/dashboard/intereses?${params.toString()}`);
}
