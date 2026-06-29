# ALILY Worldwide — Estado del Proyecto

---

## Backend (`alily-backend`)

### Infraestructura

| Componente | Estado | Archivo |
|---|---|---|
| Express + CORS + JSON body parser | ✅ Hecho | [index.ts](file:///home/ilias/GALILY/alily-backend/src/index.ts) |
| PostgreSQL + Prisma ORM | ✅ Hecho | [schema.prisma](file:///home/ilias/GALILY/alily-backend/prisma/schema.prisma) |
| PayPal SDK (live) | ✅ Hecho | [paypal.ts](file:///home/ilias/GALILY/alily-backend/src/lib/paypal.ts) |
| Telegram Bot (notificaciones) | ✅ Hecho | [bot/index.ts](file:///home/ilias/GALILY/alily-backend/src/bot/index.ts) |
| Email (Nodemailer SMTP) | ⚠️ Código hecho, **sin credenciales SMTP en VPS** | [email.ts](file:///home/ilias/GALILY/alily-backend/src/lib/email.ts) |
| PM2 en VPS Hetzner | ✅ En producción | `178.105.243.10` |

### Tablas en la Base de Datos (producción)

| Tabla | Para qué sirve | Usada por |
|---|---|---|
| `users` | Registro/login de clientas (bcrypt + JWT) | Auth routes |
| `items` | Productos de la tienda anterior (no Worldwide) | Legacy |
| `orders` | Pedidos de la tienda anterior (no Worldwide) | Legacy |
| `vouchers` | Sistema de cupones/vouchers | Legacy |
| `credit_transactions` | Historial de créditos | Legacy |
| `worldwide_products` | Productos de la tienda Worldwide (libros, graphics) | Tienda actual |
| `worldwide_orders` | Pedidos de la tienda Worldwide | Tienda actual |
| `mentorship_services` | Servicios de mentoría configurables | Book Online |
| `mentorship_bookings` | Reservas de mentoría pagadas | Book Online |
| `mentorship_availabilities` | Horario semanal de disponibilidad | Book Online |

### Rutas API

| Ruta | Método | Qué hace | Estado |
|---|---|---|---|
| **Auth** | | | |
| `POST /api/auth/register` | POST | Registro con email, username, password | ✅ Hecho |
| `POST /api/auth/login` | POST | Login con email/username + password → JWT | ✅ Hecho |
| `GET /api/auth/me` | GET | Perfil del usuario autenticado | ✅ Hecho |
| `POST /api/auth/admin/login` | POST | Login de admin con contraseña → JWT | ✅ Hecho |
| **Worldwide (Tienda)** | | | |
| `GET /api/worldwide/products` | GET | Lista pública de productos | ✅ Hecho |
| `GET /api/worldwide/products/:id` | GET | Detalle de un producto | ✅ Hecho |
| `GET /api/worldwide/payments/config` | GET | Client ID de PayPal para el frontend | ✅ Hecho |
| `POST /api/worldwide/payments/create-order` | POST | Crea orden de PayPal | ✅ Hecho |
| `POST /api/worldwide/payments/capture-order` | POST | Captura el pago y crea el pedido | ✅ Hecho |
| `GET /api/worldwide/admin/orders` | GET | Admin: lista todos los pedidos | ✅ Hecho |
| `GET /api/worldwide/admin/products` | GET | Admin: lista todos los productos | ✅ Hecho |
| `POST /api/worldwide/admin/products` | POST | Admin: crear producto (con imagen) | ✅ Hecho |
| `PUT /api/worldwide/admin/products/:id` | PUT | Admin: editar producto | ✅ Hecho |
| `DELETE /api/worldwide/admin/products/:id` | DELETE | Admin: borrar producto | ✅ Hecho |
| **Mentorship (Reservas)** | | | |
| `GET /api/mentorship/services` | GET | Lista pública de servicios activos | ✅ Hecho |
| `GET /api/mentorship/slots` | GET | Huecos disponibles para una fecha | ✅ Hecho |
| `POST /api/mentorship/create-order` | POST | Crea orden PayPal para reserva | ✅ Hecho |
| `POST /api/mentorship/capture-order` | POST | Captura pago y crea booking | ✅ Hecho |
| `GET /api/mentorship/admin/services` | GET | Admin: lista servicios | ✅ Hecho |
| `POST /api/mentorship/admin/services` | POST | Admin: crear servicio | ✅ Hecho |
| `PATCH /api/mentorship/admin/services/:id` | PATCH | Admin: editar servicio | ✅ Hecho |
| `DELETE /api/mentorship/admin/services/:id` | DELETE | Admin: borrar servicio | ✅ Hecho |
| `GET /api/mentorship/admin/availability` | GET | Admin: lista horarios | ✅ Hecho |
| `POST /api/mentorship/admin/availability` | POST | Admin: crear bloque horario | ✅ Hecho |
| `PATCH /api/mentorship/admin/availability/:id` | PATCH | Admin: editar bloque | ✅ Hecho |
| `DELETE /api/mentorship/admin/availability/:id` | DELETE | Admin: borrar bloque | ✅ Hecho |
| `GET /api/mentorship/admin/bookings` | GET | Admin: lista reservas | ✅ Hecho |
| **Área de Cliente** | | | |
| `GET /api/members/profile` | GET | Perfil del usuario autenticado | ❌ Falta |
| `PATCH /api/members/profile` | PATCH | Actualizar nombre del usuario | ❌ Falta |
| `GET /api/members/orders` | GET | Pedidos del usuario (por email) | ❌ Falta |
| `GET /api/members/bookings` | GET | Reservas del usuario (por email) | ❌ Falta |

---

## Frontend (`alily-worldwide`)

### Páginas

| Página | Ruta | Estado | Notas |
|---|---|---|---|
| **Home** | `/` | ✅ Hecho | Hero + intro + testimonios preview. Falta: best sellers, lista de mentorías, formulario de contacto |
| **About Me** | `/about-me` | ✅ Completa | Historia, fotos, autoridad |
| **Success Stories** | `/success-stories` | ✅ Completa | Testimonios + galería de lifestyle |
| **FAQ's** | `/fa-qs` | ✅ Completa | Acordeón con preguntas frecuentes |
| **Contact** | `/contact` | ⚠️ Parcial | Formulario existe pero es **simulado** (console.log, no envía email real) |
| **Shop** | `/category/all-products` | ✅ Hecho | Sidebar categorías + grid de productos dinámico desde API |
| **Product Detail** | `/product/:id` | ✅ Hecho | Detalle, selector de binding, añadir al carrito |
| **Cart** | `/cart-page` | ✅ Hecho | Lista de items, cambiar cantidad, borrar |
| **Checkout** | `/checkout-page` | ✅ Hecho | Formulario de contacto + PayPal buttons + confirmación inline |
| **Book Online** | `/book-online` | ✅ Hecho | Lista dinámica de servicios de mentoría desde API |
| **Admin Login** | `/admin/login` | ✅ Hecho | Login con contraseña de admin |
| **Admin Dashboard** | `/admin/dashboard` | ✅ Hecho | 3 pestañas: Orders, Products, Mentorship |
| **Members Area** | `/members` | ❌ Falta | Área privada de cliente |

### Componentes

| Componente | Estado | Notas |
|---|---|---|
| `Header.tsx` | ✅ Hecho | Nav links, login btn, cart badge, mobile menu |
| `Footer.tsx` | ✅ Hecho | Logo, email, redes sociales |
| `LoginModal.tsx` | ⚠️ **Simulado** | No conecta con la API real de auth |
| `BookingModal.tsx` | ✅ Hecho | Calendario, slots, PayPal, confirmación |
| `MentorshipAdmin.tsx` | ✅ Hecho | CRUD servicios, horarios, bookings |
| `AuthContext.tsx` | ❌ Falta | Gestión global de sesión de usuario |

### Librerías / Context

| Archivo | Estado | Notas |
|---|---|---|
| `lib/api.ts` | ✅ | Axios sin auth (peticiones públicas) |
| `lib/adminApi.ts` | ✅ | Axios con token admin |
| `lib/userApi.ts` | ❌ Falta | Axios con token de usuario |
| `lib/auth.ts` | ✅ | Helpers solo para admin token |
| `context/CartContext.tsx` | ✅ | Carrito con localStorage |
| `context/AuthContext.tsx` | ❌ Falta | Sesión de usuario real |

---

## Lo que FALTA por implementar

### Prioridad 1 — Área de Cliente (Members Area)
- **Backend**: Nueva ruta `/api/members` (`members.ts`) + registro en `index.ts`
- **Frontend**: `AuthContext`, `userApi.ts`, reescritura de `LoginModal` (login + registro reales), nueva página `MembersArea.tsx` con pestañas (My Orders, My Bookings, Account Settings)
- **Header**: Mostrar "My Account" cuando está autenticado, enlace a `/members`

### Prioridad 2 — Emails funcionando
- Configurar las credenciales SMTP en el `.env` de la VPS (Gmail App Password)
- Los emails de confirmación de pedido y de mentoría empezarán a funcionar automáticamente
- Añadir email de bienvenida al registrarse (nuevo)

### Prioridad 3 — Formulario de Contact real
- Conectar el formulario de `/contact` al backend para que envíe un email real a `alilyworldwide@gmail.com`

### Prioridad 4 — Thank You Page dedicada
- Crear página `/thank-you` con diseño premium post-compra
- Redirigir tras checkout exitoso

### Prioridad 5 — Home más completa
- Sección "Best Sellers" (productos destacados de la tienda)
- Sección "Mentorship Programs" (preview de servicios)
- Mini formulario de contacto / lead capture

---

## Extras que se podrían añadir en el futuro

| Feature | Descripción | Complejidad |
|---|---|---|
| **Stock / Pre-order / Out of Stock** | Etiquetas y control de inventario en productos | Media |
| **Dominio propio** | Comprar dominio → habilitar Resend → emails profesionales | Baja (config) |
| **Cupones de descuento** | Sistema de códigos descuento en el checkout | Media |
| **Reviews / Ratings** | Que las clientas dejen reviews en productos | Media |
| **Wishlist** | Lista de deseos guardada en la cuenta | Baja |
| **Dashboard de métricas (Admin)** | Gráficos de ventas, bookings, ingresos por mes | Alta |
| **Notificaciones push** | Alertas al usuario cuando cambia estado de pedido | Alta |
| **Blog / Content** | Sección de artículos para SEO y autoridad | Media |
| **Multi-idioma** | Soporte para inglés y español | Media |
| **Pasarela Stripe** | Alternativa a PayPal para tarjetas | Media |
| **Google Calendar Sync** | Sincronizar bookings automáticamente con Google Calendar | Media |
| **Cancelación/Reprogramación** | Que la clienta pueda cancelar o mover su sesión | Media |
