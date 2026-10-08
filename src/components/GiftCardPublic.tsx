'use client';

import React, { useState } from 'react';
import { Gift } from '@prisma/client';
import { toggleReserveGift } from '@/actions/wishlist';
import { ReserveModal } from './ReserveModal';
import { ExternalLink, CheckCircle, Lock, ShoppingBag } from 'lucide-react';

interface GiftCardPublicProps {
  gift: Gift;
  wishlistSlug: string;
}

export function GiftCardPublic({ gift, wishlistSlug }: GiftCardPublicProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReserveClick = () => {
    if (gift.isReserved) {
      // If already reserved, allow unreserving directly or with confirmation
      handleToggleReserve();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleToggleReserve = async (reservedBy?: string) => {
    setLoading(true);
    try {
      const res = await toggleReserveGift({
        giftId: gift.id,
        wishlistSlug,
        reservedBy,
      });
      if (!res.success) {
        alert(res.error || 'Error al actualizar la reserva');
      }
    } catch (error) {
      console.error('Error toggling reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-zinc-900 border ${
        gift.isReserved 
          ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10' 
          : 'border-zinc-100 dark:border-zinc-800'
      }`}>
        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {gift.imageUrl ? (
            <img
              src={gift.imageUrl}
              alt={gift.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-600">
              <ShoppingBag className="h-12 w-12 stroke-[1.5]" />
            </div>
          )}

          {/* Price Badge */}
          {gift.price !== null && gift.price !== undefined && (
            <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-900 shadow-sm backdrop-blur-md dark:bg-zinc-900/90 dark:text-zinc-100">
              ${Number(gift.price).toFixed(2)}
            </div>
          )}

          {/* Status Badge */}
          {gift.isReserved && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
              <CheckCircle className="h-3.5 w-3.5" />
              Reservado
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
            {gift.title}
          </h3>

          {gift.description && (
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {gift.description}
            </p>
          )}

          {gift.isReserved && gift.reservedBy && (
            <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Reservado por: {gift.reservedBy}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            {gift.buyUrl ? (
              <a
                href={gift.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 transition"
              >
                Ver tienda <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="text-xs text-zinc-400 dark:text-zinc-600">Sin link</span>
            )}

            <button
              onClick={handleReserveClick}
              disabled={loading}
              className={`rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition active:scale-[0.98] disabled:opacity-50 ${
                gift.isReserved
                  ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  : 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20'
              }`}
            >
              {loading
                ? 'Actualizando...'
                : gift.isReserved
                ? 'Liberar Reserva'
                : 'Reservar Regalo'}
            </button>
          </div>
        </div>
      </div>

      <ReserveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleToggleReserve}
        giftTitle={gift.title}
      />
    </>
  );
}
