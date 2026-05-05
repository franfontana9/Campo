import type { Metadata } from "next";
import { Mail, MessageSquare, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Hablá con el equipo de Campo.",
};

export default function ContactoPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        Hablar con Campo
      </p>
      <h1 className="mt-2">Estamos a un mensaje.</h1>
      <p>
        Si tu consulta está en el <a href="/ayuda">centro de ayuda</a>, vas a
        encontrar respuesta más rápido. Para todo lo demás, escribinos.
      </p>

      <div className="mt-8 grid gap-6 not-prose md:grid-cols-3">
        <Card
          icon={<MessageSquare className="h-5 w-5" />}
          title="Soporte general"
          desc="Dudas sobre publicar, intereses, perfil."
          contact="hola@campo.app"
        />
        <Card
          icon={<ShieldAlert className="h-5 w-5" />}
          title="Reportar abuso"
          desc="Publicación falsa, fraude, contraparte sospechosa."
          contact="abuse@campo.app"
        />
        <Card
          icon={<Mail className="h-5 w-5" />}
          title="Prensa / partnerships"
          desc="Si te interesa hablar de algo más grande."
          contact="hi@campo.app"
        />
      </div>

      <h2>Mandanos un mensaje</h2>
      <form className="mt-4 grid gap-5 not-prose">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-1.5" required />
          </div>
        </div>
        <div>
          <Label htmlFor="subject">Asunto</Label>
          <Input id="subject" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="message">Mensaje</Label>
          <Textarea id="message" rows={6} className="mt-1.5" required />
        </div>
        <Button type="submit" size="lg" className="justify-self-start">
          Enviar
        </Button>
      </form>
    </>
  );
}

function Card({
  icon,
  title,
  desc,
  contact,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  contact: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="mt-4 font-medium text-ink-900">{title}</p>
      <p className="mt-1 text-sm text-ink-600">{desc}</p>
      <a
        href={`mailto:${contact}`}
        className="mt-3 inline-block text-sm font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
      >
        {contact}
      </a>
    </div>
  );
}
