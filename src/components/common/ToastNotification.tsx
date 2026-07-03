/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '../../types';

export interface ToastItem {
  id: string;
  type: 'cart' | 'wishlist' | 'remove_wishlist';
  product: Product;
  quantity?: number;
}

interface ToastNotificationProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
  onActionClick: (type: 'cart' | 'wishlist') => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onClose,
  onActionClick,
}) => {
  // Setup standard IDR formatter
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed top-24 right-4 z-110 flex flex-col gap-3 w-full max-w-[390px] px-4 sm:px-0 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onClose={() => onClose(toast.id)}
            onActionClick={onActionClick}
            formatIDR={formatIDR}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onClose: () => void;
  onActionClick: (type: 'cart' | 'wishlist') => void;
  formatIDR: (val: number) => string;
}

const ToastCard: React.FC<ToastCardProps> = ({
  toast,
  onClose,
  onActionClick,
  formatIDR,
}) => {
  const { type, product, quantity } = toast;

  // Auto dismiss countdown timer representation
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isCart = type === 'cart';
  const isWishlist = type === 'wishlist';
  const isRemoveWishlist = type === 'remove_wishlist';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, x: 20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="bg-white rounded-2xl border border-[#002d1c]/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] pointer-events-auto overflow-hidden flex flex-col relative w-full"
    >
      {/* Visual background decor gradient */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${
        isRemoveWishlist ? 'bg-red-500' : 'bg-[#002d1c]'
      }`} />

      <div className="p-4 flex gap-3.5 items-start">
        {/* Product Image */}
        <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#e5e2e1] shrink-0 border border-black/5 relative">
          <img
            src={product.imagePrimary}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Content body */}
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              {isCart && (
                <span className="flex items-center gap-1 text-[10px] font-black text-[#002d1c] bg-[#1a4331]/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <ShoppingBag size={10} className="stroke-[3]" />
                  <span>Keranjang</span>
                </span>
              )}
              {isWishlist && (
                <span className="flex items-center gap-1 text-[10px] font-black text-[#b45309] bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Heart size={10} className="fill-amber-600 stroke-amber-600" />
                  <span>Suka</span>
                </span>
              )}
              {isRemoveWishlist && (
                <span className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Heart size={10} className="stroke-red-600" />
                  <span>Hapus Suka</span>
                </span>
              )}
              <span className="text-[10px] font-mono text-[#414944]/60 font-semibold">
                Baru Saja
              </span>
            </div>

            <h4 className="font-bold text-xs text-[#1c1b1b] leading-tight line-clamp-1 mt-1.5">
              {product.name}
            </h4>
            <p className="text-[10px] text-[#414944]/80">
              {isCart && `Ditambahkan x${quantity} • ${formatIDR(product.price * (quantity || 1))}`}
              {isWishlist && `Ditambahkan ke wishlist terkurasi`}
              {isRemoveWishlist && `Dihapus dari wishlist terkurasi`}
            </p>
          </div>

          {/* Inline Action Button */}
          {!isRemoveWishlist && (
            <button
              onClick={() => onActionClick(isCart ? 'cart' : 'wishlist')}
              className="text-[10px] font-black text-[#002d1c] hover:underline mt-2 flex items-center gap-1 cursor-pointer transition-all active:translate-x-0.5"
            >
              <span>{isCart ? 'Buka Keranjang' : 'Buka Wishlist'}</span>
              <ArrowRight size={10} className="stroke-[3.5]" />
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-[#414944]/60 hover:text-[#002d1c] p-1 rounded-full hover:bg-[#e5e2e1]/30 transition-colors cursor-pointer self-start"
          aria-label="Tutup"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress timer indicator */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        className={`h-0.5 ${isRemoveWishlist ? 'bg-red-300' : 'bg-[#002d1c]/30'}`}
      />
    </motion.div>
  );
};
