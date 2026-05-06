import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT"],
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Campo · Marketplace global de granos",
    template: "%s · Campo",
  },
  description:
    "Marketplace B2B de granos físicos. Publicá tu oferta o descubrí miles de toneladas de soja, maíz, trigo, girasol, sorgo, cebada, avena y arroz — directo entre empresas, sin corredores.",
  applicationName: "Campo",
  keywords: [
    "granos",
    "marketplace",
    "soja",
    "maíz",
    "trigo",
    "girasol",
    "sorgo",
    "cebada",
    "agro",
    "B2B",
    "exportación",
  ],
  openGraph: {
    type: "website",
    siteName: "Campo",
    title: "Campo · Marketplace global de granos",
    description:
      "Publicá y descubrí ofertas de granos físicos. Vendedores verificados, alcance global.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campo · Marketplace global de granos",
    description:
      "Publicá y descubrí ofertas de granos físicos. Vendedores verificados, alcance global.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${interTight.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <CurrencyProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast:
                  "rounded-2xl border-ink-100 shadow-xl font-sans",
              },
            }}
          />
        </CurrencyProvider>
      </body>
    </html>
  );
}
