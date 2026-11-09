const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefija rutas de /public con el basePath (para GitHub Pages). */
export function asset(src: string) {
  if (!src || src.startsWith("data:") || src.startsWith("http") || src.startsWith("blob:")) return src;
  return BASE + src;
}

export const money = (n: number) =>
  "RD$ " + n.toLocaleString("es-DO", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-DO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export const dateShort = (iso: string) =>
  new Date(iso).toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" });

export function timeAgo(iso: string) {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return `hace ${d} ${d === 1 ? "día" : "días"}`;
}

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Reduce una foto (comprobante o producto) para que quepa en el almacenamiento de la demo. */
export function compressImage(file: File, max = 1400, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("El archivo debe ser una imagen (JPG, PNG o captura)."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("No se pudo abrir la imagen."));
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function waText(base: string, text: string) {
  // wa.link no acepta texto; si hay número se usa wa.me con el mensaje.
  return base.includes("wa.me") ? `${base}?text=${encodeURIComponent(text)}` : base;
}
