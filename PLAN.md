# Implementation Plan (MVP en 1 Día)

## Fase 1: Setup & Data Layer
1. Inicializar proyecto Next.js con Tailwind y TypeScript via pnpm.
2. Configurar Prisma, schema.prisma y conexión a PostgreSQL (Supabase/Neon).
3. Crear el singleton `src/lib/prisma.ts`.
4. Ejecutar `npx prisma db push` y popular datos iniciales (seed o manual).

## Fase 2: Backend Logic (Server Actions)
1. Definir los tipos de datos en TypeScript.
2. Implementar las Server Actions en `src/actions/wishlist.ts` usando `revalidatePath` para actualizaciones instantáneas.

## Fase 3: UI & Components (Mobile First)
1. Crear el layout global con estética limpia y moderna.
2. Crear componentes `GiftCardPublic` (estado disponible vs. reservado).
3. Crear formulario `AddGiftModal` / `AddGiftForm` para ingresar: Título, Link, Precio, Imagen y Notas.
4. Crear componente `ReserveModal` para capturar opcionalmente el nombre del amigo.

## Fase 4: Routing & Vistas
1. Armar página pública `src/app/[slug]/page.tsx`.
2. Armar página admin `src/app/admin/[slug]/page.tsx`.

## Fase 5: Testing & Deployment
1. Probar flujo end-to-end de creación, borrado y reserva.
2. Desplegar en Vercel y configurar variables de entorno (`DATABASE_URL`).