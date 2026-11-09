export type Role = "cliente" | "vendedor" | "admin";

export const ROLE_LABELS: Record<Role, string> = {
  cliente: "Cliente",
  vendedor: "Vendedor",
  admin: "Administrador",
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  active: boolean;
  passwordHash: string;
  createdAt: string;
}

export type PublicUser = Omit<User, "passwordHash">;

export type Category = "gorras" | "tenis";

export const CATEGORY_LABELS: Record<Category, string> = {
  gorras: "Gorras New Era",
  tenis: "Nike Dunks",
};

export const SIZE_PRESETS: Record<Category, string[]> = {
  gorras: ["7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8", "7 3/4", "8"],
  tenis: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
};

export interface SizeStock {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  team: string;
  edition: string;
  category: Category;
  price: number;
  comparePrice?: number;
  description: string;
  images: string[];
  sizes: SizeStock[];
  tags: string[];
  isNew: boolean;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  size: string;
  qty: number;
}

export type OrderStatus =
  | "revision"
  | "rechazado"
  | "confirmado"
  | "enviado"
  | "listo"
  | "entregado"
  | "cancelado";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  revision: "Comprobante en revisión",
  rechazado: "Comprobante rechazado",
  confirmado: "Pago confirmado",
  enviado: "En camino",
  listo: "Listo para entregar",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const STATUS_HELP: Record<OrderStatus, string> = {
  revision: "Estamos verificando tu transferencia. Te avisamos apenas se confirme.",
  rechazado: "No pudimos validar el comprobante. Revisa el motivo y sube uno nuevo.",
  confirmado: "Recibimos tu pago. Estamos preparando tu pedido.",
  enviado: "Tu pedido salió y va camino a tu dirección.",
  listo: "Tu pedido está listo en el punto de entrega acordado.",
  entregado: "Pedido entregado. ¡Gracias por elegir CapKix!",
  cancelado: "Este pedido fue cancelado.",
};

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  qty: number;
  price: number;
}

export interface Address {
  province: string;
  city: string;
  street: string;
  reference: string;
}

export interface StatusEvent {
  status: OrderStatus;
  at: string;
  by: string;
  note?: string;
}

export interface Order {
  id: string;
  number: number;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  delivery: "envio" | "retiro";
  zoneName?: string;
  address?: Address;
  bankSnapshot: string;
  proofImage: string;
  proofReference: string;
  status: OrderStatus;
  history: StatusEvent[];
  tracking?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  bank: string;
  type: "Ahorros" | "Corriente";
  number: string;
  holder: string;
  holderId: string;
  color: string;
  active: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  fee: number;
  eta: string;
}

export interface StoreSettings {
  whatsappUrl: string;
  whatsappNumber: string;
  instagram: string;
  pickupNote: string;
  banks: BankAccount[];
  zones: ShippingZone[];
}
