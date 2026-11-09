"use client";

import { useMe, useStore } from "@/lib/store";
import { Role, ROLE_LABELS } from "@/lib/types";
import { cx, dateShort } from "@/lib/utils";
import { Guard } from "@/components/ui";
import { useToast } from "@/components/providers";

export default function UsersPage() {
  return (
    <Guard roles={["admin"]}>
      <Users />
    </Guard>
  );
}

function Users() {
  const me = useMe()!;
  const users = useStore((s) => s.users);
  const orders = useStore((s) => s.orders);
  const setRole = useStore((s) => s.setRole);
  const toggle = useStore((s) => s.toggleUser);
  const toast = useToast();

  return (
    <div className="mx-auto max-w-[1100px]">
      <h1 className="display text-5xl md:text-7xl">Usuarios</h1>
      <p className="mt-2 text-sm text-mute">Todo el que se registra entra como <b>Cliente</b>. Aquí das acceso al panel a tu equipo.</p>
      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
        <p className="rounded-xl bg-white p-3"><b>Cliente:</b> compra y ve sus pedidos.</p>
        <p className="rounded-xl bg-white p-3"><b>Vendedor:</b> valida comprobantes, despacha y maneja productos.</p>
        <p className="rounded-xl bg-white p-3"><b>Administrador:</b> todo, más usuarios, bancos y zonas de envío.</p>
      </div>
      <div className="card mt-6 divide-y divide-line">
        {users.map((u) => (
          <div key={u.id} className={cx("flex flex-wrap items-center gap-4 p-4", !u.active && "opacity-50")}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper font-bold">{u.name[0]}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{u.name} {u.id === me.id && <span className="text-xs text-mute">(tú)</span>}</p>
              <p className="truncate text-xs text-mute">{u.email} · {u.phone} · desde {dateShort(u.createdAt)} · {orders.filter((o) => o.userId === u.id).length} pedidos</p>
            </div>
            <select
              disabled={u.id === me.id}
              value={u.role}
              onChange={(e) => { setRole(u.id, e.target.value as Role); toast(`${u.name.split(" ")[0]} ahora es ${ROLE_LABELS[e.target.value as Role]}`); }}
              className="field h-10 w-40"
              aria-label="Rol"
            >
              {(Object.keys(ROLE_LABELS) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
            <button disabled={u.id === me.id} onClick={() => toggle(u.id)} className="btn btn-sm border border-line disabled:opacity-30">
              {u.active ? "Desactivar" : "Activar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
