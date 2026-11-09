# CapKix · Tienda en línea (propuesta)

Propuesta de rediseño para **CapKix**, tienda de gorras New Era 59FIFTY y Nike Dunks 100% originales. Está hecha con **Next.js 16** y **React 19**, con **Tailwind CSS 4** para el diseño, y funciona en celular, tablet y computadora.



## Qué incluye

**Para los clientes**
- **Inicio:**
  - Portada "La corona la eliges tú" con las fotos reales de CapKix.
  - Categorías: gorras New Era y Nike Dunks.
  - Drops de la semana y lo más buscado.
  - Cómo funciona el pago con comprobante.
- **Tienda:** filtros por categoría, equipo, talla disponible y búsqueda, además de orden por precio.
- **Página de producto:** fotos, tallas con existencia en vivo (59FIFTY de 7 a 8, Dunks de 7 a 12) y botón de WhatsApp.
- **Carrito y pago solo por transferencia:**
  1. El cliente elige envío a domicilio (por zona) o entrega en Santo Domingo.
  2. Elige uno de los bancos de la tienda y ve los datos de la cuenta, con botones para copiar la cuenta, el RNC y el monto.
  3. Sube la captura del comprobante y envía el pedido.
- **"Mis pedidos":** el estado de cada pedido, paso a paso. Si rechazan el comprobante, el cliente ve el motivo y sube otro sin volver a comprar.
- **"Cómo comprar":** los pasos, las zonas de envío y preguntas frecuentes.


**Roles** (todo el que se registra entra como *Cliente*)
| Rol | Qué puede hacer |
| --- | --- |
| Cliente | Comprar y ver sus pedidos |
| Vendedor | Revisar comprobantes (confirmar o rechazar con motivo), despachar pedidos, publicar y editar productos y existencias por talla |
| Administrador | Todo lo del vendedor. Además asigna roles, activa o desactiva usuarios, y edita las cuentas bancarias, las zonas de envío y los enlaces de WhatsApp e Instagram |


**Flujo de un pedido**

```
Comprobante en revisión ──► Pago confirmado ──► En camino ──────────► Entregado
        │                                   └─► Listo para entregar ─┘
        └─► Rechazado ──(el cliente sube otro)──► En revisión
Cualquier pedido no entregado se puede cancelar; la talla vuelve al inventario.
```

La talla queda apartada desde que el cliente envía el pedido, así no se vende dos veces.



## Estructura

```
src/
  app/(tienda)/  tienda pública: inicio, tienda, producto, carrito, pago, "Mi cuenta", cómo comprar
  app/panel/     panel de vendedor y administrador (pedidos, productos, usuarios, ajustes)
  components/    header, footer, carrito, tarjeta de producto, estado de pedido, subir imagen
  lib/           modelos, catálogo, datos de la tienda y utilidades
public/
  products/      fotos de los productos
  brand/         logo y portadas
```
