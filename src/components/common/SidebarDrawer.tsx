/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight, ShoppingCart, HelpCircle } from 'lucide-react';
import { Product, CartItem } from '../../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'wishlist' | 'cart';
  cartItems: CartItem[];
  wishlistItems: Product[];
  onRemoveFromCart: (index: number) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onCheckout: () => void;
  onUpdateCartQty?: (index: number, quantity: number) => void;
  onToggleCartSelection?: (index: number) => void;
  onToggleShopSelection?: (sellerName: string, selected: boolean) => void;
  navigate: (screen: any) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  type,
  cartItems,
  wishlistItems,
  onRemoveFromCart,
  onRemoveFromWishlist,
  onAddToCart,
  onBuyNow,
  onCheckout,
  onUpdateCartQty,
  onToggleCartSelection,
  onToggleShopSelection,
  navigate,
}) => {
  const isCart = type === 'cart';

  // Calculate cart subtotal (only for selected items)
  const subtotal = isCart
    ? cartItems.reduce((acc, item) => acc + (item.selected ? item.product.price * item.quantity : 0), 0)
    : 0;

  // Selected count in cart
  const selectedCartCount = isCart
    ? cartItems.filter((item) => item.selected).reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  // Total unique items or overall count in wishlist
  const activeCount = isCart
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : wishlistItems.length;

  // Group cart items by seller
  const groupedCart = React.useMemo(() => {
    if (!isCart) return [];

    const itemsWithIndex = cartItems.map((item, idx) => ({
      item,
      originalIndex: idx
    }));

    const groups: { [key: string]: typeof itemsWithIndex } = {};
    itemsWithIndex.forEach((entry) => {
      const seller = entry.item.product.sellerName;
      if (!groups[seller]) {
        groups[seller] = [];
      }
      groups[seller].push(entry);
    });

    return Object.keys(groups).map((sellerName) => {
      const entries = groups[sellerName];
      const isAllSelected = entries.every((e) => e.item.selected);
      return {
        sellerName,
        entries,
        isAllSelected,
      };
    });
  }, [cartItems, isCart]);

  // Format currency
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-100"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[460px] bg-white shadow-2xl z-100 flex flex-col font-geist border-l border-[#f0edec]"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#f0edec] flex items-center justify-between bg-[#fcf9f8]">
              <div className="flex items-center gap-2.5">
                {isCart ? (
                  <ShoppingBag size={20} className="text-[#002d1c]" />
                ) : (
                  <Heart size={20} className="text-[#002d1c]" />
                )}
                <h3 className="font-display font-black text-base text-[#002d1c] tracking-tight">
                  {isCart ? 'Keranjang Belanja sirkular' : 'Wishlist Terkurasi'}
                </h3>
                <span className="text-[10px] font-mono bg-[#1a4331]/10 text-[#002d1c] font-bold px-2 py-0.5 rounded-full">
                  {activeCount} Item
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-[#414944] hover:text-[#002d1c] p-1.5 rounded-full hover:bg-[#e5e2e1]/40 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isCart ? (
                cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#c1c8c2]">
                      <ShoppingBag size={28} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#1c1b1b] text-sm">Keranjang Anda Kosong</h4>
                      <p className="text-xs text-[#414944] leading-relaxed max-w-[280px]">
                        Temukan pakaian vintage & preloved berkualitas tinggi untuk memulai gaya hidup sirkular Anda.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        navigate('catalog');
                      }}
                      className="bg-[#002d1c] text-white text-xs font-black px-6 py-3 rounded-full hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                    >
                      Mulai Jelajahi Katalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {groupedCart.map((group) => (
                      <div
                        key={group.sellerName}
                        className="border border-[#c1c8c2]/30 rounded-2xl bg-[#fcf9f8] p-4 space-y-3 shadow-sm"
                      >
                        {/* Shop Header with Checkbox */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#f0edec]">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={group.isAllSelected}
                              onChange={(e) => onToggleShopSelection?.(group.sellerName, e.target.checked)}
                              className="w-4 h-4 rounded border-[#c1c8c2] text-[#002d1c] focus:ring-[#002d1c] accent-[#002d1c] cursor-pointer"
                            />
                            <span className="font-display font-black text-xs text-[#002d1c] tracking-tight uppercase">
                              🛍️ Toko: {group.sellerName}
                            </span>
                          </label>
                        </div>

                        {/* Group Products List */}
                        <div className="space-y-3">
                          {group.entries.map(({ item, originalIndex }) => (
                            <div
                              key={`${item.product.id}-${originalIndex}`}
                              className="flex gap-3 items-start group bg-white p-3 rounded-xl border border-[#c1c8c2]/10 shadow-xs"
                            >
                              {/* Product Checkbox */}
                              <div className="flex items-center self-center h-full pr-1">
                                <input
                                  type="checkbox"
                                  checked={item.selected}
                                  onChange={() => onToggleCartSelection?.(originalIndex)}
                                  className="w-4 h-4 rounded border-[#c1c8c2] text-[#002d1c] focus:ring-[#002d1c] accent-[#002d1c] cursor-pointer"
                                />
                              </div>

                              {/* Product Thumbnail */}
                              <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#e5e2e1] shrink-0 border border-[#f0edec]">
                                <img
                                  src={item.product.imagePrimary}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              {/* Product details */}
                              <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-bold text-[#414944]/75 uppercase tracking-wider block">
                                    {item.product.brand}
                                  </span>
                                  <h4 className="font-bold text-xs text-[#1c1b1b] leading-tight line-clamp-1">
                                    {item.product.name}
                                  </h4>
                                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                    <span className="text-[9px] bg-[#f6f3f2] text-[#414944] font-medium px-1.5 py-0.5 rounded">
                                      Ukuran: {item.product.size}
                                    </span>
                                    <span className="text-[9px] bg-[#1a4331]/5 text-[#002d1c] font-semibold px-1.5 py-0.5 rounded">
                                      {item.product.condition}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                                  <span className="text-xs font-black text-[#002d1c]">
                                    {formatIDR(item.product.price)}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    {/* Quantity adjustments */}
                                    <div className="flex items-center gap-1 bg-[#fcf9f8] border border-[#c1c8c2]/40 rounded-full px-2 py-0.5 text-xs font-geist">
                                      <button
                                        onClick={() => onUpdateCartQty?.(originalIndex, item.quantity - 1)}
                                        className="w-5 h-5 rounded-full flex items-center justify-center font-black text-[#414944] hover:bg-black/5 active:scale-90 cursor-pointer text-sm"
                                      >
                                        -
                                      </button>
                                      <span className="font-black text-[#002d1c] min-w-[16px] text-center text-xs">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => onUpdateCartQty?.(originalIndex, item.quantity + 1)}
                                        className="w-5 h-5 rounded-full flex items-center justify-center font-black text-[#414944] hover:bg-black/5 active:scale-90 cursor-pointer text-sm"
                                      >
                                        +
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => onRemoveFromCart(originalIndex)}
                                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors cursor-pointer"
                                      title="Hapus dari keranjang"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                wishlistItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#c1c8c2]">
                      <Heart size={28} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#1c1b1b] text-sm">Wishlist Anda Masih Kosong</h4>
                      <p className="text-xs text-[#414944] leading-relaxed max-w-[280px]">
                        Sukai barang preloved favorit Anda agar tersimpan di sini sebelum kehabisan!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        navigate('catalog');
                      }}
                      className="bg-[#002d1c] text-white text-xs font-black px-6 py-3 rounded-full hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                    >
                      Mulai Jelajahi Katalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-[#f0edec]">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 pt-4 first:pt-0 group relative"
                      >
                        {/* Product Thumbnail */}
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#e5e2e1] shrink-0 border border-[#f0edec]">
                          <img
                            src={item.imagePrimary}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Product details */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-[#002d1c] uppercase tracking-wider block">
                              {item.brand}
                            </span>
                            <h4 className="font-bold text-xs text-[#1c1b1b] leading-tight line-clamp-1">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] bg-[#f6f3f2] text-[#414944] font-medium px-2 py-0.5 rounded-md">
                                Ukuran: {item.size}
                              </span>
                              <span className="text-[10px] bg-[#1a4331]/5 text-[#002d1c] font-semibold px-2 py-0.5 rounded-md">
                                {item.condition}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-black text-[#002d1c]">
                              {formatIDR(item.price)}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  onAddToCart(item);
                                  onRemoveFromWishlist(item.id);
                                }}
                                className="bg-[#002d1c] text-white hover:opacity-90 transition-all text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
                              >
                                <ShoppingCart size={10} />
                                <span>+ Bag</span>
                              </button>
                              <button
                                onClick={() => onRemoveFromWishlist(item.id)}
                                className="text-[#414944] hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors cursor-pointer"
                                title="Hapus dari wishlist"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Drawer Footer */}
            {activeCount > 0 && (
              <div className="p-6 border-t border-[#f0edec] bg-[#fcf9f8] space-y-4">
                {isCart ? (
                  <>
                    {/* Cart Summary */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-[#414944]">
                        <span>Subtotal Belanja ({selectedCartCount} barang)</span>
                        <span>{formatIDR(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#414944]">
                        <span className="flex items-center gap-1">
                          Pajak & Biaya Layanan Sirkular <HelpCircle size={10} />
                        </span>
                        <span className="text-[#3e6752] font-semibold">Tercakup & Terkurasi</span>
                      </div>
                      <div className="border-t border-[#f0edec] my-2 pt-2 flex justify-between items-center text-sm font-black text-[#002d1c]">
                        <span>Total Pembayaran</span>
                        <span>{formatIDR(subtotal)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => {
                          onClose();
                          navigate('profile');
                        }}
                        className="border border-[#c1c8c2] text-[#414944] text-xs font-black py-3.5 rounded-full hover:bg-white transition-all text-center cursor-pointer bg-white"
                      >
                        Lihat Keranjang
                      </button>
                      <button
                        onClick={() => {
                          if (selectedCartCount === 0) {
                            alert('Silakan pilih minimal satu produk untuk melakukan checkout.');
                            return;
                          }
                          onClose();
                          onCheckout();
                        }}
                        disabled={selectedCartCount === 0}
                        className={`text-xs font-black py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm cursor-pointer ${
                          selectedCartCount === 0
                            ? 'bg-[#c1c8c2] text-white opacity-60 cursor-not-allowed'
                            : 'bg-[#002d1c] text-white hover:opacity-90'
                        }`}
                      >
                        <span>Checkout</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] text-center text-[#414944] leading-relaxed">
                      Barang preloved terkurasi di wishlist Anda bersifat terbatas (hanya ada 1 stok per barang). Checkout sekarang sebelum keduluan pembeli lain!
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        navigate('profile');
                      }}
                      className="w-full bg-[#002d1c] text-white text-xs font-black py-3.5 rounded-full hover:opacity-90 transition-all text-center active:scale-95 shadow-sm block cursor-pointer"
                    >
                      Buka Semua Wishlist Saya
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
