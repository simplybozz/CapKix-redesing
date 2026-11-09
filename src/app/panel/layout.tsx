"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, LayoutDashboard, LogOut, Package, Receipt, Settings, Users } from "lucide-react";
import { useMe, useStore } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/types";
import { cx } from "@/lib/utils";
import { Guard } from "@/components/ui";
import { Logo } from "@/components/logo";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Guard roles={["vendedor", "admin"]}>
      <Shell>{children}</Shell>
    </Guard>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const me = useMe()!;
  const pathname = usePathname();
  const router = useRouter();
  const logout = useStore((s) => s.logout);
  const pending = useStore((s) => s.orders.filter((o) => o.status === "revision").length);

  const nav = [
    { href: "/panel/", label: "Resumen", icon: LayoutDashboard, exact: true },
    { href: "/panel/pedidos/", label: "Pedidos", icon: Receipt, badge: pending },
    { href: "/panel/productos/", label: "Productos", icon: Package },
    ...(me.role === "admin"
      ? [
          { href: "/panel/usuarios/", label: "Usuarios", icon: Users },
          { href: "/panel/ajustes/", label: "Ajustes", icon: Settings },
        ]
      : []),
  ];
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href || pathname === href.slice(0, -1) : pathname.startsWith(href.slice(0, -1)) || (href === "/panel/pedidos/" && pathname.startsWith("/panel/pedido"));

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="sticky top-0 z-30 flex items-center gap-2 overflow-x-auto bg-ink px-3 py-3 text-paper lg:h-dvh lg:flex-col lg:items-stretch lg:gap-1 lg:overflow-visible lg:px-4 lg:py-6">
        <Link href="/panel/" className="mr-2 shrink-0 px-2 lg:mb-8 lg:mr-0">
          <Logo className="h-8 lg:h-11" />
        </Link>
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cx(
              "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition",
              active(n.href, n.exact) ? "bg-paper text-ink" : "text-paper/70 hover:bg-paper/10 hover:text-paper",
            )}
          >
            <n.icon size={18} />
            {n.label}
            {!!n.badge && <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[11px] text-white">{n.badge}</span>}
          </Link>
        ))}
        <div className="ml-auto flex shrink-0 items-center gap-1 lg:mt-auto lg:ml-0 lg:flex-col lg:items-stretch">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-paper/70 hover:text-paper">
            <ArrowUpRight size={18} /> <span className="hidden lg:inline">Ver tienda</span>
          </Link>
          <div className="hidden rounded-xl bg-paper/5 p-3 lg:block">
            <p className="truncate text-sm font-bold">{me.name}</p>
            <p className="text-xs text-paper/50">{ROLE_LABELS[me.role]}</p>
          </div>
          <button onClick={() => { logout(); router.push("/"); }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-paper/70 hover:text-paper" aria-label="Salir">
            <LogOut size={18} /> <span className="hidden lg:inline">Salir</span>
          </button>
        </div>
      </aside>
      <main className="min-w-0 px-4 pb-20 pt-8 md:px-8 lg:px-12">{children}</main>
    </div>
  );
}
