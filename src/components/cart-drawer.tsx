"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { asset, money } from "@/lib/utils";

export function useCartLines() {
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const lines = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.productId)! }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0);
  return { lines, subtotal };
}

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.setCartOpen);
  const setQty = useStore((s) => s.setQty);
  const remove = useStore((s) => s.removeFromCart);
  const { lines, subtotal } = useCartLines();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Carrito"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-paper"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <h2 className="display text-4xl">Tu carrito</h2>
              <button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper-2" aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="display text-6xl text-line">Vacío</p>
                <p className="text-mute">Todavía no has elegido tu próxima pieza.</p>
                <Link href="/tienda/" onClick={() => setOpen(false)} className="btn btn-ink">Ver la tienda</Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-6">
                  {lines.map((l) => {
                    const stock = l.product.sizes.find((z) => z.size === l.size)?.stock ?? 0;
                    return (
                      <li key={l.productId + l.size} className="card flex gap-4 p-3">
                        <img src={asset(l.product.images[0])} alt="" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="truncate text-sm font-bold">{l.product.name}</p>
                          <p className="text-xs text-mute">Talla {l.size}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-line">
                              <button className="p-2" onClick={() => setQty(l.productId, l.size, l.qty - 1)} aria-label="Menos"><Minus size={14} /></button>
                              <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                              <button className="p-2 disabled:opacity-30" disabled={l.qty >= stock} onClick={() => setQty(l.productId, l.size, l.qty + 1)} aria-label="Más"><Plus size={14} /></button>
                            </div>
                            <span className="text-sm font-bold">{money(l.product.price * l.qty)}</span>
                          </div>
                        </div>
                        <button onClick={() => remove(l.productId, l.size)} className="self-start p-1 text-mute hover:text-accent" aria-label="Quitar">
                          <Trash2 size={16} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="space-y-4 border-t border-line px-6 py-5">
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-mute">Subtotal</span>
                    <span className="display text-3xl">{money(subtotal)}</span>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-mute">
                    <ShieldCheck size={15} className="text-ok" /> Pagas por transferencia y subes el comprobante. El envío se calcula en el siguiente paso.
                  </p>
                  <Link href="/checkout/" onClick={() => setOpen(false)} className="btn btn-ink w-full">
                    Ir a pagar
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
