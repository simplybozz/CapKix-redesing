"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { asset, money } from "@/lib/utils";

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const stock = p.sizes.reduce((a, s) => a + s.stock, 0);
  const href = `/producto/?p=${p.slug}`;
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-[22px] bg-paper-2">
        <img
          src={asset(p.images[0])}
          alt={p.name}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.06]"
        />
        {p.images[1] && (
          <img
            src={asset(p.images[1])}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,scale] duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-[1.06] group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {p.isNew && <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold">Nuevo</span>}
          {stock === 0 && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-paper">Agotado</span>}
          {stock > 0 && stock <= 6 && <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white">Quedan pocas</span>}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-tight">{p.name}</p>
          <p className="mt-0.5 truncate text-[13px] text-mute">{p.edition}</p>
        </div>
        <p className="shrink-0 text-[15px] font-bold">{money(p.price)}</p>
      </div>
    </Link>
  );
}
