"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, ChevronLeft, Landmark, MessageCircle, Ruler, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { asset, cx, money } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { Empty } from "@/components/ui";
import { useHydrated, useToast } from "@/components/providers";

export function ProductView() {
  const slug = useSearchParams().get("p");
  const products = useStore((s) => s.products);
  const settings = useStore((s) => s.settings);
  const cart = useStore((s) => s.cart);
  const add = useStore((s) => s.addToCart);
  const hydrated = useHydrated();
  const toast = useToast();
  const p = products.find((x) => x.slug === slug && x.active);
  // La selección se reinicia sola al cambiar de producto (va ligada al slug).
  const [sel, setSel] = useState({ slug, img: 0, size: "" });
  const cur = sel.slug === slug ? sel : { slug, img: 0, size: "" };
  const { img, size } = cur;
  const setImg = (i: number) => setSel({ ...cur, img: i });
  const setSize = (s: string) => setSel({ ...cur, size: s });
  const [warn, setWarn] = useState(false);

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        {hydrated && <Empty title="No encontrado" text="Este modelo ya no está disponible." action={<Link href="/tienda/" className="btn btn-ink">Ver la tienda</Link>} />}
      </div>
    );
  }

  const inCart = (s: string) => cart.find((c) => c.productId === p.id && c.size === s)?.qty ?? 0;
  const stockOf = (s: string) => (p.sizes.find((z) => z.size === s)?.stock ?? 0) - inCart(s);
  const total = p.sizes.reduce((a, z) => a + z.stock, 0);
  const related = products.filter((x) => x.active && x.id !== p.id && x.category === p.category).slice(0, 4);

  function onAdd() {
    if (!size) { setWarn(true); return; }
    if (stockOf(size) <= 0) { toast("No quedan más en esa talla", "error"); return; }
    add(p!.id, size);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-6 md:px-8">
      <Link href={`/tienda/?cat=${p.category}`} className="inline-flex items-center gap-1 text-sm font-bold text-mute hover:text-ink">
        <ChevronLeft size={16} /> {p.category === "gorras" ? "Gorras" : "Dunks"}
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
        {/* Galería */}
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <div className="no-scrollbar flex gap-3 overflow-x-auto md:flex-col">
            {p.images.map((src, i) => (
              <button key={src} onClick={() => setImg(i)} aria-label={`Foto ${i + 1}`}
                className={cx("h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition", i === img ? "border-ink" : "border-transparent opacity-60 hover:opacity-100")}>
                <img src={asset(src)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative aspect-square flex-1 overflow-hidden rounded-[28px] bg-paper-2">
            <AnimatePresence mode="wait">
              <motion.img
                key={p.images[img]}
                src={asset(p.images[img])}
                alt={p.name}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            </AnimatePresence>
            {p.isNew && <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1.5 text-xs font-bold">Nuevo drop</span>}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-mute">{p.team}</p>
          <h1 className="display mt-3 text-5xl md:text-6xl 2xl:text-7xl">{p.name}</h1>
          <p className="mt-3 text-mute">{p.edition}</p>
          <p className="display mt-6 text-4xl">{money(p.price)}</p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className={cx("text-sm font-bold", warn && !size && "text-accent")}>{warn && !size ? "Elige tu talla" : "Talla"}</p>
              {p.category === "gorras" && (
                <span className="flex items-center gap-1 text-xs text-mute"><Ruler size={13} /> Fitted: mide tu cabeza en cm y escríbenos</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {p.sizes.map((z) => {
                const left = hydrated ? stockOf(z.size) : z.stock;
                const out = left <= 0;
                return (
                  <button key={z.size} disabled={out} onClick={() => { setSize(z.size); setWarn(false); }}
                    className={cx(
                      "relative h-14 rounded-2xl border-[1.5px] text-sm font-bold transition",
                      size === z.size ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink",
                      out && "cursor-not-allowed text-mute/60 line-through hover:border-line",
                    )}>
                    {z.size}
                    {!out && left <= 1 && <span className="absolute -top-2 right-1 rounded-full bg-accent px-1.5 text-[9px] font-bold text-white no-underline">Última</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={onAdd} disabled={total === 0} className="btn btn-ink h-14 flex-1 text-[15px]">
              {total === 0 ? "Agotado" : "Agregar al carrito"}
            </button>
            <a href={settings.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-ghost h-14">
              <MessageCircle size={18} /> Preguntar
            </a>
          </div>

          <p className="mt-8 leading-relaxed text-ink-2">{p.description}</p>

          <ul className="mt-8 divide-y divide-line rounded-[22px] bg-white">
            {[
              { i: <BadgeCheck size={18} />, t: "100% original", s: "Producto auténtico con etiquetas." },
              { i: <Landmark size={18} />, t: "Pago por transferencia", s: "Subes tu comprobante y lo validamos en minutos." },
              { i: <Truck size={18} />, t: "Envíos a todo el país", s: settings.zones.map((z) => `${z.name}: ${money(z.fee)}`).join(" · ") },
            ].map((x) => (
              <li key={x.t} className="flex gap-3 p-4">
                <span className="mt-0.5">{x.i}</span>
                <div>
                  <p className="text-sm font-bold">{x.t}</p>
                  <p className="text-xs text-mute">{x.s}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="display text-5xl md:text-7xl">También te puede gustar</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
