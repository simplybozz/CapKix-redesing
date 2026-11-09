"use client";

import Link from "next/link";
import { ArrowRight, Clock, PackageCheck, TrendingUp, Truck } from "lucide-react";
import { useMe, useStore } from "@/lib/store";
import { asset, money, timeAgo } from "@/lib/utils";
import { StatusBadge } from "@/components/order-bits";

export default function Dashboard() {
  const me = useMe()!;
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const review = orders.filter((o) => o.status === "revision");
  const toShip = orders.filter((o) => o.status === "confirmado");
  const paid = orders.filter((o) => ["confirmado", "enviado", "listo", "entregado"].includes(o.status));
  const sales = paid.reduce((a, o) => a + o.total, 0);
  const lowStock = products
    .flatMap((p) => p.sizes.filter((z) => z.stock <= 1).map((z) => ({ p, z })))
    .filter((x) => x.p.active)
    .slice(0, 6);

  const kpis = [
    { label: "Comprobantes por revisar", value: review.length, icon: Clock, tone: review.length ? "bg-accent text-white" : "bg-white" },
    { label: "Pagados por despachar", value: toShip.length, icon: Truck, tone: "bg-white" },
    { label: "Pedidos pagados", value: paid.length, icon: PackageCheck, tone: "bg-white" },
    { label: "Ventas confirmadas", value: money(sales), icon: TrendingUp, tone: "bg-ink text-paper" },
  ];

  return (
    <div className="mx-auto max-w-[1200px]">
      <p className="eyebrow text-mute">Panel CapKix</p>
      <h1 className="display mt-2 text-5xl md:text-7xl">Buenas, {me.name.split(" ")[0]}</h1>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className={`rounded-[22px] border border-line p-5 ${k.tone}`}>
            <k.icon size={20} className="opacity-70" />
            <p className="display mt-6 text-4xl md:text-5xl">{k.value}</p>
            <p className="mt-1 text-xs font-semibold opacity-70">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="card p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="display text-3xl">Por revisar</h2>
            <Link href="/panel/pedidos/" className="text-sm font-bold underline underline-offset-4">Ver todos</Link>
          </div>
          <ul className="mt-4 space-y-2">
            {review.length === 0 && <li className="rounded-2xl bg-paper p-6 text-center text-sm text-mute">Todo al día. No hay comprobantes pendientes. 🙌</li>}
            {review.map((o) => (
              <li key={o.id}>
                <Link href={`/panel/pedido/?id=${o.id}`} className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-paper">
                  <img src={o.proofImage} alt="" className="h-14 w-11 rounded-lg bg-paper object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">#{o.number} · {o.customerName}</p>
                    <p className="text-xs text-mute">{timeAgo(o.updatedAt)} · {o.bankSnapshot.split(" · ")[0]}</p>
                  </div>
                  <p className="font-bold">{money(o.total)}</p>
                  <ArrowRight size={16} className="text-mute" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5 md:p-6">
          <h2 className="display text-3xl">Tallas por agotarse</h2>
          <ul className="mt-4 space-y-2">
            {lowStock.map(({ p, z }) => (
              <li key={p.id + z.size} className="flex items-center gap-3">
                <img src={asset(p.images[0])} alt="" className="h-11 w-11 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{p.name}</p>
                  <p className="text-xs text-mute">Talla {z.size}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${z.stock === 0 ? "bg-ink text-paper" : "bg-amber-100 text-amber-900"}`}>
                  {z.stock === 0 ? "Agotada" : "Queda 1"}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/panel/productos/" className="btn btn-ghost btn-sm mt-5 w-full">Manejar inventario</Link>
        </section>
      </div>

      <section className="card mt-6 p-5 md:p-6">
        <h2 className="display text-3xl">Últimos movimientos</h2>
        <ul className="mt-4 divide-y divide-line">
          {orders.slice(0, 6).map((o) => (
            <li key={o.id}>
              <Link href={`/panel/pedido/?id=${o.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:opacity-80">
                <p className="w-16 font-bold">#{o.number}</p>
                <p className="min-w-0 flex-1 truncate text-sm">{o.customerName}</p>
                <p className="text-xs text-mute">{timeAgo(o.updatedAt)}</p>
                <StatusBadge status={o.status} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
