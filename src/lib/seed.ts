import { Product, SIZE_PRESETS, StoreSettings } from "./types";

/**
 * Catálogo tomado del sitio actual de CapKix (Google Sites).
 * Los precios y existencias son de ejemplo: se editan desde el panel.
 */
type Seed = Omit<Product, "id" | "images" | "sizes" | "createdAt" | "active"> & {
  photos: number;
  stock?: number[];
};

const caps: Seed[] = [
  {
    slug: "boston-ws-1986", name: "Boston Red Sox World Series 1986", team: "Boston Red Sox",
    edition: "Khaki Black Two Tone · 59FIFTY Fitted", category: "gorras", price: 3450, photos: 4,
    description: "Corona khaki con visera negra y el parche de la Serie Mundial de 1986 bordado al lado. Undervisor verde clásico.",
    tags: ["World Series", "Two Tone"], isNew: true, featured: true,
  },
  {
    slug: "mets-60th", name: "New York Mets 60th Anniversary", team: "New York Mets",
    edition: "Cardinal Burgundy · 59FIFTY Fitted", category: "gorras", price: 3650, photos: 4,
    description: "Rojo cardenal con visera vino y el script “New York” en dorado metálico. Parche del 60 aniversario.",
    tags: ["Anniversary", "Metallic"], isNew: true, featured: true,
  },
  {
    slug: "detroit-stadium", name: "Detroit Tigers Stadium", team: "Detroit Tigers",
    edition: "Canvas Metallic Two Tone · 59FIFTY Fitted", category: "gorras", price: 3350, photos: 1,
    description: "Corona navy con el script Detroit en metálico y parche conmemorativo del estadio.",
    tags: ["Stadium", "Metallic"], isNew: false, featured: false,
  },
  {
    slug: "cleveland-al-prime", name: "Cleveland American League Prime", team: "Cleveland",
    edition: "Throwback Navy · 59FIFTY Fitted", category: "gorras", price: 3250, photos: 1,
    description: "El clásico “C” rojo con borde dorado sobre navy profundo. Edición Prime throwback.",
    tags: ["Throwback"], isNew: false, featured: false,
  },
  {
    slug: "boston-asg-1961", name: "Boston Red Sox All Star Game 1961", team: "Boston Red Sox",
    edition: "Khaki Two Tone · 59FIFTY Fitted", category: "gorras", price: 3450, photos: 4,
    description: "Khaki y negro con el wordmark Boston y el parche del All Star Game de 1961.",
    tags: ["All Star", "Two Tone"], isNew: false, featured: true,
  },
  {
    slug: "cleveland-jacobs-field", name: "Cleveland Jacobs Field", team: "Cleveland",
    edition: "Black Yellow · 59FIFTY Fitted", category: "gorras", price: 3350, photos: 4,
    description: "Negro total con detalles amarillos y el parche del Jacobs Field.",
    tags: ["Stadium"], isNew: true, featured: false,
  },
  {
    slug: "dodgers-cream-royal", name: "Los Angeles Dodgers Cooperstown", team: "Los Angeles Dodgers",
    edition: "Cream Royal · 59FIFTY Fitted", category: "gorras", price: 3550, photos: 4,
    description: "Corona crema con visera royal, script Dodgers y undervisor verde.",
    tags: ["Cooperstown"], isNew: true, featured: true,
  },
  {
    slug: "colts-50th-navy-orange", name: "Houston Colts 50th Anniversary", team: "Houston Colt .45s",
    edition: "Navy Orange Jersey Flip · 59FIFTY Fitted", category: "gorras", price: 3450, photos: 4,
    description: "Navy con visera naranja y logo jersey flip. Parche del 50 aniversario.",
    tags: ["Anniversary", "Jersey Flip"], isNew: false, featured: false,
  },
  {
    slug: "pirates-cream-pink", name: "Pittsburgh Pirates Two Tone", team: "Pittsburgh Pirates",
    edition: "Cream Royal · 59FIFTY Fitted", category: "gorras", price: 3350, photos: 4,
    description: "Crema y royal con wordmark Pittsburgh y parche lateral. Una pieza que no pasa desapercibida.",
    tags: ["Two Tone"], isNew: false, featured: false,
  },
  {
    slug: "colts-35th-chrome-navy", name: "Houston Colts 35th Anniversary", team: "Houston Colt .45s",
    edition: "Chrome Navy Jersey Flip · 59FIFTY Fitted", category: "gorras", price: 3550, photos: 4,
    description: "Negro y naranja con el “45” del jersey y el parche de los 35 años.",
    tags: ["Anniversary", "Jersey Flip"], isNew: true, featured: true,
  },
  {
    slug: "rays-green", name: "Tampa Bay Rays & Cleveland", team: "Tampa Bay Rays",
    edition: "Dark Green · 59FIFTY Fitted", category: "gorras", price: 3250, photos: 4,
    description: "Verde oscuro con script Rays y undervisor gris. Colaboración de dos equipos en una sola pieza.",
    tags: ["Two Team"], isNew: false, featured: false,
  },
  {
    slug: "cleveland-prime-green", name: "Cleveland Prime Throwback", team: "Cleveland",
    edition: "Two Tone Green · 59FIFTY Fitted", category: "gorras", price: 3250, photos: 3,
    description: "Verde botella con logo throwback y detalles dorados.",
    tags: ["Throwback", "Two Tone"], isNew: false, featured: false,
  },
  {
    slug: "cleveland-navy-red", name: "Cleveland Indians Wordmark", team: "Cleveland",
    edition: "Navy Red · 59FIFTY Fitted", category: "gorras", price: 3250, photos: 4,
    description: "Navy y rojo con el wordmark clásico al frente.",
    tags: ["Wordmark"], isNew: false, featured: false,
  },
  {
    slug: "yankees-1927-pewter", name: "New York Yankees World Champions 1927", team: "New York Yankees",
    edition: "Metallic Pewter · 59FIFTY Fitted", category: "gorras", price: 3750, photos: 4,
    description: "Pewter metálico en homenaje al campeonato de 1927. Undervisor verde.",
    tags: ["World Series", "Metallic"], isNew: true, featured: true,
  },
  {
    slug: "colts-cream-45", name: "Houston Colts .45s Cream", team: "Houston Colt .45s",
    edition: "Cream Chrome · 59FIFTY Fitted", category: "gorras", price: 3450, photos: 4,
    description: "Crema limpio con el “45” al frente y parche lateral. Fácil de combinar con todo.",
    tags: ["Jersey Flip"], isNew: false, featured: false,
  },
];

