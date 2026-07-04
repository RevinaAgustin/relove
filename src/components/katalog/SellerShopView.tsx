/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Star, MessageSquare, Heart, Shield, Plus, Check, UserCheck, Search } from 'lucide-react';
import { Product } from '../../types';

interface SellerShopViewProps {
  sellerName: string;
  products: Product[];
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onGoBack: () => void;
  onChatSeller: (sellerName: string) => void;
  backLabel?: string;
  userProfile?: { name: string; shopName: string; email: string; phone: string; avatar: string };
}

export const SellerShopView: React.FC<SellerShopViewProps> = ({
  sellerName,
  products,
  wishlist,
  toggleWishlist,
  onSelectProduct,
  onGoBack,
  onChatSeller,
  backLabel,
  userProfile,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products by this seller and the search query
  const sellerProducts = products.filter(
    (p) => p.sellerName.toLowerCase() === sellerName.toLowerCase()
  );

  const filteredProducts = sellerProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Derive stats from the first product or fallback to default curation
  const sampleProduct = sellerProducts[0] || {
    sellerRating: 4.9,
    transactions: 120,
    responseTime: '98%',
  };

  const rating = sampleProduct.sellerRating || 4.9;
  const soldCount = sampleProduct.transactions || 120;
  const responseRate = sampleProduct.responseTime || '98%';

  // Mock Reviews data for two-row carousel marquee
  const row1Reviews = [
    { name: 'Sarah Jones', text: 'Jaket denimnya mulus banget! Bersih, wangi, kerasa eksklusif. Recommended!', stars: 5, date: '2 hari lalu' },
    { name: 'Budi Santoso', text: 'Pengemasannya keren, pakai kardus daur ulang rapi. Pengiriman cepat.', stars: 5, date: '1 minggu lalu' },
    { name: 'Dinda Kirana', text: 'Barang sesuai deskripsi, minusnya hampir gak kelihatan. Mantap!', stars: 5, date: '3 hari lalu' },
    { name: 'Rian Adiputra', text: 'Respon penjual sangat ramah dan sabar jawab pertanyaan detail.', stars: 4, date: '2 minggu lalu' },
    { name: 'Amanda Putri', text: 'Kaos vintage-nya original Balenciaga asli. Suka banget!', stars: 5, date: '5 hari lalu' }
  ];

  const row2Reviews = [
    { name: 'Toni Wahyu', text: 'Ini pembelian kedua saya di toko ini, selalu memuaskan dan bersih.', stars: 5, date: '1 bulan lalu' },
    { name: 'Eka Saputra', text: 'Sterilisasi ozon-nya beneran bikin baju preloved gak bau apek sama sekali.', stars: 5, date: '12 hari lalu' },
    { name: 'Fitri Nur', text: 'Rating bintang 5 layak banget buat pelayanan secepat ini!', stars: 5, date: '4 hari lalu' },
    { name: 'Toni Rian', text: 'Defect-nya jujur banget digambarin, pas nyampe malah samar.', stars: 5, date: '2 hari lalu' },
    { name: 'Budi Mukti', text: 'Boots kulitnya masih kinclong, dapet box kemasan kokoh.', stars: 5, date: '1 minggu lalu' }
  ];

  // Duplicate for smooth seamless loop marquee scrolling
  const marqueeRow1 = [...row1Reviews, ...row1Reviews, ...row1Reviews];
  const marqueeRow2 = [...row2Reviews, ...row2Reviews, ...row2Reviews];

  return (
    <div className="flex flex-col gap-8 py-4 font-geist">
      {/* 1. Inline Styles for seamless marquee loop */}
      <style>{`
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marquee-left 35s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marquee-right 35s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Breadcrumb / Back Navigation */}
      <button
        onClick={onGoBack}
        className="flex items-center gap-2 text-xs font-geist text-[#414944] hover:text-[#002d1c] transition-colors max-w-fit cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>{backLabel || 'Kembali ke Detail Produk'}</span>
      </button>

      {/* 2. Hero Section: Shop Profile Banner Card */}
      <section className="bg-white rounded-[32px] overflow-hidden border border-[#c1c8c2]/35 shadow-sm relative">
        {/* Banner Green Gradient Background decoration */}
        <div className="h-44 w-full bg-gradient-to-r from-[#002d1c] to-[#1a4331] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c0edd3]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#d4e5c7]/15 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-8 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
            {/* Avatar Inclosure */}
            <div className="w-24 h-24 rounded-full bg-[#002d1c] text-[#c0edd3] border-4 border-white flex items-center justify-center font-display font-black text-3xl shadow-md z-10 shrink-0">
              {sellerName.charAt(0)}
            </div>

            <div className="flex flex-col gap-1.5 md:pb-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl font-display font-extrabold text-[#1c1b1b]">{sellerName}</h1>
                <span className="bg-[#c0edd3] text-[#002d1c] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <UserCheck size={10} className="stroke-[3]" />
                  <span>Verified Shop</span>
                </span>
              </div>

              {/* Statistics Grid */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-[#414944] font-medium">
                <div className="flex items-center gap-1 text-[#002d1c] font-bold">
                  <Star size={14} className="fill-[#002d1c]" />
                  <span>{rating} / 5.0 Rating</span>
                </div>
                <span className="hidden md:inline text-neutral-300">•</span>
                <div>{soldCount}+ Terjual</div>
                <span className="hidden md:inline text-neutral-300">•</span>
                <div className="flex items-center gap-1">
                  <Shield size={13} className="text-[#3e6752]" />
                  <span>{responseRate} Respon Chat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          {sellerName.toLowerCase() !== (userProfile?.shopName?.toLowerCase() || 'urbanarchive vintage') && (
            <div className="flex items-center justify-center gap-3 w-full md:w-auto md:pb-1">
              <button
                onClick={() => onChatSeller(sellerName)}
                className="flex-grow md:flex-grow-0 px-6 h-12 bg-transparent border border-[#002d1c] hover:bg-[#002d1c]/5 text-[#002d1c] rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageSquare size={14} />
                <span>Chat Penjual</span>
              </button>
              <button
                onClick={() => setIsFollowing((f) => !f)}
                className={`flex-grow md:flex-grow-0 px-6 h-12 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm ${
                  isFollowing
                    ? 'bg-[#d4e5c7] text-[#002d1c] border border-transparent'
                    : 'bg-[#002d1c] text-white hover:opacity-95'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check size={14} className="stroke-[3]" />
                    <span>Mengikuti</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} className="stroke-[3]" />
                    <span>Ikuti Toko</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Product Listings List of the Seller */}
      <section className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col gap-1 text-left">
            <h2 className="font-display text-[#002d1c] text-2xl font-extrabold tracking-tight">Katalog Toko</h2>
            <p className="text-xs text-[#414944]">
              {searchQuery.trim()
                ? `Menampilkan ${filteredProducts.length} dari ${sellerProducts.length} barang kurasi`
                : `Menampilkan ${sellerProducts.length} barang dari toko ${sellerName}`
              }
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72 font-geist">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#414944]/50" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari barang di toko ini..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#fcf9f8] border border-[#c1c8c2]/50 rounded-full outline-none focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] transition-all font-medium text-[#1c1b1b]"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/5 p-8 flex flex-col items-center justify-center">
            <div className="text-[#414944] font-bold mb-1.5">Barang tidak ditemukan</div>
            <p className="text-xs text-[#414944]/70 max-w-sm mb-6">
              {sellerProducts.length === 0 
                ? 'Belum ada barang terdaftar di toko ini.'
                : `Tidak ada hasil pencarian yang cocok untuk "${searchQuery}" di toko ini. Silakan coba kata kunci lain.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isFav = wishlist.includes(p.id);
              return (
                <div key={p.id} className="group cursor-pointer relative flex flex-col">
                  {/* Photo container */}
                  <div className="aspect-[3/4] overflow-hidden rounded-[24px] mb-4 bg-[#f0edec] relative border border-black/5">
                    <img
                      onClick={() => onSelectProduct(p)}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                      src={p.imagePrimary}
                    />
                    
                    {p.isVerified && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Check size={12} className="text-[#002d1c] fill-[#c0edd3]" />
                        <span className="text-[9px] font-bold text-[#002d1c] font-geist uppercase tracking-widest">
                          Terverifikasi
                        </span>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-[#414944] hover:text-[#ba1a1a] transition-colors"
                    >
                      <Heart size={14} className={isFav ? "fill-red-500 text-red-500" : ""} />
                    </button>
                  </div>

                  {/* Details metadata */}
                  <div onClick={() => onSelectProduct(p)} className="flex flex-col flex-grow font-geist text-left">
                    <div className="text-[11px] text-[#414944] uppercase tracking-wider mb-0.5">{p.brand}</div>
                    <h3 className="text-sm font-semibold text-[#1c1b1b] line-clamp-1 group-hover:text-[#002d1c] transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2.5">
                      <span className="text-sm text-[#002d1c] font-black">
                        Rp {p.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-[#414944] bg-[#f0edec] px-2 py-0.5 rounded font-medium">
                        Ukuran {p.size}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
