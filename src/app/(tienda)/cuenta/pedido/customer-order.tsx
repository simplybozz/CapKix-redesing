"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, MessageCircle, PartyPopper } from "lucide-react";
import { useMe, useStore } from "@/lib/store";
import { STATUS_HELP } from "@/lib/types";
import { asset, dateTime, money } from "@/lib/utils";
import { Empty, ImageDrop } from "@/components/ui";
import { OrderHistory, OrderProgress, StatusBadge } from "@/components/order-bits";
import { useToast } from "@/components/providers";

export function CustomerOrder() {
  const params = useSearchParams();
  const id = params.get("id");
  const isNew = params.get("nuevo") === "1";
  const me = useMe()!;
  const o = useStore((s) => s.orders.find((x) => x.id === id));
  const settings = useStore((s) => s.settings);
  const resubmit = useStore((s) => s.resubmitProof);
  const moveOrder = useStore((s) => s.moveOrder);
  const toast = useToast();
  const [proof, setProof] = useState("");
  const [ref, setRef] = useState("");

  if (!o || (o.userId !== me.id && me.role === "cliente")) {
    return <div className="mx-auto max-w-xl px-4 py-24"><Empty title="No encontrado" text="Este pedido no existe o no es tuyo." /></div>;
  }
  const lastNote = [...o.history].reverse().find((h) => h.status === "rechazado")?.note;

  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-8 md:px-8">
      <Link href="/cuenta/" className="inline-flex items-center gap-1 text-sm font-bold text-mute hover:text-ink"><ChevronLeft size={16} /> Mis pedidos</Link>

      {isNew && o.status === "revision" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex items-center gap-4 rounded-[22px] bg-ok p-5 text-white">
          <PartyPopper />
          <div>
            <p className="font-bold">¡Recibimos tu pedido y tu comprobante!</p>
            <p className="text-sm opacity-90">El equipo de CapKix lo valida y aquí verás cada cambio.</p>
          </div>
        </motion.div>
      )}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-mute">{dateTime(o.createdAt)}</p>
          <h1 className="display mt-2 text-6xl md:text-8xl">Pedido #{o.number}</h1>
        </div>
        <StatusBadge status={o.status} className="text-sm" />
      </div>

      <div className="card mt-6 p-5 md:p-6">
        <OrderProgress order={o} />
        <p className="mt-5 text-sm text-ink-2">{STATUS_HELP[o.status]}</p>
        {o.tracking && o.status === "enviado" && <p className="mt-2 text-sm font-bold">Enviado con: {o.tracking}</p>}
      </div>

      {o.status === "rechazado" && (
        <section className="mt-5 rounded-[22px] border-2 border-accent bg-white p-5 md:p-6">
          <p className="display text-3xl text-accent">Sube un comprobante nuevo</p>
          {lastNote && <p className="mt-2 rounded-xl bg-red-50 p-3 text-sm"><b>Motivo:</b> {lastNote}</p>}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ImageDrop value={proof} onChange={setProof} />
            <div className="flex flex-col gap-3">
              <label className="label" htmlFor="r">Referencia (opcional)</label>
              <input id="r" className="field" value={ref} onChange={(e) => setRef(e.target.value)} />
              <button
                disabled={!proof}
                onClick={() => {
                  const err = resubmit(o.id, proof, ref);
                  if (err) toast(err, "error");
                  else { toast("Comprobante enviado de nuevo"); setProof(""); }
                }}
                className="btn btn-ink mt-auto"
              >
                Enviar comprobante nuevo
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="card p-5 md:p-6">
            <h2 className="display text-3xl">Artículos</h2>
            <ul className="mt-4 divide-y divide-line">
              {o.items.map((i) => (
                <li key={i.productId + i.size} className="flex items-center gap-4 py-3">
                  <img src={asset(i.image)} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{i.name}</p>
                    <p className="text-xs text-mute">Talla {i.size} · {i.qty} × {money(i.price)}</p>
                  </div>
                  <p className="font-bold">{money(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-mute">Subtotal</dt><dd>{money(o.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-mute">Envío</dt><dd>{o.shippingFee ? money(o.shippingFee) : "Gratis"}</dd></div>
              <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd>{money(o.total)}</dd></div>
            </dl>
          </section>
          <section className="card p-5 md:p-6">
            <h2 className="display mb-5 text-3xl">Historial</h2>
            <OrderHistory order={o} />
          </section>
        </div>
        <aside className="space-y-5">
          <section className="card p-5">
            <h2 className="eyebrow text-mute">Comprobante</h2>
            <a href={o.proofImage} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-2xl bg-paper">
              <img src={o.proofImage} alt="Comprobante" className="max-h-72 w-full object-contain" />
            </a>
            <p className="mt-3 text-xs text-mute">{o.bankSnapshot}{o.proofReference && ` · Ref. ${o.proofReference}`}</p>
          </section>
          <section className="card p-5 text-sm">
            <h2 className="eyebrow text-mute">Entrega</h2>
            {o.delivery === "envio" && o.address ? (
              <p className="mt-2">{o.address.street}, {o.address.city}, {o.address.province}<br /><span className="text-mute">{o.zoneName}</span></p>
            ) : (
              <p className="mt-2">{settings.pickupNote}</p>
            )}
            <p className="mt-2 text-mute">Tel. {o.customerPhone}</p>
          </section>
          <a href={settings.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-ghost w-full"><MessageCircle size={16} /> Escribir por WhatsApp</a>
          {(o.status === "revision" || o.status === "rechazado") && o.userId === me.id && (
            <button
              onClick={() => { if (confirm("¿Cancelar este pedido?")) { const e = moveOrder(o.id, "cancelado"); toast(e ?? "Pedido cancelado", e ? "error" : "ok"); } }}
              className="w-full text-center text-sm font-bold text-mute underline underline-offset-4 hover:text-accent"
            >
              Cancelar pedido
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
