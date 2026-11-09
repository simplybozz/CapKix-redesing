"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { OrderStatus, STATUS_LABELS } from "@/lib/types";
import { cx, dateTime, money } from "@/lib/utils";
import { StatusBadge } from "@/components/order-bits";

const TABS: (OrderStatus | "todos")[] = ["revision", "confirmado", "enviado", "listo", "rechazado", "entregado", "cancelado", "todos"];

export default function OrdersPage() {
  const orders = useStore((s) => s.orders);
  const [tab, setTab] = useState<OrderStatus | "todos">("revision");
  const [q, setQ] = useState("");
  const count = (t: OrderStatus | "todos") => (t === "todos" ? orders.length : orders.filter((o) => o.status === t).length);
  const term = q.trim().toLowerCase();
  const list = orders
    .filter((o) => tab === "todos" || o.status === tab)
    .filter((o) => !term || `${o.number} ${o.customerName} ${o.customerPhone} ${o.proofReference}`.toLowerCase().includes(term));

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-5xl md:text-7xl">Pedidos</h1>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input className="field rounded-full pl-10" placeholder="# pedido, cliente, referencia" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cx("flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition", tab === t ? "bg-ink text-paper" : "bg-white hover:bg-paper-2")}>
            {t === "todos" ? "Todos" : STATUS_LABELS[t]}
            <span className={cx("rounded-full px-1.5 text-[11px]", tab === t ? "bg-paper/20" : "bg-paper")}>{count(t)}</span>
          </button>
        ))}
      </div>

      <div className="card mt-5 overflow-hidden">
        {list.length === 0 ? (
          <p className="p-10 text-center text-sm text-mute">No hay pedidos en este estado.</p>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((o) => (
              <li key={o.id}>
                <Link href={`/panel/pedido/?id=${o.id}`} className="grid grid-cols-[48px_1fr_auto] items-center gap-4 p-4 transition hover:bg-paper md:grid-cols-[48px_90px_1fr_160px_120px_auto]">
                  <img src={o.proofImage} alt="" className="h-14 w-12 rounded-lg bg-paper object-cover" />
                  <p className="hidden font-bold md:block">#{o.number}</p>
                  <div className="min-w-0">
                    <p className="truncate font-bold"><span className="md:hidden">#{o.number} · </span>{o.customerName}</p>
                    <p className="truncate text-xs text-mute">{o.items.map((i) => i.name).join(", ")}</p>
                  </div>
                  <p className="hidden text-xs text-mute md:block">{dateTime(o.updatedAt)}</p>
                  <p className="hidden font-bold md:block">{money(o.total)}</p>
                  <StatusBadge status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
