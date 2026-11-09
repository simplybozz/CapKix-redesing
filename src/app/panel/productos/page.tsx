"use client";

import { useState } from "react";
import { Eye, EyeOff, Minus, Pencil, Plus, Search, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Category, CATEGORY_LABELS, Product, SIZE_PRESETS } from "@/lib/types";
import { asset, cx, money } from "@/lib/utils";
import { ImageDrop } from "@/components/ui";
import { useToast } from "@/components/providers";

const blank = (category: Category): Product => ({
  id: "", slug: "", name: "", team: "", edition: "", category, price: 0, description: "",
  images: [], sizes: SIZE_PRESETS[category].map((size) => ({ size, stock: 0 })), tags: [],
  isNew: true, featured: false, active: true, createdAt: new Date().toISOString(),
});

export default function ProductsPage() {
  const products = useStore((s) => s.products);
  const toggle = useStore((s) => s.toggleProduct);
  const [editing, setEditing] = useState<Product | null>(null);
  const [cat, setCat] = useState<Category | "">("");
  const [q, setQ] = useState("");
  const list = products.filter((p) => (!cat || p.category === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-5xl md:text-7xl">Productos</h1>
        <button onClick={() => setEditing(blank("gorras"))} className="btn btn-ink"><Plus size={16} /> Nuevo producto</button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["", "gorras", "tenis"] as const).map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cx("rounded-full px-4 py-2 text-sm font-bold", cat === c ? "bg-ink text-paper" : "bg-white")}>
            {c ? CATEGORY_LABELS[c] : "Todos"}
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input className="field h-10 rounded-full pl-10" placeholder="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="card mt-5 divide-y divide-line">
        {list.map((p) => {
          const stock = p.sizes.reduce((a, s) => a + s.stock, 0);
          return (
            <div key={p.id} className={cx("flex items-center gap-4 p-4", !p.active && "opacity-50")}>
              <img src={asset(p.images[0])} alt="" className="h-16 w-16 rounded-xl bg-paper object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{p.name}</p>
                <p className="truncate text-xs text-mute">{p.edition}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {p.sizes.map((z) => (
                    <span key={z.size} className={cx("rounded-md px-1.5 py-0.5 text-[10px] font-bold", z.stock === 0 ? "bg-paper text-mute line-through" : z.stock <= 1 ? "bg-amber-100 text-amber-900" : "bg-paper")}>
                      {z.size}·{z.stock}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <p className="font-bold">{money(p.price)}</p>
                <p className="text-xs text-mute">{stock} en inventario</p>
              </div>
              <button onClick={() => toggle(p.id)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper" aria-label={p.active ? "Ocultar" : "Publicar"} title={p.active ? "Ocultar de la tienda" : "Publicar"}>
                {p.active ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button onClick={() => setEditing(structuredClone(p))} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper" aria-label="Editar">
                <Pencil size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {editing && <Editor initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function Editor({ initial, onClose }: { initial: Product; onClose: () => void }) {
  const save = useStore((s) => s.saveProduct);
  const toast = useToast();
  const [p, setP] = useState(initial);
  const isNew = !initial.id;
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  const stock = (size: string, d: number) =>
    set("sizes", p.sizes.map((z) => (z.size === size ? { ...z, stock: Math.max(0, z.stock + d) } : z)));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!p.name.trim() || !p.price || !p.images.length) return toast("Falta nombre, precio o foto", "error");
    const slug = p.slug || p.name.toLowerCase().normalize("NFD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") + "-" + Date.now().toString(36).slice(-4);
    try {
      save({ ...p, slug, team: p.team || p.name.split(" ").slice(0, 2).join(" ") });
      toast(isNew ? "Producto publicado" : "Cambios guardados");
      onClose();
    } catch {
      toast("La foto es muy pesada para la demo", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <form onSubmit={submit} className="relative flex h-full w-full max-w-xl flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="display text-4xl">{isNew ? "Nuevo producto" : "Editar"}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar"><X /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {isNew && (
            <div className="grid grid-cols-2 gap-2">
              {(["gorras", "tenis"] as const).map((c) => (
                <button type="button" key={c} onClick={() => setP({ ...blank(c), name: p.name, images: p.images, price: p.price })}
                  className={cx("rounded-2xl border-[1.5px] p-3 text-sm font-bold", p.category === c ? "border-ink bg-white" : "border-line")}>
                  {CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
          )}
          <div>
            <p className="label">Fotos</p>
            <div className="grid grid-cols-4 gap-2">
              {p.images.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                  <img src={asset(src)} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => set("images", p.images.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-paper p-1" aria-label="Quitar foto"><X size={12} /></button>
                </div>
              ))}
            </div>
            {p.images.length < 4 && (
              <ImageDrop className="mt-2" value="" onChange={(d) => set("images", [...p.images, d])} label="Agregar foto" hint="Foto cuadrada, fondo limpio" />
            )}
          </div>
          <div><label className="label" htmlFor="pn">Nombre</label><input id="pn" className="field" value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="New York Yankees World Series" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label" htmlFor="pt">Equipo / línea</label><input id="pt" className="field" value={p.team} onChange={(e) => set("team", e.target.value)} /></div>
            <div><label className="label" htmlFor="pp">Precio (RD$)</label><input id="pp" type="number" min={0} className="field" value={p.price || ""} onChange={(e) => set("price", +e.target.value)} /></div>
          </div>
          <div><label className="label" htmlFor="pe">Edición / colorway</label><input id="pe" className="field" value={p.edition} onChange={(e) => set("edition", e.target.value)} placeholder="Metallic Pewter · 59FIFTY Fitted" /></div>
          <div><label className="label" htmlFor="pd">Descripción</label><textarea id="pd" rows={3} className="field" value={p.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div>
            <p className="label">Inventario por talla</p>
            <div className="grid grid-cols-2 gap-2">
              {p.sizes.map((z) => (
                <div key={z.size} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                  <span className="text-sm font-bold">{z.size}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => stock(z.size, -1)} className="rounded-full p-1.5 hover:bg-paper" aria-label="Menos"><Minus size={13} /></button>
                    <span className="w-6 text-center text-sm font-bold">{z.stock}</span>
                    <button type="button" onClick={() => stock(z.size, 1)} className="rounded-full p-1.5 hover:bg-paper" aria-label="Más"><Plus size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-ink" checked={p.isNew} onChange={(e) => set("isNew", e.target.checked)} /> Nuevo</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-ink" checked={p.featured} onChange={(e) => set("featured", e.target.checked)} /> Drop de la semana</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-ink" checked={p.active} onChange={(e) => set("active", e.target.checked)} /> Visible en tienda</label>
          </div>
        </div>
        <div className="border-t border-line p-5">
          <button className="btn btn-ink h-13 w-full">{isNew ? "Publicar producto" : "Guardar cambios"}</button>
        </div>
      </form>
    </div>
  );
}
