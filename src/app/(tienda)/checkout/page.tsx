"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Copy, Lock, MapPin, Truck } from "lucide-react";
import { useMe, useStore } from "@/lib/store";
import { asset, cx, money } from "@/lib/utils";
import { Empty, Guard, ImageDrop } from "@/components/ui";
import { useCartLines } from "@/components/cart-drawer";
import { useToast } from "@/components/providers";

const PROVINCES = [
  "Distrito Nacional", "Santo Domingo", "Santiago", "La Vega", "Puerto Plata", "San Cristóbal", "La Romana",
  "San Pedro de Macorís", "La Altagracia", "Duarte", "Espaillat", "Peravia", "Azua", "Otra",
];

export default function CheckoutPage() {
  return (
    <Guard>
      <Checkout />
    </Guard>
  );
}

function Step({ n, title, done, children }: { n: number; title: string; done: boolean; children: React.ReactNode }) {
  return (
    <section className="card p-5 md:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className={cx("flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold", done ? "bg-ok text-white" : "bg-ink text-paper")}>
          {done ? <Check size={16} /> : n}
        </span>
        <h2 className="display text-3xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Checkout() {
  const me = useMe()!;
  const settings = useStore((s) => s.settings);
  const checkout = useStore((s) => s.checkout);
  const { lines, subtotal } = useCartLines();
  const router = useRouter();
  const toast = useToast();

  const [delivery, setDelivery] = useState<"envio" | "retiro">("envio");
  const [zoneId, setZoneId] = useState(settings.zones[0]?.id ?? "");
  const [address, setAddress] = useState({ province: "Santo Domingo", city: "", street: "", reference: "" });
  const [phone, setPhone] = useState(me.phone);
  const banks = settings.banks.filter((b) => b.active);
  const [bankId, setBankId] = useState("");
  const [proof, setProof] = useState("");
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const zone = settings.zones.find((z) => z.id === zoneId);
  const fee = delivery === "envio" ? zone?.fee ?? 0 : 0;
  const total = subtotal + fee;
  const deliveryOk = delivery === "retiro" || (!!zone && address.city.trim() && address.street.trim());
  const bank = banks.find((b) => b.id === bankId);

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <Empty title="Carrito vacío" text="Agrega una gorra o unos Dunks para continuar." action={<Link href="/tienda/" className="btn btn-ink">Ir a la tienda</Link>} />
      </div>
    );
  }

  async function copy(text: string, key: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  }

  function submit() {
    setError("");
    if (!deliveryOk) return setError("Completa los datos de entrega.");
    if (!phone.trim()) return setError("Escribe un teléfono de contacto.");
    setBusy(true);
    try {
      const r = checkout({
        delivery, zoneId, address: delivery === "envio" ? address : undefined, phone, bankId, proofImage: proof, proofReference: reference,
      });
      if (r.error) return setError(r.error);
      toast("¡Pedido enviado! Estamos revisando tu comprobante");
      router.push(`/cuenta/pedido/?id=${r.order!.id}&nuevo=1`);
    } catch (e) {
      setError((e as Error).message.includes("quota") ? "La imagen es muy pesada para la demo. Prueba con otra captura." : (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-10 md:px-8">
      <p className="eyebrow text-mute">Pago seguro por transferencia</p>
      <h1 className="display mt-3 text-6xl md:text-8xl">Finalizar compra</h1>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <Step n={1} title="Entrega" done={!!deliveryOk}>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { k: "envio", t: "Envío a domicilio", s: "A todo el país", i: <Truck size={18} /> },
                { k: "retiro", t: "Entrega en SDQ", s: "Punto acordado · Gratis", i: <MapPin size={18} /> },
              ] as const).map((o) => (
                <button key={o.k} onClick={() => setDelivery(o.k)}
                  className={cx("flex items-center gap-3 rounded-2xl border-[1.5px] p-4 text-left transition", delivery === o.k ? "border-ink bg-paper" : "border-line hover:border-ink")}>
                  {o.i}
                  <span><span className="block font-bold">{o.t}</span><span className="text-xs text-mute">{o.s}</span></span>
                </button>
              ))}
            </div>

            {delivery === "envio" ? (
              <div className="mt-5 space-y-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  {settings.zones.map((z) => (
                    <button key={z.id} onClick={() => setZoneId(z.id)}
                      className={cx("rounded-2xl border-[1.5px] p-3 text-left transition", zoneId === z.id ? "border-ink bg-paper" : "border-line hover:border-ink")}>
                      <span className="block text-sm font-bold">{z.name}</span>
                      <span className="text-xs text-mute">{money(z.fee)} · {z.eta}</span>
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="prov">Provincia</label>
                    <select id="prov" className="field" value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })}>
                      {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="city">Ciudad / sector</label>
                    <input id="city" className="field" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Ej. Naco, Santo Domingo" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="street">Calle y número</label>
                    <input id="street" className="field" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="C/ Fantino Falco #20, apto 4B" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="ref">Referencia <span className="font-normal text-mute">(opcional)</span></label>
                    <input id="ref" className="field" value={address.reference} onChange={(e) => setAddress({ ...address, reference: e.target.value })} placeholder="Frente al parque, edificio blanco" />
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-2xl bg-paper p-4 text-sm">{settings.pickupNote}</p>
            )}
            <div className="mt-4">
              <label className="label" htmlFor="phone">Teléfono / WhatsApp</label>
              <input id="phone" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="809-000-0000" />
            </div>
          </Step>

          <Step n={2} title="Transfiere" done={!!bank}>
            <p className="mb-4 text-sm text-mute">
              Transfiere <b className="text-ink">{money(total)}</b> a una de estas cuentas y elige a cuál lo hiciste.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {banks.map((b) => (
                <button key={b.id} onClick={() => setBankId(b.id)}
                  className={cx("relative overflow-hidden rounded-[20px] p-4 text-left text-white transition", bankId === b.id ? "ring-4 ring-ink ring-offset-2" : "opacity-90 hover:opacity-100")}
                  style={{ background: b.color }}>
                  {bankId === b.id && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink"><Check size={14} /></span>}
                  <p className="font-bold">{b.bank}</p>
                  <p className="text-xs opacity-75">{b.type}</p>
                  <p className="mt-6 font-mono text-sm tracking-wider">{b.number}</p>
                  <p className="text-[11px] opacity-75">{b.holder} · {b.holderId}</p>
                </button>
              ))}
            </div>
            {bank && (
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { k: "num", t: `Copiar cuenta ${bank.number}`, v: bank.number },
                  { k: "id", t: "Copiar RNC / cédula", v: bank.holderId },
                  { k: "amt", t: `Copiar monto ${money(total)}`, v: String(total) },
                ].map((c) => (
                  <button key={c.k} onClick={() => copy(c.v, c.k)} className="btn btn-sm border border-line bg-white">
                    {copied === c.k ? <Check size={14} className="text-ok" /> : <Copy size={14} />} {copied === c.k ? "Copiado" : c.t}
                  </button>
                ))}
              </div>
            )}
          </Step>

          <Step n={3} title="Sube tu comprobante" done={!!proof}>
            <ImageDrop value={proof} onChange={setProof} />
            <div className="mt-4">
              <label className="label" htmlFor="refnum">Número de referencia <span className="font-normal text-mute">(opcional, ayuda a validar más rápido)</span></label>
              <input id="refnum" className="field" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Ej. 84720193" />
            </div>
          </Step>
        </div>

        {/* Resumen */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-5 md:p-6">
            <p className="display text-3xl">Tu pedido</p>
            <ul className="mt-5 space-y-3">
              {lines.map((l) => (
                <li key={l.productId + l.size} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={asset(l.product.images[0])} alt="" className="h-16 w-16 rounded-xl object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-paper">{l.qty}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{l.product.name}</p>
                    <p className="text-xs text-mute">Talla {l.size}</p>
                  </div>
                  <p className="text-sm font-bold">{money(l.product.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-mute">Subtotal</dt><dd className="font-semibold">{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-mute">Envío</dt><dd className="font-semibold">{fee ? money(fee) : "Gratis"}</dd></div>
              <div className="flex items-end justify-between pt-2"><dt className="font-bold">Total a transferir</dt><dd className="display text-3xl">{money(total)}</dd></div>
            </dl>
            {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-accent">{error}</p>}
            <button onClick={submit} disabled={busy || !deliveryOk || !bank || !proof} className="btn btn-ink mt-5 h-14 w-full">
              <Lock size={16} /> Enviar pedido y comprobante
            </button>
            <p className="mt-3 text-center text-xs text-mute">
              {!deliveryOk ? "Completa la entrega" : !bank ? "Elige la cuenta a la que transferiste" : !proof ? "Sube la captura del comprobante" : "Te avisamos cuando se confirme el pago"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
