"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ImageUp, Loader2, RefreshCw } from "lucide-react";
import { useMe } from "@/lib/store";
import { Role } from "@/lib/types";
import { compressImage, cx } from "@/lib/utils";
import { useHydrated } from "./providers";

/** Aparece suavemente al entrar en pantalla. */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Sube una imagen (comprobante o foto de producto) y la reduce para la demo. */
export function ImageDrop({
  value, onChange, label = "Sube la captura del comprobante", hint = "JPG, PNG o captura de pantalla", className,
}: {
  value: string; onChange: (dataUrl: string) => void; label?: string; hint?: string; className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);

  async function take(f?: File) {
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      onChange(await compressImage(f));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files[0]); }}
        className={cx(
          "group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[22px] border-2 border-dashed text-center transition",
          value ? "border-transparent bg-ink" : "min-h-56 border-line bg-white hover:border-ink",
          over && "border-ink bg-paper-2",
        )}
      >
        {value ? (
          <>
            <img src={value} alt="Comprobante" className="max-h-80 w-full object-contain" />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-bold">
              <RefreshCw size={13} /> Cambiar
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper transition group-hover:scale-110">
              {busy ? <Loader2 className="animate-spin" /> : <ImageUp />}
            </span>
            <span className="font-bold">{label}</span>
            <span className="text-xs text-mute">{hint} · arrastra o toca para elegir</span>
          </div>
        )}
      </button>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => take(e.target.files?.[0])} />
      {error && <p className="mt-2 text-sm font-semibold text-accent">{error}</p>}
    </div>
  );
}

/** Protege una vista por sesión / rol. */
export function Guard({ roles, children }: { roles?: Role[]; children: React.ReactNode }) {
  const hydrated = useHydrated();
  const me = useMe();
  const router = useRouter();
  const allowed = !!me && (!roles || roles.includes(me.role));

  useEffect(() => {
    if (!hydrated) return;
    if (!me) {
      // Ruta actual sin el basePath (GitHub Pages lo agrega solo al navegar).
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      const here = location.pathname.slice(base.length) + location.search;
      router.replace(`/entrar/?next=${encodeURIComponent(here)}`);
    }
    else if (!allowed) router.replace("/");
  }, [hydrated, me, allowed, router]);

  if (!hydrated || !allowed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-mute" />
      </div>
    );
  }
  return <>{children}</>;
}

export function Empty({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="display text-4xl">{title}</p>
      <p className="max-w-sm text-sm text-mute">{text}</p>
      {action}
    </div>
  );
}
