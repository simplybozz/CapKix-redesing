"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { money } from "@/lib/utils";
import { Reveal } from "@/components/ui";

const STEPS = [
  { t: "Crea tu cuenta", s: "Solo nombre, correo y teléfono. Así guardas tus pedidos y comprobantes en un solo lugar." },
  { t: "Elige tu talla", s: "Agrega tus gorras o Dunks al carrito. Ves las tallas disponibles en vivo." },
  { t: "Transfiere", s: "Elige el banco, copia la cuenta y el monto con un toque y haz la transferencia desde tu app." },
  { t: "Sube el comprobante", s: "Una captura de pantalla basta. Puedes agregar el número de referencia." },
  { t: "Te confirmamos", s: "El equipo de CapKix valida el pago desde su panel y cambia el estado de tu pedido." },
  { t: "Recibe", s: "Te lo enviamos o lo entregamos en Santo Domingo. Sigues todo desde Mi cuenta." },
];

const FAQ = [
  { q: "¿Los productos son originales?", a: "Sí. Todo lo que vendemos es 100% original." },
  { q: "¿Qué pasa si rechazan mi comprobante?", a: "Verás el motivo en tu pedido y podrás subir otro sin volver a comprar. Tu talla queda apartada." },
  { q: "¿Cómo sé mi talla de gorra fitted?", a: "Mide el contorno de tu cabeza en centímetros (por encima de las orejas) y escríbenos por WhatsApp. Te decimos la talla exacta." },
  { q: "¿Puedo cancelar?", a: "Mientras el comprobante esté en revisión o rechazado, puedes cancelar desde tu pedido." },
];

export default function HowToBuy() {
  const zones = useStore((s) => s.settings.zones);
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-10 md:px-8">
      <p className="eyebrow text-mute">Cómo comprar</p>
      <h1 className="display mt-3 text-7xl md:text-[140px]">Fácil y<br />sin enredos.</h1>

      <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.t} delay={(i % 3) * 0.06}>
            <li className="card h-full p-6">
              <p className="display text-6xl text-line">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-4 text-lg font-bold">{s.t}</p>
              <p className="mt-1 text-sm text-mute">{s.s}</p>
            </li>
          </Reveal>
        ))}
      </ol>

      <section className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="display text-5xl md:text-6xl">Envíos</h2>
          <ul className="mt-6 divide-y divide-line rounded-[22px] bg-white">
            {zones.map((z) => (
              <li key={z.id} className="flex items-center justify-between p-5">
                <div><p className="font-bold">{z.name}</p><p className="text-sm text-mute">{z.eta}</p></div>
                <p className="display text-2xl">{money(z.fee)}</p>
              </li>
            ))}
            <li className="flex items-center justify-between p-5">
              <div><p className="font-bold">Entrega en Santo Domingo</p><p className="text-sm text-mute">Punto acordado por WhatsApp</p></div>
              <p className="display text-2xl">Gratis</p>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="display text-5xl md:text-6xl">Preguntas</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold">
                  {f.q} <span className="text-xl transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-mute">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-16 flex justify-center">
        <Link href="/tienda/" className="btn btn-ink h-14 px-8">Empezar a comprar</Link>
      </div>
    </div>
  );
}
