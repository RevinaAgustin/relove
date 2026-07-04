/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, Shield, ArrowLeft, Heart, ShoppingCart, HelpCircle, UserCheck, Edit2, Trash2, Archive } from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailViewProps {
  product: Product;
  onBuyNow: (product: Product, quantity: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onGoBack: () => void;
  onGoToShop: (sellerName: string) => void;
  userProfile?: { name: string; shopName: string; email: string; phone: string; avatar: string };
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateProduct?: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBuyNow,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onGoBack,
  onGoToShop,
  userProfile,
  onEditProduct,
  onDeleteProduct,
  onUpdateProduct,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  // 5-Point Verified Condition Check Galleried Photos
  const productPhotos: Array<{ label: string; url: string; isZoomed?: boolean; isMinus?: boolean; minusText?: string }> = [
    { label: 'Depan', url: product.imagePrimary },
    { label: 'Belakang', url: product.imageHover },
    { label: 'Label/Tag', url: product.imageTag || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY7RgKRR--WV_tAd9SPVkiCsi8eLuii-7l7lxX2C8dyEhHpCKjWb5627gWUMBiMbBJsi16MlVBl0KzVr6yM4qOCLIBdSieAwyB11X81dc77fOvUkgUrN-iMr73YacBV7bzavKAV7cxhcmGReVGLaJobEicNTqhnvKiLvs9D9oQu0opEDIxkdX1US33G4Yw887vPTc-tJ-ddZOia8OGA-q0D-p2Bh0Z1sQvHMaVQO5Txo7CyQyUPpuErLVXa9r9mdkZlM330fl152Vx' },
    { label: 'Minus', url: product.imageMinus || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeaaSSlwZgkNTPgGz4AyxDMt-MWKJdq4PVgkFOUnAOrcFITJyHqtGxxwzq6r-unalJF4MLtNFyUZIaDPx3--QudBhABuXFhOK0Ru2kqtox9GNgL5B3xUhNbyEQ3p9xqhUkIuocopCbiCOF-AOXCE642SL3Av4Vj1Xwm3aZkDFtC_xircD3xswsprnXF0l4NimrpKwjhqDWWLu-IZiu4eE1jJbH7Q0LnZpCQkMBDvbgT0GrtpPjxMIINzxa3eaevmjbWkwOQajCWnlu', isMinus: true, minusText: 'Jahitan sedikit longgar' },
    { label: 'Detail Bahan', url: product.imageDetail || product.imagePrimary, isZoomed: true }
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Breadcrumbs / Back button */}
      <button
        onClick={onGoBack}
        className="flex items-center gap-2 text-xs font-geist text-[#414944] hover:text-[#002d1c] transition-colors max-w-fit"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Katalog RE-LOVE</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap">
        {/* Left Column: Gallery & Core Details */}
        <div className="lg:col-span-7 flex flex-col gap-bento-gap">
          {/* Main Product Gallery Bento Container */}
          <section className="bg-white rounded-[24px] shadow-sm border border-[#c1c8c2]/30 overflow-hidden flex flex-col p-4 md:p-6">
            <div className="relative w-full aspect-[4/3] bg-[#f0edec] rounded-xl overflow-hidden group">
              <img
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  productPhotos[activePhotoIndex].isZoomed ? 'scale-150 origin-center' : ''
                }`}
                referrerPolicy="no-referrer"
                src={productPhotos[activePhotoIndex].url}
              />
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-on-surface hover:text-[#ba1a1a] transition-colors shadow-sm z-20"
              >
                <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>

              {/* Verified Badge Indicator */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-geist font-black text-[#002d1c] shadow-md border border-[#c1c8c2]/30 flex items-center gap-1.5 z-20">
                <UserCheck size={14} className="text-[#3e6752]" />
                <span>Terverifikasi: {productPhotos[activePhotoIndex].label}</span>
              </div>

              {/* Minus Overlay Alert if active */}
              {productPhotos[activePhotoIndex].isMinus && (
                <div className="absolute top-4 left-4 bg-red-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md backdrop-blur-xs flex items-center gap-1.5 animate-in slide-in-from-top-2 duration-200 z-20 font-geist">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  <span>Minus: {productPhotos[activePhotoIndex].minusText}</span>
                </div>
              )}
            </div>
            
            {/* Thumbnails (5-Point Verified Check) */}
            <div className="flex gap-3 p-4 overflow-x-auto snap-x scrollbar-none justify-start mt-2">
              {productPhotos.map((photo, i) => {
                const isActive = activePhotoIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIndex(i)}
                    className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all relative flex flex-col p-1.5 bg-[#fcf9f8] shadow-sm cursor-pointer ${
                      isActive ? 'border-[#002d1c] bg-[#1a4331]/5' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full h-14 rounded-lg overflow-hidden relative">
                      <img
                        alt={photo.label}
                        className={`w-full h-full object-cover ${photo.isZoomed ? 'scale-150 origin-center' : ''}`}
                        referrerPolicy="no-referrer"
                        src={photo.url}
                      />
                      {photo.isMinus && (
                        <div className="absolute inset-0 bg-red-500/15 border border-red-500/30 rounded-lg"></div>
                      )}
                    </div>
                    {/* Label Text at the bottom */}
                    <span className="text-[9px] font-black text-center w-full block truncate mt-1.5 text-[#414944] uppercase tracking-wider font-geist">
                      {photo.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Descriptive details */}
          <section className="bg-white rounded-[24px] shadow-sm border border-[#c1c8c2]/30 p-6 md:p-8">
            <h3 className="font-display text-[#1c1b1b] font-bold text-xl mb-4">Deskripsi Produk</h3>
            <div className="font-body text-sm text-[#414944] space-y-4 leading-relaxed">
              <p>{product.description}</p>
              <p>Merek {product.brand} asli, bukan tiruan. Kain denim/wol organik berkualitas tinggi yang kokoh, dijamin asri seiring penuaan bahan natural.</p>
              <div className="pt-4 border-t border-[#c1c8c2]/20">
                <h4 className="font-geist text-xs font-bold uppercase tracking-wider text-[#1c1b1b] mb-3">Spesifikasi Detail</h4>
                <ul className="list-disc pl-5 space-y-2 text-xs font-geist text-[#414944]">
                  <li>Merek: <strong className="text-[#1c1b1b]">{product.brand}</strong></li>
                  <li>Kategori: <strong className="text-[#1c1b1b]">{product.category}</strong></li>
                  <li>Ukuran: <strong className="text-[#1c1b1b]">{product.size}</strong></li>
                  <li>Kondisi: <strong className="text-[#1c1b1b]">{product.condition}</strong></li>
                  <li>Sitem Pembayaran: <strong className="text-[#002d1c]">QRIS</strong></li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Dynamic Price Action Sticky Card & Seller Integrity Box */}
        <div className="lg:col-span-5 flex flex-col gap-bento-gap">
          <div className="sticky top-28 flex flex-col gap-bento-gap">
            <section className="bg-white rounded-[24px] shadow-sm border border-[#c1c8c2]/30 p-6 md:p-8">
              <div className="inline-flex items-center gap-1 bg-[#d4e5c7] text-[#002d1c] px-3.5 py-1 rounded-full font-geist text-xs font-bold mb-4">
                <Star size={12} className="fill-[#002d1c] text-[#002d1c]" />
                <span>Kondisi: {product.condition}</span>
              </div>
              <h1 className="font-display text-[#1c1b1b] text-3xl font-extrabold leading-tight tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="text-[11px] font-geist text-[#414944]/70 uppercase tracking-widest font-bold mb-4">
                BRAND: {product.brand}
              </p>
              
              <div className="border-t border-[#f0edec] pt-5 mt-2 flex items-baseline gap-2">
                <span className="text-[32px] font-display font-extrabold text-[#002d1c]">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-[#414944]/55 font-geist line-through">
                  Rp {(product.price * 2.2).toLocaleString('id-ID')}
                </span>
              </div>

              {/* Payment badge protection warning */}
              <div className="bg-[#f6f3f2] rounded-xl p-4 flex items-start gap-3 mt-6 border border-[#c1c8c2]/20 font-geist text-xs">
                <Shield className="text-[#002d1c] fill-[#c0edd3] flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-[#1c1b1b] mb-1">Proteksi Pembayaran di RE-LOVE</h4>
                  <p className="text-[#414944] leading-relaxed">
                    Dana ditahan di rekening RE-LOVE dan baru diberikan setelah kepada penjual Anda menerima produk dan mengonfirmasikannya.
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.sellerName !== userProfile?.shopName && (
                <div className="flex items-center justify-between bg-[#fcf9f8] border border-[#c1c8c2]/30 p-4 rounded-[16px] mt-6 font-geist shadow-inner">
                  <span className="text-xs font-bold text-[#414944] uppercase tracking-wider">Jumlah Pembelian</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full border border-[#c1c8c2]/50 flex items-center justify-center text-[#414944] hover:border-[#002d1c] hover:bg-[#002d1c]/5 hover:text-[#002d1c] transition-all font-bold cursor-pointer active:scale-90"
                    >
                      -
                    </button>
                    <span className="text-sm font-black text-[#002d1c] w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-full border border-[#c1c8c2]/50 flex items-center justify-center text-[#414944] hover:border-[#002d1c] hover:bg-[#002d1c]/5 hover:text-[#002d1c] transition-all font-bold cursor-pointer active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {product.sellerName === userProfile?.shopName ? (
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={() => onEditProduct && onEditProduct(product)}
                    className="w-full bg-[#002d1c] text-white hover:opacity-95 text-sm py-4 rounded-[16px] font-geist font-black flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md cursor-pointer"
                  >
                    <Edit2 size={16} />
                    <span>Edit Detail Barang</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        if (onUpdateProduct) {
                          onUpdateProduct({
                            ...product,
                            isArchived: !product.isArchived
                          });
                        }
                      }}
                      className={`w-full bg-transparent border text-xs py-4 rounded-[16px] font-geist font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer ${
                        product.isArchived 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'border-[#c1c8c2] text-[#414944] hover:bg-[#f6f3f2]'
                      }`}
                    >
                      <Archive size={14} />
                      <span>{product.isArchived ? 'Aktifkan' : 'Arsipkan'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onDeleteProduct) {
                          if (window.confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen dari listing Anda?')) {
                            onDeleteProduct(product.id);
                          }
                        }
                      }}
                      className="w-full bg-transparent border border-red-200 text-red-600 hover:bg-red-50 text-xs py-4 rounded-[16px] font-geist font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={() => onBuyNow(product, quantity)}
                    className="w-full bg-[#002d1c] text-white hover:opacity-95 text-sm py-4 rounded-[16px] font-geist font-black flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md cursor-pointer"
                  >
                    Beli Sekarang
                  </button>
                  <button
                    onClick={() => onAddToCart(product, quantity)}
                    className="w-full bg-transparent border border-[#002d1c] text-[#002d1c] hover:bg-[#f6f3f2] text-sm py-4 rounded-[16px] font-geist font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                  >
                    <ShoppingCart size={16} />
                    Tambah ke Keranjang
                  </button>
                </div>
              )}
            </section>

            {/* Seller profile block (Hidden if own shop) */}
            {product.sellerName !== userProfile?.shopName && (
              <section className="bg-white rounded-[24px] shadow-sm border border-[#c1c8c2]/30 p-6">
                <h4 className="font-geist font-bold text-[10px] text-[#414944]/65 uppercase tracking-widest mb-4">
                  Informasi Penjual
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#002d1c] text-white font-display font-black rounded-full flex items-center justify-center text-md shadow-sm">
                      {product.sellerName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-display font-semibold text-sm text-[#1c1b1b] line-clamp-1">{product.sellerName}</h5>
                      <div className="flex items-center gap-1 font-geist text-xs text-[#002d1c] font-black">
                        <Star size={12} className="fill-current" />
                        <span>{product.sellerRating} / 5.0 Rating</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onGoToShop(product.sellerName)}
                    className="px-4 py-2 bg-[#f0edec] hover:bg-[#ebe7e7] text-xs font-geist font-bold text-[#1c1b1b] rounded-full transition-colors cursor-pointer"
                  >
                    Lihat Toko
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#f0edec] font-geist">
                  <div className="bg-[#f6f3f2] rounded-xl p-3 border border-black/5 text-center">
                    <p className="text-[#1c1b1b] font-bold text-sm">{product.transactions || 120}+</p>
                    <p className="text-[10px] text-[#414944]">Barang Terjual</p>
                  </div>
                  <div className="bg-[#f6f3f2] rounded-xl p-3 border border-black/5 text-center">
                    <p className="text-[#1c1b1b] font-bold text-sm">{product.responseTime || '98%'}</p>
                    <p className="text-[10px] text-[#414944]">Respon Obrolan</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
