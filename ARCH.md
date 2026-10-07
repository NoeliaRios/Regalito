# Total Architecture Overview

## 1. Topology (Fullstack Monolith)
- Monolito desplegado en Vercel.
- API Layer mediante Next.js Server Actions (comunicación directa con la DB, cero problemas de CORS).
- DB relacional albergada en PostgreSQL (Supabase / Neon).

## 2. Directory Structure

wishlist-app/
├── .clirules
├── SPEC.md
├── ARCH.md
├── PLAN.md
├── TASKS.md
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                       # Home / Redirección o landing básica
│   │   ├── [slug]/                        # Vista pública para amigos (Reservar)
│   │   │   └── page.tsx
│   │   └── admin/[slug]/                  # Vista de administración (Crear / Borrar)
│   │       └── page.tsx
│   ├── actions/                           # Next.js Server Actions
│   │   └── wishlist.ts
│   ├── components/
│   │   ├── GiftCardPublic.tsx             # Tarjeta con botón de reserva
│   │   ├── GiftCardAdmin.tsx              # Tarjeta con botón de eliminar
│   │   ├── AddGiftModal.tsx               # Formulario/Modal para agregar regalo
│   │   └── ReserveModal.tsx               # Modal opcional para pedir nombre al reservar
│   └── lib/
│       └── prisma.ts                      # Client Singleton de Prisma