"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DEMO_ACCOUNTS, DEMO_PASSWORD, useStore } from "@/lib/store";
import { asset } from "@/lib/utils";
import { useToast } from "./providers";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const login = useStore((s) => s.login);
  const register = useStore((s) => s.register);
  const users = useStore((s) => s.users);
  const router = useRouter();
  const next = useSearchParams().get("next");
  const toast = useToast();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function go(email: string) {
    const u = users.find((x) => x.email === email.trim().toLowerCase());
    const fallback = u && u.role !== "cliente" ? "/panel/" : "/cuenta/";
    router.push(next && next.startsWith("/") ? next : fallback);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "register" && f.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    setBusy(true);
    const err = mode === "login" ? await login(f.email, f.password) : await register(f);
    setBusy(false);
    if (err) return setError(err);
    toast(mode === "login" ? "¡Bienvenido de vuelta!" : "Cuenta creada. ¡Bienvenido a CapKix!");
    go(f.email);
  }

  async function demo(email: string) {
    setBusy(true);
    const err = await login(email, DEMO_PASSWORD);
    setBusy(false);
    if (err) return setError(err);
    go(email);
  }

  const qs = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 px-4 pt-8 md:px-8 lg:grid-cols-2">
      <div className="relative hidden min-h-[620px] overflow-hidden rounded-[28px] bg-ink lg:block">
        <img src={asset("/brand/hero-bokeh.webp")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-x-10 bottom-10 text-paper">
          <p className="display text-7xl">Tu cuenta,<br />tus pedidos.</p>
          <p className="mt-4 max-w-sm text-paper/70">Sigue cada compra paso a paso, guarda tus comprobantes y repite tus favoritas sin escribir por chat.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center py-6 lg:px-10">
        <p className="eyebrow text-mute">{mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}</p>
        <h1 className="display mt-3 text-6xl md:text-7xl">{mode === "login" ? "Entrar" : "Registrarme"}</h1>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="label" htmlFor="name">Nombre completo</label>
                <input id="name" required className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" />
              </div>
              <div>
                <label className="label" htmlFor="phone">Teléfono / WhatsApp</label>
                <input id="phone" required className="field" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="809-000-0000" autoComplete="tel" />
              </div>
            </>
          )}
          <div>
            <label className="label" htmlFor="email">Correo</label>
            <input id="email" type="email" required className="field" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="pw">Contraseña</label>
            <input id="pw" type="password" required className="field" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })}
              autoComplete={mode === "login" ? "current-password" : "new-password"} />
          </div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-accent">{error}</p>}
          <button disabled={busy} className="btn btn-ink h-14 w-full">
            {busy && <Loader2 size={16} className="animate-spin" />} {mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-sm text-mute">
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <Link href={(mode === "login" ? "/registro/" : "/entrar/") + qs} className="font-bold text-ink underline underline-offset-4">
            {mode === "login" ? "Regístrate" : "Entra"}
          </Link>
        </p>

        {mode === "login" && (
          <div className="mt-10 rounded-[22px] border border-dashed border-line p-5">
            <p className="eyebrow text-mute">Demo · entra con un toque</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.email} onClick={() => demo(a.email)} disabled={busy} className="btn btn-sm border border-line bg-white px-2">
                  {a.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-mute">Contraseña de todas las cuentas demo: <b>{DEMO_PASSWORD}</b></p>
          </div>
        )}
      </div>
    </div>
  );
}
