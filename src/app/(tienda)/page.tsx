"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, BadgeCheck, Camera, Landmark, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { asset, money } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/ui";
import { StatusBadge } from "@/components/order-bits";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  const products = useStore((s) => s.products).filter((p) => p.active);
  const featured = products.filter((p) => p.featured);
  const caps = products.filter((p) => p.category === "gorras");
  const hero = products.find((p) => p.slug === "mets-60th") ?? products[0];

  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-[1400px] px-4 pt-6 md:px-8 md:pt-10">
        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-between rounded-[28px] bg-white p-6 md:p-10">
            <div>
              <motion.p className="eyebrow text-mute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                New Era 59FIFTY · Nike Dunk Low · SDQ
              </motion.p>
              <h1 className="display mt-6 text-[19vw] sm:text-[15vw] lg:text-[8.6vw] 2xl:text-[132px]">
                {["La corona", "la eliges", "tú."].map((l, i) => (
                  <span key={l} className="block overflow-hidden">
                    <motion.span
                      className={`block ${i === 2 ? "text-accent" : ""}`}
                      initial={{ y: "105%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, delay: 0.15 + i * 0.09, ease }}
                    >
                      {l}
                    </motion.span>
                  </span>
                ))}
              </h1>
            </div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease }}>
              <p className="mt-8 max-w-md text-[17px] leading-relaxed text-ink-2">
                Gorras y Dunks 100% originales. Elige tu talla, paga por transferencia, sube tu comprobante y sigue tu pedido hasta la puerta.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/tienda/?cat=gorras" className="btn btn-ink">Ver gorras <ArrowRight size={16} /></Link>
                <Link href="/tienda/?cat=tenis" className="btn btn-ghost">Ver Dunks</Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-ink lg:min-h-[640px]"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease }}
          >
            <img src={asset(hero.images[0])} alt={hero.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <Link
              href={`/producto/?p=${hero.slug}`}
              className="absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-[20px] bg-paper/90 p-3 pr-5 backdrop-blur-md transition hover:bg-paper md:bottom-6 md:left-6 md:right-auto"
            >
              <img src={asset(hero.images[1] ?? hero.images[0])} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              <div className="min-w-0">
                <p className="eyebrow text-[9px] text-mute">Drop de la semana</p>
                <p className="truncate font-bold">{hero.name}</p>
                <p className="text-sm text-mute">{money(hero.price)}</p>
              </div>
              <ArrowUpRight className="ml-auto shrink-0" size={20} />
            </Link>
          </motion.div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: <BadgeCheck size={20} />, t: "100% originales", s: "Autenticidad garantizada" },
            { icon: <Truck size={20} />, t: "Envíos a todo RD", s: "Desde Santo Domingo" },
            { icon: <Landmark size={20} />, t: "Pago por transferencia", s: "Popular · BHD · Banreservas" },
            { icon: <Camera size={20} />, t: "15.3K en Instagram", s: "@capkix" },
          ].map((x) => (
            <div key={x.t} className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper">{x.icon}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{x.t}</p>
                <p className="truncate text-xs text-mute">{x.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="mx-auto mt-24 max-w-[1400px] px-4 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { href: "/tienda/?cat=gorras", img: "/products/boston-asg-1961-1.webp", t: "Gorras", s: "New Era 59FIFTY Fitted", n: caps.length },
            { href: "/tienda/?cat=tenis", img: "/brand/hero-dunk.webp", t: "Dunks", s: "Nike Dunk Low", n: products.length - caps.length },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <Link href={c.href} className="group relative block aspect-[4/3] overflow-hidden rounded-[28px] bg-ink md:aspect-[5/4]">
                <img src={asset(c.img)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-paper md:inset-x-8 md:bottom-8">
                  <div>
                    <p className="eyebrow text-paper/70">{c.s} · {c.n} modelos</p>
                    <p className="display mt-2 text-7xl md:text-8xl">{c.t}</p>
                  </div>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-ink transition duration-700 group-hover:rotate-[-45deg] group-hover:scale-110">
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DROPS */}
      <section className="mt-24">
        <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-4 md:px-8">
          <Reveal>
            <p className="eyebrow text-mute">Selección CapKix</p>
            <h2 className="display mt-3 text-6xl md:text-8xl">Drops de la semana</h2>
          </Reveal>
          <Link href="/tienda/" className="btn btn-ghost btn-sm hidden shrink-0 md:inline-flex">Ver todo <ArrowRight size={14} /></Link>
        </div>
        <div
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
          style={{ paddingInline: "max(1rem, calc((100vw - 1400px) / 2 + 2rem))", scrollPaddingInline: "max(1rem, calc((100vw - 1400px) / 2 + 2rem))" }}
        >
          {featured.map((p, i) => (
            <div key={p.id} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[23vw] 2xl:w-[320px]">
              <ProductCard p={p} priority={i < 4} />
            </div>
          ))}
        </div>
      </section>

      {/* PAGOS */}
      <section className="mx-auto mt-28 max-w-[1400px] px-4 md:px-8">
        <div className="overflow-hidden rounded-[32px] bg-ink text-paper">
          <div className="grid gap-12 p-6 md:p-14 lg:grid-cols-[minmax(0,1fr)_0.9fr]">
            <div>
              <Reveal>
                <p className="eyebrow text-accent">Nuevo · Pagos ordenados</p>
                <h2 className="display mt-4 text-6xl md:text-[96px]">Transfiere.<br />Sube.<br />Listo.</h2>
                <p className="mt-6 max-w-lg text-paper/70">
                  Se acabó perder comprobantes entre chats. Cada pedido queda guardado en tu cuenta con su comprobante, y el equipo de CapKix lo valida desde su panel.
                </p>
              </Reveal>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { n: "01", t: "Elige", s: "Tu gorra o tus Dunks y la talla exacta." },
                  { n: "02", t: "Transfiere", s: "A Popular, BHD o Banreservas. Copias la cuenta con un toque." },
                  { n: "03", t: "Sube el comprobante", s: "Una captura y listo. Te avisamos cuando se confirme." },
                ].map((s, i) => (
                  <Reveal key={s.n} delay={i * 0.08}>
                    <div className="h-full rounded-[20px] border border-paper/10 p-5">
                      <p className="display text-3xl text-paper/30">{s.n}</p>
                      <p className="mt-3 font-bold">{s.t}</p>
                      <p className="mt-1 text-sm text-paper/60">{s.s}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={0.15} className="relative">
              <div className="rounded-[26px] bg-paper p-5 text-ink shadow-2xl md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-mute">Pedido</p>
                    <p className="display text-3xl">#1007</p>
                  </div>
                  <StatusBadge status="confirmado" />
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-3">
                  <img src={asset("/products/yankees-1927-pewter-1.webp")} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">NY Yankees World Champions 1927</p>
                    <p className="text-xs text-mute">Talla 7 1/2 · 1 unidad</p>
                  </div>
                  <p className="text-sm font-bold">{money(3750)}</p>
                </div>
                <div className="mt-4 grid grid-cols-[110px_1fr] gap-4">
                  <div className="overflow-hidden rounded-2xl bg-[#0b3a82] p-3 text-white">
                    <p className="text-[9px] font-bold opacity-80">Transferencia exitosa</p>
                    <p className="mt-6 text-[10px] opacity-70">Monto</p>
                    <p className="text-sm font-bold">RD$ 4,000</p>
                    <p className="mt-3 text-[9px] opacity-60">Ref. 84720193</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {[
                      { t: "Comprobante recibido", s: "10:42 a. m.", ok: true },
                      { t: "Pago confirmado", s: "10:51 a. m. · Ventas", ok: true },
                      { t: "En camino", s: "Pendiente", ok: false },
                    ].map((x) => (
                      <li key={x.t} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${x.ok ? "bg-ok text-white" : "bg-line"}`}>
                          {x.ok && <PackageCheck size={11} />}
                        </span>
                        <div>
                          <p className="font-bold leading-tight">{x.t}</p>
                          <p className="text-xs text-mute">{x.s}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-xl md:flex">
                <ShieldCheck size={16} /> Validado por CapKix
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section className="mx-auto mt-28 max-w-[1400px] px-4 md:px-8">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-mute">59FIFTY Fitted</p>
            <h2 className="display mt-3 text-6xl md:text-8xl">Lo más buscado</h2>
          </div>
          <Link href="/tienda/?cat=gorras" className="btn btn-ghost btn-sm hidden shrink-0 md:inline-flex">Todas las gorras <ArrowRight size={14} /></Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {caps.slice(0, 8).map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* BANNER */}
      <section className="mx-auto mt-28 max-w-[1400px] px-4 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-ink">
            <img src={asset("/brand/hero-skyline.webp")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
            <div className="relative flex min-h-[460px] flex-col justify-end p-6 text-paper md:min-h-[560px] md:p-14">
              <p className="eyebrow text-paper/60">Autenticidad en CapKix</p>
              <h2 className="display mt-4 max-w-3xl text-6xl md:text-[110px]">Haz tu elección y marca tendencia.</h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/tienda/" className="btn btn-light">Comprar ahora</Link>
                <a href="https://www.instagram.com/capkix/" target="_blank" rel="noreferrer" className="btn border border-paper/30 text-paper hover:bg-paper hover:text-ink">
                  <Camera size={16} /> @capkix
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
