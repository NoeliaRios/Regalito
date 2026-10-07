# Specification: Birthday Wishlist MVP

## 1. Goal
Construir una web app rápida e intuitiva para compartir una lista de deseos de cumpleaños donde:
- El/la creador/a gestiona la lista (agregar, borrar regalos).
- Amigos/invitados acceden vía URL única, ven los regalos y los reservan en tiempo real para evitar compras duplicadas.

## 2. Technical Stack
- Framework: Next.js (App Router, TypeScript)
- UI / Styling: Tailwind CSS, Lucide Icons
- DB & ORM: PostgreSQL + Prisma ORM
- Deployment: Vercel

## 3. Data Schema (Prisma)

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Wishlist {
  id          String   @id @default(uuid())
  title       String
  description String?
  slug        String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  gifts       Gift[]
}

model Gift {
  id          String   @id @default(uuid())
  wishlistId  String
  wishlist    Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  title       String
  description String?
  price       Float?
  buyUrl      String?
  imageUrl    String?
  isReserved  Boolean  @default(false)
  reservedBy  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

## 4. Contracts & Server Actions (src/actions/wishlist.ts)

### getWishlistBySlug
- Input: `slug: string`
- Description: Devuelve la Wishlist correspondiente al slug junto con sus regalos asociados ordenados por fecha de creación descendente (`createdAt: 'desc'`).
- Return: `Promise<WishlistWithGifts | null>`

### addGift
- Input: `{ wishlistSlug: string, title: string, description?: string, price?: number, buyUrl?: string, imageUrl?: string }`
- Description: Busca la wishlist por el slug y crea un nuevo registro `Gift` en la DB. Llama a `revalidatePath('/[slug]')` y `revalidatePath('/admin/[slug]')`.
- Return: `Promise<{ success: boolean, gift?: Gift, error?: string }>`

### deleteGift
- Input: `{ giftId: string, wishlistSlug: string }`
- Description: Elimina el registro `Gift` por su ID. Llama a `revalidatePath` para actualizar las vistas públicas y de admin.
- Return: `Promise<{ success: boolean, error?: string }>`

### toggleReserveGift
- Input: `{ giftId: string, wishlistSlug: string, reservedBy?: string }`
- Description: Consulta el estado actual de `isReserved`. Si está `false`, lo pasa a `true` y guarda `reservedBy`. Si ya estaba `true`, lo pasa a `false` y limpia `reservedBy`. Llama a `revalidatePath`.
- Return: `Promise<{ success: boolean, isReserved: boolean, error?: string }>`