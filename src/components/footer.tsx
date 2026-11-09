"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Logo } from "./logo";

export function Footer() {
  const settings = useStore((s) => s.settings);
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-4 pt-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="display text-5xl md:text-6xl">Marca<br />tendencia.</p>
            <p className="mt-4 max-w-sm text-sm text-paper/60">
              Gorras New Era y Nike Dunks 100% originales. Enviamos a todo el país desde Santo Domingo.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4 text-paper/40">Tienda</p>
            <ul className="space-y-2 text-sm font-semibold">
              <li><Link href="/tienda/?cat=gorras" className="transition hover:text-accent">Gorras New Era</Link></li>
              <li><Link href="/tienda/?cat=tenis" className="transition hover:text-accent">Nike Dunks</Link></li>
              <li><Link href="/tienda/" className="transition hover:text-accent">Todo el catálogo</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-paper/40">Ayuda</p>
            <ul className="space-y-2 text-sm font-semibold">
              <li><Link href="/como-comprar/" className="transition hover:text-accent">Cómo comprar</Link></li>
              <li><Link href="/cuenta/" className="transition hover:text-accent">Mis pedidos</Link></li>
              <li><a href={settings.whatsappUrl} target="_blank" rel="noreferrer" className="transition hover:text-accent">WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-paper/40">Síguenos</p>
            <ul className="space-y-2 text-sm font-semibold">
              <li><a href={settings.instagram} target="_blank" rel="noreferrer" className="transition hover:text-accent">Instagram · @capkix</a></li>
              <li className="text-paper/60">📍 Santo Domingo, RD</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 items-center gap-4 border-t border-paper/10 py-6 text-center text-xs text-paper/40 md:grid-cols-3 md:text-left">
          <span>© 2026 CapKix · Autenticidad garantizada</span>
          <Logo className="mx-auto h-7 text-paper/80" />
          <span className="md:text-right">Propuesta de rediseño</span>
        </div>
      </div>
    </footer>
  );
}
