"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, Menu, ShoppingBag, User, X } from "lucide-react";
import { useMe, useStore } from "@/lib/store";
import { useHydrated } from "./providers";
import { Logo } from "./logo";
import { cx } from "@/lib/utils";

const NAV = [
  { href: "/tienda/?cat=gorras", label: "Gorras", match: "gorras" },
  { href: "/tienda/?cat=tenis", label: "Dunks", match: "tenis" },
  { href: "/tienda/", label: "Todo", match: "" },
  { href: "/como-comprar/", label: "Cómo comprar", match: "como" },
];

const MARQUEE = [
  "100% originales",
  "Envíos a todo el país",
  "Paga por transferencia y sube tu comprobante",
  "New Era 59FIFTY",
  "Nike Dunk Low",
  "Desde Santo Domingo 📍SDQ",
];

export function Header() {
  const hydrated = useHydrated();
  const me = useMe();
  const count = useStore((s) => s.cart.reduce((a, c) => a + c.qty, 0));
  const setCartOpen = useStore((s) => s.setCartOpen);
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);


  const isActive = (m: string) => {
    if (m === "como") return pathname.startsWith("/como-comprar");
    if (!pathname.startsWith("/tienda")) return false;
    return (params.get("cat") ?? "") === m;
  };

  return (
    <>
      <div className="overflow-hidden bg-ink py-2 text-paper">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="eyebrow flex items-center gap-10 text-[10px]">
              {t} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
      <header
        className={cx(
          "sticky top-0 z-40 transition-[background,box-shadow] duration-300",
          scrolled ? "bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-paper",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 md:h-[72px] md:px-8">
          <Link href="/" aria-label="CapKix, inicio" className="shrink-0">
            <Logo className="h-9 text-ink md:h-10" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Principal">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={cx(
                  "rounded-full px-4 py-2 text-sm font-bold transition",
                  isActive(n.match) ? "bg-ink text-paper" : "hover:bg-paper-2",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            {hydrated && me && me.role !== "cliente" && (
              <Link href="/panel/" className="btn btn-sm btn-ghost mr-1 hidden lg:inline-flex">
                <LayoutDashboard size={16} /> Panel
              </Link>
            )}
            <Link
              href={hydrated && me ? "/cuenta/" : "/entrar/"}
              className="flex h-11 items-center gap-2 rounded-full px-3 text-sm font-bold hover:bg-paper-2"
              aria-label="Mi cuenta"
            >
              <User size={20} />
              <span className="hidden max-w-28 truncate lg:inline">{hydrated && me ? me.name.split(" ")[0] : "Entrar"}</span>
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-paper-2"
              aria-label={`Carrito, ${count} artículos`}
            >
              <ShoppingBag size={20} />
              {hydrated && count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-paper-2 md:hidden"
              aria-label="Menú"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-line md:hidden"
            >
              <div className="flex flex-col px-4 py-3">
                {NAV.map((n) => (
                  <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="display py-2 text-4xl">
                    {n.label}
                  </Link>
                ))}
                {hydrated && me && me.role !== "cliente" && (
                  <Link href="/panel/" onClick={() => setOpen(false)} className="display py-2 text-4xl text-accent">Panel</Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
