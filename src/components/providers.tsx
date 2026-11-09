"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "@/lib/store";

const HydratedCtx = createContext(false);
/** true cuando ya se leyó la base de datos del navegador. */
export const useHydrated = () => useContext(HydratedCtx);

type Toast = { id: number; text: string; tone: "ok" | "error" };
const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function Providers({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    Promise.resolve(useStore.persist.rehydrate()).finally(() => setHydrated(true));
    // Si el panel está abierto en otra pestaña, los cambios se ven aquí.
    const onStorage = (e: StorageEvent) => {
      if (e.key === useStore.persist.getOptions().name) useStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toast = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <HydratedCtx.Provider value={hydrated}>
      <ToastCtx.Provider value={toast}>
        {children}
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex flex-col items-center gap-2 px-4">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                className={`pointer-events-auto rounded-full px-5 py-3 text-sm font-semibold shadow-xl ${
                  t.tone === "ok" ? "bg-ink text-paper" : "bg-accent text-white"
                }`}
                role="status"
              >
                {t.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ToastCtx.Provider>
    </HydratedCtx.Provider>
  );
}
