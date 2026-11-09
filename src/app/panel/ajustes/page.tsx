"use client";

import { useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { StoreSettings } from "@/lib/types";
import { Guard } from "@/components/ui";
import { useToast } from "@/components/providers";

export default function SettingsPage() {
  return (
    <Guard roles={["admin"]}>
      <Settings />
    </Guard>
  );
}

function Settings() {
  const current = useStore((s) => s.settings);
  const save = useStore((s) => s.saveSettings);
  const reset = useStore((s) => s.resetDemo);
  const toast = useToast();
  const [s, setS] = useState<StoreSettings>(structuredClone(current));

  const bank = (i: number, patch: Partial<StoreSettings["banks"][number]>) =>
    setS({ ...s, banks: s.banks.map((b, j) => (j === i ? { ...b, ...patch } : b)) });
  const zone = (i: number, patch: Partial<StoreSettings["zones"][number]>) =>
    setS({ ...s, zones: s.zones.map((z, j) => (j === i ? { ...z, ...patch } : z)) });

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-5xl md:text-7xl">Ajustes</h1>
        <button onClick={() => { save(s); toast("Ajustes guardados"); }} className="btn btn-ink">Guardar cambios</button>
      </div>

      <section className="card p-5 md:p-6">
        <h2 className="display text-3xl">Cuentas para transferencias</h2>
        <p className="mt-1 text-sm text-mute">Lo que el cliente ve y copia al pagar.</p>
        <div className="mt-5 space-y-3">
          {s.banks.map((b, i) => (
            <div key={b.id} className="grid gap-2 rounded-2xl bg-paper p-3 md:grid-cols-[14px_1fr_120px_1fr_1fr_auto] md:items-center">
              <input type="color" value={b.color} onChange={(e) => bank(i, { color: e.target.value })} className="h-10 w-full rounded md:h-8 md:w-3.5" aria-label="Color" />
              <input className="field h-10" value={b.bank} onChange={(e) => bank(i, { bank: e.target.value })} aria-label="Banco" />
              <select className="field h-10" value={b.type} onChange={(e) => bank(i, { type: e.target.value as "Ahorros" | "Corriente" })} aria-label="Tipo">
                <option>Ahorros</option><option>Corriente</option>
              </select>
              <input className="field h-10" value={b.number} onChange={(e) => bank(i, { number: e.target.value })} aria-label="Número" />
              <input className="field h-10" value={b.holder} onChange={(e) => bank(i, { holder: e.target.value })} aria-label="Titular" />
              <label className="flex items-center gap-2 px-2 text-xs font-bold">
                <input type="checkbox" checked={b.active} onChange={(e) => bank(i, { active: e.target.checked })} className="accent-ink" /> Activa
              </label>
            </div>
          ))}
        </div>
        <button onClick={() => setS({ ...s, banks: [...s.banks, { id: "b" + Date.now(), bank: "Nuevo banco", type: "Ahorros", number: "", holder: "CapKix SRL", holderId: "", color: "#333333", active: true }] })}
          className="btn btn-sm mt-3 border border-line"><Plus size={14} /> Agregar cuenta</button>
      </section>

      <section className="card p-5 md:p-6">
        <h2 className="display text-3xl">Zonas de envío</h2>
        <div className="mt-5 space-y-2">
          {s.zones.map((z, i) => (
            <div key={z.id} className="grid grid-cols-[minmax(0,1fr)_110px_1fr_auto] items-center gap-2">
              <input className="field h-10" value={z.name} onChange={(e) => zone(i, { name: e.target.value })} aria-label="Zona" />
              <input className="field h-10" type="number" value={z.fee} onChange={(e) => zone(i, { fee: +e.target.value })} aria-label="Costo" />
              <input className="field h-10" value={z.eta} onChange={(e) => zone(i, { eta: e.target.value })} aria-label="Tiempo" />
              <button onClick={() => setS({ ...s, zones: s.zones.filter((_, j) => j !== i) })} className="p-2 text-mute hover:text-accent" aria-label="Quitar"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setS({ ...s, zones: [...s.zones, { id: "z" + Date.now(), name: "Nueva zona", fee: 300, eta: "1 a 2 días" }] })}
          className="btn btn-sm mt-3 border border-line"><Plus size={14} /> Agregar zona</button>
      </section>

      <section className="card grid gap-4 p-5 md:grid-cols-2 md:p-6">
        <h2 className="display text-3xl md:col-span-2">Contacto</h2>
        <div><label className="label" htmlFor="wa">Enlace de WhatsApp</label><input id="wa" className="field" value={s.whatsappUrl} onChange={(e) => setS({ ...s, whatsappUrl: e.target.value })} /></div>
        <div><label className="label" htmlFor="ig">Instagram</label><input id="ig" className="field" value={s.instagram} onChange={(e) => setS({ ...s, instagram: e.target.value })} /></div>
        <div className="md:col-span-2"><label className="label" htmlFor="pk">Nota de entrega en SDQ</label><input id="pk" className="field" value={s.pickupNote} onChange={(e) => setS({ ...s, pickupNote: e.target.value })} /></div>
      </section>

      <section className="rounded-[22px] border border-dashed border-line p-5">
        <p className="font-bold">Reiniciar la demo</p>
        <p className="text-sm text-mute">Vuelve a los productos, pedidos y usuarios de ejemplo. Solo afecta este navegador.</p>
        <button onClick={() => { if (confirm("¿Reiniciar todos los datos de la demo?")) { reset(); location.href = location.pathname.replace(/panel.*$/, ""); } }}
          className="btn btn-sm mt-3 border border-line"><RotateCcw size={14} /> Reiniciar demo</button>
      </section>
    </div>
  );
}
