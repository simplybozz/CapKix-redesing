"use client";

/**
 * Base de datos de la DEMO: todo vive en localStorage de este navegador.
 * Las acciones de este store son la única puerta a los datos, así que pasar a
 * Supabase / Firebase en producción solo cambia este archivo (ver README).
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SAMPLE_PROOF, SEED_PRODUCTS, SEED_SETTINGS } from "./seed";
import {
  Address, CartItem, Order, OrderStatus, Product, PublicUser, Role, StoreSettings, User,
} from "./types";

export const DEMO_PASSWORD = "demo1234";
const DEMO_HASH = "8ed5bac41162387067e065952fc93292996935ec729bf690a1a44dfd3cac84ff";

export const DEMO_ACCOUNTS: { role: Role; label: string; email: string }[] = [
  { role: "admin", label: "Administrador", email: "admin@capkix.do" },
  { role: "vendedor", label: "Vendedor", email: "ventas@capkix.do" },
  { role: "cliente", label: "Cliente", email: "cliente@correo.do" },
];

export async function hashPassword(pw: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("capkix::" + pw));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const uid = (p: string) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  revision: ["confirmado", "rechazado", "cancelado"],
  rechazado: ["revision", "cancelado"],
  confirmado: ["enviado", "listo", "cancelado"],
  enviado: ["entregado"],
  listo: ["entregado"],
  entregado: [],
  cancelado: [],
};

export function canMove(o: Order, to: OrderStatus) {
  if (!TRANSITIONS[o.status].includes(to)) return false;
  if (to === "enviado") return o.delivery === "envio";
  if (to === "listo") return o.delivery === "retiro";
  return true;
}

function seedUsers(): User[] {
  const at = (d: number) => new Date(Date.parse("2026-11-09T12:00:00Z") - d * 86400000).toISOString();
  const u = (id: string, name: string, email: string, phone: string, role: Role, d: number): User => ({
    id, name, email, phone, role, active: true, passwordHash: DEMO_HASH, createdAt: at(d),
  });
  return [
    u("u1", "Administración CapKix", "admin@capkix.do", "809-000-0001", "admin", 120),
    u("u2", "Equipo de ventas", "ventas@capkix.do", "809-000-0002", "vendedor", 90),
    u("u3", "Carlos Tavárez", "cliente@correo.do", "809-555-0187", "cliente", 40),
    u("u4", "Yokasta Ramírez", "yokasta@correo.do", "849-555-0113", "cliente", 12),
    u("u5", "Luis Ángel Feliz", "luisangel@correo.do", "829-555-0164", "cliente", 5),
  ];
}

function seedOrders(products: Product[], users: User[]): Order[] {
  const now = Date.now();
  const ago = (h: number) => new Date(now - h * 3600000).toISOString();
  const bank = SEED_SETTINGS.banks[0];
  const snap = `${bank.bank} · ${bank.type} ${bank.number}`;
  const item = (slug: string, size: string, qty = 1) => {
    const p = products.find((x) => x.slug === slug)!;
    return { productId: p.id, name: p.name, image: p.images[0], size, qty, price: p.price };
  };
  const mk = (
    u: User, number: number, items: Order["items"], status: OrderStatus, history: Order["history"],
    extra: Partial<Order> = {},
  ): Order => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = extra.delivery ?? "envio";
    const fee = delivery === "retiro" ? 0 : extra.shippingFee ?? 250;
    return {
      id: "o" + number, number, userId: u.id, customerName: u.name, customerEmail: u.email,
      customerPhone: u.phone, items, subtotal, shippingFee: fee, total: subtotal + fee, delivery,
      zoneName: delivery === "envio" ? "Santo Domingo y D.N." : undefined,
      address: delivery === "envio"
        ? { province: "Santo Domingo", city: "Santo Domingo Este", street: "C/ Respaldo Venezuela #12", reference: "Frente al colmado" }
        : undefined,
      bankSnapshot: snap, proofImage: SAMPLE_PROOF, proofReference: String(84720100 + number),
      status, history, createdAt: history[0].at, updatedAt: history[history.length - 1].at, ...extra,
    };
  };
  const [, seller, carlos, yokasta, luis] = users;
  return [
    mk(luis, 1006, [item("mets-60th", "7 3/8")], "revision", [{ status: "revision", at: ago(0.6), by: luis.name }]),
    mk(yokasta, 1005, [item("dunk-chicago-split", "8"), item("dodgers-cream-royal", "7 1/4")], "revision",
      [{ status: "revision", at: ago(2.4), by: yokasta.name }], { delivery: "retiro" }),
    mk(carlos, 1004, [item("yankees-1927-pewter", "7 1/2")], "confirmado", [
      { status: "revision", at: ago(22), by: carlos.name },
      { status: "confirmado", at: ago(20), by: seller.name },
    ], { zoneName: "Santiago y zona norte", shippingFee: 350,
      address: { province: "Santiago", city: "Santiago de los Caballeros", street: "Av. 27 de Febrero #88", reference: "Edificio azul, apto 3B" } }),
    mk(carlos, 1003, [item("boston-ws-1986", "7 3/8"), item("colts-35th-chrome-navy", "7 3/8")], "enviado", [
      { status: "revision", at: ago(50), by: carlos.name },
      { status: "confirmado", at: ago(48), by: seller.name },
      { status: "enviado", at: ago(30), by: seller.name, note: "Sale con el mensajero" },
    ], { tracking: "Mensajero CapKix" }),
    mk(luis, 1002, [item("dunk-miami-hurricanes", "10")], "rechazado", [
      { status: "revision", at: ago(70), by: luis.name },
      { status: "rechazado", at: ago(68), by: seller.name, note: "El monto del comprobante no coincide con el total del pedido." },
    ]),
    mk(carlos, 1001, [item("boston-asg-1961", "7 3/8")], "entregado", [
      { status: "revision", at: ago(200), by: carlos.name },
      { status: "confirmado", at: ago(198), by: seller.name },
      { status: "enviado", at: ago(180), by: seller.name },
      { status: "entregado", at: ago(160), by: seller.name },
    ]),
  ];
}

export interface CheckoutInput {
  delivery: "envio" | "retiro";
  zoneId?: string;
  address?: Address;
  phone: string;
  bankId: string;
  proofImage: string;
  proofReference: string;
}

interface State {
  users: User[];
  sessionId: string | null;
  products: Product[];
  orders: Order[];
  orderSeq: number;
  settings: StoreSettings;
  cart: CartItem[];
  cartOpen: boolean;

  // auth
  login: (email: string, pw: string) => Promise<string | null>;
  register: (d: { name: string; email: string; phone: string; password: string }) => Promise<string | null>;
  logout: () => void;
  updateProfile: (d: { name: string; phone: string }) => void;
  setRole: (userId: string, role: Role) => void;
  toggleUser: (userId: string) => void;

  // cart
  addToCart: (productId: string, size: string, qty?: number) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  setCartOpen: (open: boolean) => void;

  // orders
  checkout: (input: CheckoutInput) => { order?: Order; error?: string };
  moveOrder: (id: string, to: OrderStatus, note?: string, tracking?: string) => string | null;
  resubmitProof: (id: string, image: string, reference: string) => string | null;

  // catalog / settings
  saveProduct: (p: Product) => void;
  toggleProduct: (id: string) => void;
  saveSettings: (s: StoreSettings) => void;
  resetDemo: () => void;
}

function initialData() {
  const users = seedUsers();
  const products = structuredClone(SEED_PRODUCTS);
  return {
    users,
    sessionId: null as string | null,
    products,
    orders: seedOrders(products, users),
    orderSeq: 1006,
    settings: structuredClone(SEED_SETTINGS),
    cart: [] as CartItem[],
    cartOpen: false,
  };
}

export const useStore = create<State>()(
  persist(
    (set, get) => {
      const me = () => get().users.find((u) => u.id === get().sessionId);
      const adjust = (lines: { productId: string; size: string; delta: number }[]) =>
        set((s) => ({
          products: s.products.map((p) => {
            const mine = lines.filter((l) => l.productId === p.id);
            if (!mine.length) return p;
            return {
              ...p,
              sizes: p.sizes.map((z) => {
                const d = mine.filter((l) => l.size === z.size).reduce((a, l) => a + l.delta, 0);
                return d ? { ...z, stock: Math.max(0, z.stock + d) } : z;
              }),
            };
          }),
        }));
      const pushStatus = (o: Order, to: OrderStatus, by: string, note?: string, patch: Partial<Order> = {}) => {
        const at = new Date().toISOString();
        const next: Order = {
          ...o, ...patch, status: to, updatedAt: at,
          history: [...o.history, { status: to, at, by, note: note || undefined }],
        };
        set((s) => ({ orders: s.orders.map((x) => (x.id === o.id ? next : x)) }));
      };

      return {
        ...initialData(),

        async login(email, pw) {
          const u = get().users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
          if (!u || u.passwordHash !== (await hashPassword(pw))) return "Correo o contraseña incorrectos.";
          if (!u.active) return "Esta cuenta está desactivada. Escríbenos por WhatsApp.";
          set({ sessionId: u.id });
          return null;
        },
        async register({ name, email, phone, password }) {
          const e = email.trim().toLowerCase();
          if (get().users.some((x) => x.email.toLowerCase() === e)) return "Ya existe una cuenta con ese correo. Inicia sesión.";
          const u: User = {
            id: uid("u"), name: name.trim(), email: e, phone: phone.trim(), role: "cliente",
            active: true, passwordHash: await hashPassword(password), createdAt: new Date().toISOString(),
          };
          set((s) => ({ users: [...s.users, u], sessionId: u.id }));
          return null;
        },
        logout: () => set({ sessionId: null }),
        updateProfile: ({ name, phone }) =>
          set((s) => ({ users: s.users.map((u) => (u.id === s.sessionId ? { ...u, name: name.trim(), phone: phone.trim() } : u)) })),
        setRole: (userId, role) => set((s) => ({ users: s.users.map((u) => (u.id === userId ? { ...u, role } : u)) })),
        toggleUser: (userId) => set((s) => ({ users: s.users.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)) })),

        addToCart(productId, size, qty = 1) {
          set((s) => {
            const ex = s.cart.find((c) => c.productId === productId && c.size === size);
            const cart = ex
              ? s.cart.map((c) => (c === ex ? { ...c, qty: c.qty + qty } : c))
              : [...s.cart, { productId, size, qty }];
            return { cart, cartOpen: true };
          });
        },
        setQty: (productId, size, qty) =>
          set((s) => ({ cart: s.cart.map((c) => (c.productId === productId && c.size === size ? { ...c, qty: Math.max(1, qty) } : c)) })),
        removeFromCart: (productId, size) =>
          set((s) => ({ cart: s.cart.filter((c) => !(c.productId === productId && c.size === size)) })),
        setCartOpen: (cartOpen) => set({ cartOpen }),

        checkout(input) {
          const u = me();
          const { cart, products, settings } = get();
          if (!u) return { error: "Inicia sesión para completar tu compra." };
          if (!cart.length) return { error: "Tu carrito está vacío." };
          for (const c of cart) {
            const p = products.find((x) => x.id === c.productId);
            const stock = p?.sizes.find((z) => z.size === c.size)?.stock ?? 0;
            if (!p?.active || stock < c.qty) return { error: `Ya no hay suficiente “${p?.name ?? "producto"}” talla ${c.size}.` };
          }
          const bank = settings.banks.find((b) => b.id === input.bankId);
          if (!bank) return { error: "Elige la cuenta a la que transferiste." };
          const zone = input.delivery === "envio" ? settings.zones.find((z) => z.id === input.zoneId) : undefined;
          if (input.delivery === "envio" && !zone) return { error: "Elige la zona de envío." };
          if (!input.proofImage) return { error: "Sube la foto o captura del comprobante." };

          const items = cart.map((c) => {
            const p = products.find((x) => x.id === c.productId)!;
            return { productId: p.id, name: p.name, image: p.images[0], size: c.size, qty: c.qty, price: p.price };
          });
          const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
          const fee = zone?.fee ?? 0;
          const at = new Date().toISOString();
          const number = get().orderSeq + 1;
          const order: Order = {
            id: uid("o"), number, userId: u.id, customerName: u.name, customerEmail: u.email,
            customerPhone: input.phone || u.phone, items, subtotal, shippingFee: fee, total: subtotal + fee,
            delivery: input.delivery, zoneName: zone?.name,
            address: input.delivery === "envio" ? input.address : undefined,
            bankSnapshot: `${bank.bank} · ${bank.type} ${bank.number}`,
            proofImage: input.proofImage, proofReference: input.proofReference.trim(),
            status: "revision", history: [{ status: "revision", at, by: u.name }], createdAt: at, updatedAt: at,
          };
          set((s) => ({ orders: [order, ...s.orders], orderSeq: number, cart: [] }));
          adjust(items.map((i) => ({ productId: i.productId, size: i.size, delta: -i.qty })));
          return { order };
        },

        moveOrder(id, to, note, tracking) {
          const o = get().orders.find((x) => x.id === id);
          const u = me();
          if (!o || !u) return "Pedido no encontrado.";
          const staff = u.role !== "cliente";
          const selfCancel = to === "cancelado" && o.userId === u.id && (o.status === "revision" || o.status === "rechazado");
          if (!staff && !selfCancel) return "No tienes permiso para hacer esto.";
          if (!canMove(o, to)) return "Ese cambio no es válido para el estado actual.";
          if (to === "rechazado" && !note?.trim()) return "Escribe el motivo del rechazo para que el cliente sepa qué corregir.";
          if (to === "cancelado") adjust(o.items.map((i) => ({ productId: i.productId, size: i.size, delta: i.qty })));
          pushStatus(o, to, u.name, note?.trim(), tracking ? { tracking } : {});
          return null;
        },

        resubmitProof(id, image, reference) {
          const o = get().orders.find((x) => x.id === id);
          const u = me();
          if (!o || !u || o.userId !== u.id) return "Pedido no encontrado.";
          if (o.status !== "rechazado") return "Este pedido no necesita un comprobante nuevo.";
          pushStatus(o, "revision", u.name, "Subió un comprobante nuevo", { proofImage: image, proofReference: reference.trim() });
          return null;
        },

        saveProduct: (p) =>
          set((s) => ({
            products: s.products.some((x) => x.id === p.id)
              ? s.products.map((x) => (x.id === p.id ? p : x))
              : [{ ...p, id: p.id || uid("p") }, ...s.products],
          })),
        toggleProduct: (id) => set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)) })),
        saveSettings: (settings) => set({ settings }),
        resetDemo: () => set({ ...initialData() }),
      };
    },
    {
      name: "capkix-db-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ users, sessionId, products, orders, orderSeq, settings, cart }) => ({
        users, sessionId, products, orders, orderSeq, settings, cart,
      }),
    },
  ),
);

/** Usuario en sesión, sin el hash de la contraseña. */
export function useMe(): PublicUser | null {
  return useStore((s) => {
    const u = s.users.find((x) => x.id === s.sessionId);
    return u && u.active ? u : null;
  });
}
