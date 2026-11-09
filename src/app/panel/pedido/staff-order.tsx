"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Check, ChevronLeft, MessageCircle, PackageCheck, Truck, X, ZoomIn } from "lucide-react";
import { canMove, useStore } from "@/lib/store";
import { OrderStatus } from "@/lib/types";
import { asset, dateTime, money } from "@/lib/utils";
import { OrderHistory, OrderProgress, StatusBadge } from "@/components/order-bits";
import { useToast } from "@/components/providers";
import { Empty } from "@/components/ui";

const REASONS = [
  "El monto del comprobante no coincide con el total del pedido.",
  "No se ve claro el comprobante. Sube una captura completa.",
  "No vemos la transferencia en la cuenta todavía.",
];

export function StaffOrder() {
  const id = useSearchParams().get("id");
  const o = useStore((s) => s.orders.find((x) => x.id === id));
  const move = useStore((s) => s.moveOrder);
  const toast = useToast();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [tracking, setTracking] = useState("Mensajero CapKix");
  const [zoom, setZoom] = useState(false);

  if (!o) return <Empty title="No encontrado" text="Este pedido no existe." />;

  function act(to: OrderStatus, note?: string, msg?: string) {
    const err = move(o!.id, to, note, to === "enviado" ? tracking : undefined);
    if (err) toast(err, "error");
    else {
      toast(msg ?? "Pedido actualizado");
      setRejecting(false);
      setReason("");
    }
  }
  const phone = o.customerPhone.replace(/\D/g, "");
  const wa = `https://wa.me/1${phone.slice(-10)}?text=${encodeURIComponent(`Hola ${o.customerName.split(" ")[0]}, te escribimos de CapKix sobre tu pedido #${o.number}.`)}`;

  return (
    <div className="mx-auto max-w-[1200px]">
      <Link href="/panel/pedidos/" className="inline-flex items-center gap-1 text-sm font-bold text-mute hover:text-ink"><ChevronLeft size={16} /> Pedidos</Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-mute">{dateTime(o.createdAt)}</p>
          <h1 className="display mt-2 text-5xl md:text-7xl">Pedido #{o.number}</h1>
        </div>
        <StatusBadge status={o.status} className="text-sm" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* Comprobante */}
        <section className="card h-fit p-4 lg:sticky lg:top-8">
          <div className="flex items-center justify-between px-1">
            <h2 className="eyebrow text-mute">Comprobante</h2>
            <button onClick={() => setZoom(true)} className="flex items-center gap-1 text-xs font-bold"><ZoomIn size={14} /> Ampliar</button>
          </div>
          <button onClick={() => setZoom(true)} className="mt-3 block w-full overflow-hidden rounded-2xl bg-paper">
            <img src={o.proofImage} alt="Comprobante" className="max-h-[520px] w-full object-contain" />
          </button>
          <dl className="mt-4 space-y-2 px-1 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-mute">Cuenta</dt><dd className="text-right font-semibold">{o.bankSnapshot}</dd></div>
            <div className="flex justify-between"><dt className="text-mute">Referencia</dt><dd className="font-semibold">{o.proofReference || "—"}</dd></div>
            <div className="flex items-end justify-between rounded-xl bg-paper p-3"><dt className="font-bold">Debe decir</dt><dd className="display text-3xl">{money(o.total)}</dd></div>
          </dl>

          {o.status === "revision" && !rejecting && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setRejecting(true)} className="btn border border-line bg-white hover:border-accent hover:text-accent"><X size={16} /> Rechazar</button>
              <button onClick={() => act("confirmado", undefined, "Pago confirmado ✓")} className="btn bg-ok text-white hover:opacity-90"><Check size={16} /> Confirmar pago</button>
            </div>
          )}
          {rejecting && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-bold">¿Por qué lo rechazas? El cliente lo verá.</p>
              {REASONS.map((r) => (
                <button key={r} onClick={() => setReason(r)} className={`block w-full rounded-xl border p-2.5 text-left text-xs ${reason === r ? "border-ink bg-paper" : "border-line"}`}>{r}</button>
              ))}
              <textarea className="field" rows={2} placeholder="O escribe otro motivo…" value={reason} onChange={(e) => setReason(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setRejecting(false)} className="btn btn-sm border border-line">Volver</button>
                <button onClick={() => act("rechazado", reason, "Comprobante rechazado")} className="btn btn-sm bg-accent text-white">Rechazar</button>
              </div>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="card p-5 md:p-6">
            <OrderProgress order={o} />
            <div className="mt-6 flex flex-wrap gap-2">
              {canMove(o, "enviado") && (
                <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                  <input className="field h-11 sm:w-56" value={tracking} onChange={(e) => setTracking(e.target.value)} aria-label="Enviado con" />
                  <button onClick={() => act("enviado", `Sale con ${tracking}`, "Marcado como enviado")} className="btn btn-ink h-11"><Truck size={16} /> Marcar enviado</button>
                </div>
              )}
              {canMove(o, "listo") && <button onClick={() => act("listo", undefined, "Listo para entregar")} className="btn btn-ink h-11"><PackageCheck size={16} /> Listo para entregar</button>}
              {canMove(o, "entregado") && <button onClick={() => act("entregado", undefined, "Pedido entregado")} className="btn btn-ink h-11"><Check size={16} /> Marcar entregado</button>}
              {canMove(o, "cancelado") && (
                <button onClick={() => confirm("¿Cancelar el pedido? Las tallas vuelven al inventario.") && act("cancelado", "Cancelado por la tienda", "Pedido cancelado")}
                  className="btn h-11 text-mute hover:text-accent">Cancelar pedido</button>
              )}
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="card p-5">
              <h2 className="eyebrow text-mute">Cliente</h2>
              <p className="mt-2 font-bold">{o.customerName}</p>
              <p className="text-sm text-mute">{o.customerEmail}</p>
              <p className="text-sm text-mute">{o.customerPhone}</p>
              <a href={wa} target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost mt-4"><MessageCircle size={14} /> WhatsApp</a>
            </section>
            <section className="card p-5 text-sm">
              <h2 className="eyebrow text-mute">Entrega</h2>
              {o.delivery === "envio" && o.address ? (
                <>
                  <p className="mt-2 font-bold">{o.zoneName}</p>
                  <p>{o.address.street}</p>
                  <p>{o.address.city}, {o.address.province}</p>
                  {o.address.reference && <p className="text-mute">Ref: {o.address.reference}</p>}
                </>
              ) : <p className="mt-2 font-bold">Entrega en Santo Domingo (punto acordado)</p>}
            </section>
          </div>

          <section className="card p-5 md:p-6">
            <h2 className="display text-3xl">Artículos</h2>
            <ul className="mt-3 divide-y divide-line">
              {o.items.map((i) => (
                <li key={i.productId + i.size} className="flex items-center gap-4 py-3">
                  <img src={asset(i.image)} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1"><p className="truncate font-bold">{i.name}</p><p className="text-xs text-mute">Talla {i.size} · {i.qty} u.</p></div>
                  <p className="font-bold">{money(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-line pt-3 text-sm"><span className="text-mute">Envío</span><span>{o.shippingFee ? money(o.shippingFee) : "Gratis"}</span></div>
            <div className="flex justify-between pt-1 font-bold"><span>Total</span><span>{money(o.total)}</span></div>
          </section>

          <section className="card p-5 md:p-6">
            <h2 className="display mb-5 text-3xl">Historial</h2>
            <OrderHistory order={o} />
          </section>
        </div>
      </div>

      {zoom && (
        <button onClick={() => setZoom(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6" aria-label="Cerrar">
          <img src={o.proofImage} alt="Comprobante ampliado" className="max-h-full max-w-full rounded-2xl" />
        </button>
      )}
    </div>
  );
}
