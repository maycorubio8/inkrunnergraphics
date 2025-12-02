# InkRunner Graphics - Contexto del Proyecto

## Resumen
Ecommerce de stickers/printing personalizado. Stack: Next.js 16, Tailwind CSS, Supabase, Stripe.

## Repositorio
https://github.com/maycorubio8/inkrunnergraphics

## Estructura Actual del Proyecto

```
src/
├── app/
│   ├── layout.js                      # Layout con CartProvider
│   ├── page.js                        # Homepage
│   ├── globals.css
│   ├── cart/
│   │   └── page.js                    # Página de carrito completa
│   ├── checkout/
│   │   └── success/
│   │       └── page.js                # Página post-pago exitoso
│   ├── products/
│   │   └── [slug]/
│   │       └── page.js                # Página de producto con configurador
│   └── api/
│       └── checkout/
│           ├── route.js               # Crear sesión Stripe
│           └── session/
│               └── route.js           # Obtener detalles de sesión
├── components/
│   ├── Navbar.jsx                     # Con CartIcon integrado
│   ├── Footer.jsx
│   ├── ProductConfigurator.jsx        # Configurador 3 pasos (Customize → Upload → Review)
│   ├── FileUploader.jsx               # Drag & drop upload a Supabase
│   ├── CartDrawer.jsx                 # Sidebar carrito
│   └── CartIcon.jsx                   # Icono con badge
├── context/
│   └── CartContext.jsx                # Estado global del carrito
└── lib/
    ├── supabase.js                    # Cliente Supabase
    ├── storage.js                     # Utilidades upload Supabase Storage
    ├── stripe.js                      # Cliente Stripe (server)
    └── stripe-client.js               # Cliente Stripe (browser)
```

## Base de Datos (Supabase)

### Tablas existentes:
- `materials` (id, name, price_multiplier, is_active)
- `sizes` (id, name, base_price, is_active)
- `finishes` (id, name, price_add, is_active)
- `quantity_breaks` (min_qty, max_qty, discount_percent)
- `customers`, `addresses`, `orders`, `order_items`

### Storage:
- Bucket `designs` configurado con políticas para uploads anónimos

## Variables de Entorno (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[key]
SUPABASE_SERVICE_ROLE_KEY=[key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Funcionalidades COMPLETADAS ✅

1. **Homepage** con grid de productos
2. **Navbar** con dropdown de productos y CartIcon
3. **Footer**
4. **ProductConfigurator** - Flujo de 3 pasos:
   - Paso 1: Customize (shape, material, size con custom size, quantity)
   - Paso 2: Upload Artwork (drag & drop + instrucciones)
   - Paso 3: Review
5. **Cálculo de precios** dinámico con descuentos por volumen
6. **Custom Size** - Input width × height con precio por área
7. **Upload de archivos** a Supabase Storage (PNG, JPG, SVG, PDF, AI, EPS)
8. **Carrito de compras**:
   - CartContext con React Context + useReducer
   - Persistencia en localStorage
   - CartDrawer (sidebar)
   - Página /cart completa
9. **Checkout con Stripe**:
   - API route para crear sesión
   - Página de éxito post-pago
   - Opciones de envío (Free + Express)

## Funcionalidades PENDIENTES 🔜

1. **Webhook de Stripe** - Guardar órdenes en Supabase automáticamente
2. **Conectar ProductConfigurator a Supabase** - Datos dinámicos en vez de hardcodeados
3. **Páginas extras** - About, Contact, FAQ
4. **Emails transaccionales** - Confirmación de orden
5. **Panel admin** - Ver órdenes
6. **Deploy a Vercel**

## Productos Definidos

- Vinyl Stickers
- Holographic Stickers  
- Clear Stickers
- Product Labels
- Vinyl Banners
- Custom Magnets

## Estética/Diseño

- Fondo blanco/gris claro
- Texto negro/gris oscuro
- Botones principales en negro (#111)
- Cards blancas con bordes grises
- Badges "Popular" en azul
- Trust badges (Free Proof, 24-48h, Free Shipping)

## Notas Técnicas Importantes

- Layout.js tiene CartProvider envolviendo toda la app
- Navbar está en layout.js (NO duplicar en páginas individuales)
- Stripe server client solo en API routes (src/lib/stripe.js)
- Stripe browser client separado (src/lib/stripe-client.js)
- FileUploader usa Supabase Storage con signed URLs

## Último Estado

Todo funcionando correctamente. Checkout con Stripe procesando pagos exitosamente en modo test.