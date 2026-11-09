"use client";

import { Check, Clock, PackageCheck, Truck, X } from "lucide-react";
import { Order, OrderStatus, STATUS_LABELS } from "@/lib/types";
import { cx, dateTime } from "@/lib/utils";

const TONE: Record<OrderStatus, string> = {
  revision: "bg-amber-100 text-amber-900",
  rechazado: "bg-red-100 text-red-800",
  confirmado: "bg-emerald-100 text-emerald-900",
  enviado: "bg-sky-100 text-sky-900",
  listo: "bg-sky-100 text-sky-900",
  entregado: "bg-ink text-paper",
  cancelado: "bg-paper-2 text-mute",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold", TONE[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

/** Barra de progreso del pedido en 4 pasos. */
export function OrderProgress({ order }: { order: Order }) {
  const last = order.delivery === "envio" ? "enviado" : "listo";
  const steps: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: "revision", label: "Comprobante", icon: <Clock size={16} /> },
    { key: "confirmado", label: "Pago confirmado", icon: <Check size={16} /> },
    { key: last, label: order.delivery === "envio" ? "En camino" : "Listo", icon: <Truck size={16} /> },
    { key: "entregado", label: "Entregado", icon: <PackageCheck size={16} /> },
  ];
  const order_ = ["revision", "confirmado", last, "entregado"];
  const idx = order.status === "rechazado" ? 0 : order_.indexOf(order.status);
  if (order.status === "cancelado") {
    return <p className="flex items-center gap-2 text-sm font-semibold text-mute"><X size={16} /> Pedido cancelado</p>;
  }
  return (
    <ol className="grid grid-cols-4 gap-2">
      {steps.map((s, i) => {
        const done = i < idx || order.status === "entregado";
        const current = i === idx && order.status !== "entregado";
        const bad = current && order.status === "rechazado";
        return (
          <li key={s.key} className="flex flex-col gap-2">
            <div className={cx("h-1.5 rounded-full", done ? "bg-ink" : current ? (bad ? "bg-accent" : "bg-ink/40") : "bg-line")} />
            <span className={cx("flex items-center gap-1.5 text-[11px] font-bold md:text-xs", done || current ? "text-ink" : "text-mute", bad && "text-accent")}>
              <span className="hidden md:inline">{s.icon}</span>
              {bad ? "Rechazado" : s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderHistory({ order }: { order: Order }) {
  return (
    <ol className="relative space-y-5 border-l-2 border-line pl-6">
      {[...order.history].reverse().map((h, i) => (
        <li key={i} className="relative">
          <span className={cx("absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-white", i === 0 ? "bg-ink" : "bg-line")} />
          <p className="text-sm font-bold">{STATUS_LABELS[h.status]}</p>
          <p className="text-xs text-mute">{dateTime(h.at)} · {h.by}</p>
          {h.note && <p className="mt-1 rounded-xl bg-paper px-3 py-2 text-sm">{h.note}</p>}
        </li>
      ))}
    </ol>
  );
}