const dunks: Seed[] = [
  {
    slug: "dunk-chicago-split", name: "Nike Dunk Low “Split — Chicago”", team: "Nike Dunk Low",
    edition: "University Red / White", category: "tenis", price: 8950, photos: 3,
    description: "El colorway Chicago partido en dos: mitad rojo, mitad blanco. Un clásico con giro.",
    tags: ["Dunk Low"], isNew: true, featured: true,
  },
  {
    slug: "dunk-miami-hurricanes", name: "Nike Dunk Low “Miami Hurricanes”", team: "Nike Dunk Low",
    edition: "Gorge Green / Total Orange", category: "tenis", price: 8500, photos: 2,
    description: "Verde y naranja de la U. Cuero premium y la silueta Dunk de siempre.",
    tags: ["Dunk Low"], isNew: false, featured: true,
  },
  {
    slug: "dunk-championship-purple", name: "Nike Dunk Low “Championship Purple”", team: "Nike Dunk Low",
    edition: "Court Purple / White", category: "tenis", price: 7950, photos: 4,
    description: "Morado court sobre blanco. Limpio, versátil y fácil de llevar.",
    tags: ["Dunk Low"], isNew: false, featured: false,
  },
];

const day = 86400000;
const base = Date.parse("2026-11-01T12:00:00Z");

export const SEED_PRODUCTS: Product[] = [...caps, ...dunks].map((p, i) => {
  const { photos, stock, ...rest } = p;
  const sizes = SIZE_PRESETS[p.category].map((size, j) => ({
    size,
    stock: stock?.[j] ?? [3, 2, 4, 5, 3, 1, 2, 0, 2, 1][(i + j) % 10],
  }));
  return {
    ...rest,
    id: "p" + (i + 1),
    images: Array.from({ length: photos }, (_, n) => `/products/${p.slug}-${n + 1}.webp`),
    sizes,
    active: true,
    createdAt: new Date(base - i * day).toISOString(),
  };
});

export const SEED_SETTINGS: StoreSettings = {
  whatsappUrl: "https://wa.link/u653ti",
  whatsappNumber: "",
  instagram: "https://www.instagram.com/capkix/",
  pickupNote: "Entrega personal en Santo Domingo. Coordinamos el punto por WhatsApp.",
  banks: [
    { id: "b1", bank: "Banco Popular", type: "Ahorros", number: "000-000000-0", holder: "CapKix SRL", holderId: "000-0000000-0", color: "#0b3a82", active: true },
    { id: "b2", bank: "BHD", type: "Corriente", number: "00000000000", holder: "CapKix SRL", holderId: "000-0000000-0", color: "#00843d", active: true },
    { id: "b3", bank: "Banreservas", type: "Ahorros", number: "0000000000", holder: "CapKix SRL", holderId: "000-0000000-0", color: "#0a58a8", active: true },
  ],
  zones: [
    { id: "z1", name: "Santo Domingo y D.N.", fee: 250, eta: "24 horas" },
    { id: "z2", name: "Santiago y zona norte", fee: 350, eta: "1 a 2 días" },
    { id: "z3", name: "Resto del país", fee: 400, eta: "2 a 3 días" },
  ],
};

/** Comprobante de ejemplo (SVG) para los pedidos de la demo. */
export const SAMPLE_PROOF =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='900' viewBox='0 0 600 900'>
<rect width='600' height='900' fill='#f6f7f9'/><rect width='600' height='150' fill='#0b3a82'/>
<text x='40' y='90' font-family='Arial' font-size='34' font-weight='700' fill='#fff'>Transferencia exitosa</text>
<circle cx='300' cy='260' r='60' fill='#1f8a4c'/><path d='M270 262l22 22 40-44' stroke='#fff' stroke-width='12' fill='none' stroke-linecap='round'/>
<text x='300' y='390' text-anchor='middle' font-family='Arial' font-size='22' fill='#555'>Monto transferido</text>
<text x='300' y='445' text-anchor='middle' font-family='Arial' font-size='48' font-weight='700' fill='#111'>RD$ 3,700.00</text>
<g font-family='Arial' font-size='20' fill='#333'><text x='60' y='540'>Cuenta destino</text><text x='540' y='540' text-anchor='end'>CapKix SRL</text>
<text x='60' y='590'>Banco</text><text x='540' y='590' text-anchor='end'>Banco Popular</text>
<text x='60' y='640'>Referencia</text><text x='540' y='640' text-anchor='end'>84720193</text>
<text x='60' y='690'>Fecha</text><text x='540' y='690' text-anchor='end'>Hoy, 10:42 a. m.</text></g>
<text x='300' y='820' text-anchor='middle' font-family='Arial' font-size='16' fill='#999'>Comprobante de ejemplo · Demo CapKix</text></svg>`);
