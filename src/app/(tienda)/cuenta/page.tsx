"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight, LogOut } from "lucide-react";
import { useMe, useStore } from "@/lib/store";
import { asset, dateShort, money } from "@/lib/utils";
import { Empty, Guard } from "@/components/ui";
import { OrderProgress, StatusBadge } from "@/components/order-bits";
import { useToast } from "@/components/providers";

export default function AccountPage() {
  return (
    <Guard>
      <Account />
    </Guard>
  );
}

function Account() {
  const me = useMe()!;
  const orders = useStore((s) => s.orders).filter((o) => o.userId === me.id);
  const logout = useStore((s) => s.logout);
  const updateProfile = useStore((s) => s.updateProfile);
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState(me.name);
  const [phone, setPhone] = useState(me.phone);
  const attention = orders.filter((o) => o.status === "rechazado");

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-10 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-mute">Mi cuenta</p>
          <h1 className="display mt-3 text-6xl md:text-8xl">Hola, {me.name.split(" ")[0]}</h1>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} className="btn btn-ghost btn-sm"><LogOut size={14} /> Salir</button>
      </div>

      {attention.length > 0 && (
        <Link href={`/cuenta/pedido/?id=${attention[0].id}`} className="mt-8 flex items-center gap-4 rounded-[22px] bg-accent p-5 text-white">
          <span className="display text-4xl">!</span>
          <div className="flex-1">
            <p className="font-bold">Tienes un comprobante rechazado</p>
            <p className="text-sm opacity-85">Pedido #{attention[0].number}: revisa el motivo y sube uno nuevo sin volver a comprar.</p>
          </div>
          <ChevronRight />
        </Link>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <h2 className="display text-4xl">Mis pedidos</h2>
          <div className="mt-5 space-y-3">
            {orders.length === 0 && (
              <Empty title="Sin pedidos" text="Cuando compres, aquí verás cada pedido y su comprobante." action={<Link href="/tienda/" className="btn btn-ink">Ir a la tienda</Link>} />
            )}
            {orders.map((o) => (
              <Link key={o.id} href={`/cuenta/pedido/?id=${o.id}`} className="card block p-5 transition hover:border-ink">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {o.items.slice(0, 3).map((i) => (
                        <img key={i.productId + i.size} src={asset(i.image)} alt="" className="h-12 w-12 rounded-xl border-2 border-white object-cover" />
                      ))}
                    </div>
                    <div>
                      <p className="font-bold">Pedido #{o.number}</p>
                      <p className="text-xs text-mute">{dateShort(o.createdAt)} · {o.items.reduce((a, i) => a + i.qty, 0)} artículos · {money(o.total)}</p>
                    </div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="mt-5"><OrderProgress order={o} /></div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="card h-fit p-5 md:p-6">
          <h2 className="display text-3xl">Mis datos</h2>
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => { e.preventDefault(); updateProfile({ name, phone }); toast("Datos guardados"); }}
          >
            <div><label className="label" htmlFor="n">Nombre</label><input id="n" className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className="label" htmlFor="p">Teléfono</label><input id="p" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div><label className="label">Correo</label><p className="text-sm text-mute">{me.email}</p></div>
            <button className="btn btn-ink btn-sm w-full">Guardar</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
