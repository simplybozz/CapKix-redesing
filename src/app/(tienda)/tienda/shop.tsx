"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORY_LABELS, Category, SIZE_PRESETS } from "@/lib/types";
import { cx } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { Empty } from "@/components/ui";

const SORTS = { nuevo: "Más nuevo", menor: "Precio: menor", mayor: "Precio: mayor" } as const;

export function Shop() {
  const params = useSearchParams();
  const router = useRouter();
  const cat = (params.get("cat") as Category | null) ?? null;
  const all = useStore((s) => s.products).filter((p) => p.active);

  const [q, setQ] = useState("");
  const [team, setTeam] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState<keyof typeof SORTS>("nuevo");
  const [inStock, setInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const scoped = cat ? all.filter((p) => p.category === cat) : all;
  const teams = [...new Set(scoped.map((p) => p.team))].sort();
  const sizes = cat ? SIZE_PRESETS[cat] : [...SIZE_PRESETS.gorras, ...SIZE_PRESETS.tenis.filter((s) => !SIZE_PRESETS.gorras.includes(s))];

  const list = (() => {
    const term = q.trim().toLowerCase();
    const r = scoped.filter(
      (p) =>
        (!term || `${p.name} ${p.team} ${p.edition} ${p.tags.join(" ")}`.toLowerCase().includes(term)) &&
        (!team || p.team === team) &&
        (!size || p.sizes.some((z) => z.size === size && z.stock > 0)) &&
        (!inStock || p.sizes.some((z) => z.stock > 0)),
    );
    if (sort === "menor") r.sort((a, b) => a.price - b.price);
    else if (sort === "mayor") r.sort((a, b) => b.price - a.price);
    else r.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.createdAt.localeCompare(a.createdAt));
    return r;
  })();

  const setCat = (c: Category | null) => {
    setTeam("");
    setSize("");
    router.push(c ? `/tienda/?cat=${c}` : "/tienda/", { scroll: false });
  };
  const active = [team, size, inStock ? "1" : ""].filter(Boolean).length;

  const Filters = (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3 text-mute">Equipo / línea</p>
        <div className="flex flex-wrap gap-2">
          {teams.map((t) => (
            <button key={t} onClick={() => setTeam(team === t ? "" : t)}
              className={cx("rounded-full border px-3.5 py-2 text-[13px] font-semibold transition", team === t ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink")}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3 text-mute">Talla disponible</p>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((s) => (
            <button key={s} onClick={() => setSize(size === s ? "" : s)}
              className={cx("h-11 rounded-xl border text-[13px] font-bold transition", size === s ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink")}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold">
        Solo disponibles
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-5 w-5 accent-ink" />
      </label>
      {active > 0 && (
        <button onClick={() => { setTeam(""); setSize(""); setInStock(false); }} className="text-sm font-bold underline underline-offset-4">
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-10 md:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-mute">{list.length} {list.length === 1 ? "modelo" : "modelos"}</p>
          <h1 className="display mt-3 text-7xl md:text-9xl">{cat ? (cat === "gorras" ? "Gorras" : "Dunks") : "La tienda"}</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca: Yankees, Boston, Dunk…" className="field rounded-full pl-11" aria-label="Buscar" />
        </div>
      </div>

      <div className="no-scrollbar mt-8 flex items-center gap-2 overflow-x-auto border-b border-line pb-4">
        {([null, "gorras", "tenis"] as (Category | null)[]).map((c) => (
          <button key={c ?? "all"} onClick={() => setCat(c)}
            className={cx("shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition", cat === c ? "bg-ink text-paper" : "bg-white hover:bg-paper-2")}>
            {c ? CATEGORY_LABELS[c] : "Todo"}
          </button>
        ))}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold lg:hidden">
            <SlidersHorizontal size={15} /> Filtros {active > 0 && `(${active})`}
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="rounded-full bg-white px-4 py-2.5 text-sm font-bold outline-none" aria-label="Ordenar">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{Filters}</div>
        </aside>
        <div>
          {list.length === 0 ? (
            <Empty title="Nada por aquí" text="Prueba con otra talla o quita algún filtro. También puedes escribirnos y te lo buscamos." />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {list.map((p, i) => <ProductCard key={p.id} p={p} priority={i < 6} />)}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="display text-4xl">Filtros</p>
              <button onClick={() => setFiltersOpen(false)} aria-label="Cerrar"><X /></button>
            </div>
            {Filters}
            <button onClick={() => setFiltersOpen(false)} className="btn btn-ink mt-8 w-full">Ver {list.length} modelos</button>
          </div>
        </div>
      )}
    </div>
  );
}
