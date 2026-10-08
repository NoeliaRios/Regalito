'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Wishlist, Gift } from '@prisma/client';

export type WishlistWithGifts = Wishlist & {
  gifts: Gift[];
};

export async function getWishlistBySlug(slug: string): Promise<WishlistWithGifts | null> {
  if (!slug) return null;
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { slug },
      include: {
        gifts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return wishlist;
  } catch (error) {
    console.error('Error fetching wishlist by slug:', error);
    return null;
  }
}

export async function addGift(data: {
  wishlistSlug: string;
  title: string;
  description?: string;
  price?: number;
  buyUrl?: string;
  imageUrl?: string;
}): Promise<{ success: boolean; gift?: Gift; error?: string }> {
  try {
    const { wishlistSlug, title, description, price, buyUrl, imageUrl } = data;

    if (!wishlistSlug || !title) {
      return { success: false, error: 'Wishlist slug and title are required' };
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { slug: wishlistSlug },
    });

    if (!wishlist) {
      return { success: false, error: 'Wishlist not found' };
    }

    const gift = await prisma.gift.create({
      data: {
        wishlistId: wishlist.id,
        title,
        description: description || null,
        price: price !== undefined && !isNaN(price) ? Number(price) : null,
        buyUrl: buyUrl || null,
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath(`/${wishlistSlug}`);
    revalidatePath(`/admin/${wishlistSlug}`);

    return { success: true, gift };
  } catch (error: any) {
    console.error('Error adding gift:', error);
    return { success: false, error: error.message || 'Failed to add gift' };
  }
}

export async function deleteGift(data: {
  giftId: string;
  wishlistSlug: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { giftId, wishlistSlug } = data;

    if (!giftId) {
      return { success: false, error: 'Gift ID is required' };
    }

    await prisma.gift.delete({
      where: { id: giftId },
    });

    if (wishlistSlug) {
      revalidatePath(`/${wishlistSlug}`);
      revalidatePath(`/admin/${wishlistSlug}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting gift:', error);
    return { success: false, error: error.message || 'Failed to delete gift' };
  }
}

export async function toggleReserveGift(data: {
  giftId: string;
  wishlistSlug: string;
  reservedBy?: string;
}): Promise<{ success: boolean; isReserved?: boolean; error?: string }> {
  try {
    const { giftId, wishlistSlug, reservedBy } = data;

    if (!giftId) {
      return { success: false, error: 'Gift ID is required' };
    }

    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
    });

    if (!gift) {
      return { success: false, error: 'Gift not found' };
    }

    const newIsReserved = !gift.isReserved;
    const updatedGift = await prisma.gift.update({
      where: { id: giftId },
      data: {
        isReserved: newIsReserved,
        reservedBy: newIsReserved ? (reservedBy || 'Anónimo') : null,
      },
    });

    if (wishlistSlug) {
      revalidatePath(`/${wishlistSlug}`);
      revalidatePath(`/admin/${wishlistSlug}`);
    }

    return { success: true, isReserved: updatedGift.isReserved };
  } catch (error: any) {
    console.error('Error toggling reserve gift:', error);
    return { success: false, error: error.message || 'Failed to toggle reservation' };
  }
}
