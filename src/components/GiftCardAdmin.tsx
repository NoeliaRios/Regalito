'use client';

import React, { useState } from 'react';
import { Gift } from '@prisma/client';
import { deleteGift } from '@/actions/wishlist';
import { ExternalLink, Trash2, CheckCircle, ShoppingBag } from 'lucide-react';

interface GiftCardAdminProps {
  gift: Gift;
  wishlistSlug: string;
}

export function GiftCardAdmin({ gift, wishlistSlug }: GiftCardAdminProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${gift.title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await deleteGift({
        giftId: gift.id,
        wishlistSlug,
      });
      if (!res.success) {
        alert(res.error || 'Error al eliminar el regalo');
      }
    } catch (error) {
      console.error('Error deleting gift:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
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
        {gift.isReserved ? (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
            <CheckCircle className="h-3.5 w-3.5" />
            Reservado
          </div>
        ) : (
          <div className="absolute top-3 right-3 rounded-full bg-zinc-900/60 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
            Disponible
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
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/55 transition disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
