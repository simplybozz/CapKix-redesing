import type { Metadata, Viewport } from "next";
import { Anton, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: { default: "CapKix · Gorras New Era y Nike Dunks originales", template: "%s · CapKix" },
  description:
    "Gorras New Era 59FIFTY y Nike Dunks 100% originales en República Dominicana. Envíos a todo el país y pago por transferencia con comprobante.",
};

export const viewport: Viewport = { themeColor: "#0c0c0c" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-DO" className={`${anton.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
