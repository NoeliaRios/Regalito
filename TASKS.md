# MVP Tasks Tracker

## Step 1: Base & Setup
- [ ] Inicializar app Next.js (`pnpm create next-app`)
- [ ] Configurar `.env` con `DATABASE_URL`
- [ ] Crear `prisma/schema.prisma` y `src/lib/prisma.ts`
- [ ] Ejecutar `npx prisma db push`

## Step 2: Server Actions
- [ ] Crear `src/actions/wishlist.ts`
- [ ] Implementar `getWishlistBySlug`
- [ ] Implementar `addGift`
- [ ] Implementar `deleteGift`
- [ ] Implementar `toggleReserveGift`

## Step 3: Components & UI
- [ ] Crear `GiftCardPublic.tsx`
- [ ] Crear `GiftCardAdmin.tsx`
- [ ] Crear `AddGiftForm.tsx`
- [ ] Crear `ReserveModal.tsx`

## Step 4: Pages & Flow
- [ ] Implementar `src/app/[slug]/page.tsx` (Vista amigos)
- [ ] Implementar `src/app/admin/[slug]/page.tsx` (Vista creador)
- [ ] Probar reservas en vivo y persistencia

## Step 5: Deploy
- [ ] Subir a GitHub
- [ ] Conectar con Vercel
- [ ] Cargar `DATABASE_URL` en Vercel
- [ ] Verificar deploy y probar URL pública