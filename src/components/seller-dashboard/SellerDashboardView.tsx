/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, TrendingUp, AlertCircle, ShoppingBag, PlusCircle, BarChart2, Eye, ShieldCheck, HelpCircle, ChevronRight, Wallet, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';

interface SellerDashboardViewProps {
  products: Product[];
  onAddNewListing: () => void;
  onSelectProduct: (product: Product) => void;
  onSwitchToBuyer: () => void;
  onNavigateToFinance: () => void;
  onNavigateToProducts: () => void;
  onNavigateToOrders: () => void;
  onViewOwnShop: () => void;
  userProfile?: { name: string; shopName: string; email: string; phone: string; avatar: string };
}

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({
  products,
  onAddNewListing,
  onSelectProduct,
  onSwitchToBuyer,
  onNavigateToFinance,
  onNavigateToProducts,
  onNavigateToOrders,
  onViewOwnShop,
  userProfile,
}) => {
  const [activeChartFilter, setActiveChartFilter] = useState<'7' | '30'>('7');
  const myProducts = products.filter(p => p.sellerName === (userProfile?.shopName || 'UrbanArchive Vintage'));

  // Simulated sold products list matching Rp 12.450.000 exactly
  const soldProducts = [
    { id: 'sold-1', name: 'Kaos Band Vintage Original', price: 10700000, courier: 'SiCepat REG', serviceFee: 15000, shippingFee: 22000, buyer: 'kolektor_sejati', date: '02 Jul 2026' },
    { id: 'sold-2', name: 'Sepatu Boots Kulit', price: 850000, courier: 'J&T Express', serviceFee: 10000, shippingFee: 30000, buyer: 'sarah_j', date: '30 Jun 2026' },
    { id: 'sold-3', name: 'Jaket Denim Vintage Classic', price: 450000, courier: 'SiCepat REG', serviceFee: 5000, shippingFee: 15000, buyer: 'budi_s', date: '28 Jun 2026' },
    { id: 'sold-4', name: 'Celana Cargo Corduroy', price: 220000, courier: 'AnterAja', serviceFee: 5000, shippingFee: 12000, buyer: 'dinda_a', date: '25 Jun 2026' },
    { id: 'sold-5', name: 'Sweater Retro 80s', price: 130000, courier: 'GoSend SameDay', serviceFee: 5000, shippingFee: 25000, buyer: 'andi_p', date: '20 Jun 2026' },
    { id: 'sold-6', name: 'Kemeja Flanel Vintage', price: 100000, courier: 'SiCepat REG', serviceFee: 5000, shippingFee: 15000, buyer: 'rian_k', date: '15 Jun 2026' },
  ];

  // Simulated chart indices values
  const dataset = {
    '7': [
      { day: 'Sen', value: 'h-10' },
      { day: 'Sel', value: 'h-24' },
      { day: 'Rab', value: 'h-14' },
      { day: 'Kam', value: 'h-36 bg-[#002d1c]' },
      { day: 'Jum', value: 'h-28' },
      { day: 'Sab', value: 'h-20' },
      { day: 'Min', value: 'h-8' },
    ],
    '30': [
      { day: 'M1', value: 'h-24' },
      { day: 'M2', value: 'h-32 bg-[#002d1c]' },
      { day: 'M3', value: 'h-16' },
      { day: 'M4', value: 'h-28' },
    ],
  };

  const chartData = dataset[activeChartFilter];

  return (
    <div className="flex flex-col gap-8 py-4 font-geist">
      {/* 1. Header Information */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#f0edec] pb-6">
        <div>
          <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight mb-2">{userProfile?.shopName || 'UrbanArchive Vintage'}</h1>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center bg-[#d4e5c7] text-[#002d1c] px-3 py-1 rounded-full font-bold">
              <Star size={12} className="fill-current mr-1" />
              <span>4.9 / 5.0 Rating</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onViewOwnShop}
            className="flex items-center gap-2 bg-white border border-[#c1c8c2] text-[#002d1c] hover:bg-[#fcf9f8] px-6 py-4 rounded-full text-xs font-black transition-all cursor-pointer"
          >
            <Eye size={16} />
            <span>Lihat Toko Anda</span>
          </button>
          <button
            onClick={onAddNewListing}
            className="flex items-center gap-2 bg-[#002d1c] text-white px-8 py-4 rounded-full text-xs font-black hover:opacity-95 active:scale-95 shadow-md shadow-[#002d1c]/15 transition-all"
          >
            <PlusCircle size={16} />
            <span>Mulai Menjual</span>
          </button>
        </div>
      </header>

      {/* 2. Numerical Stats Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Earnings Card */}
        <div className="bg-white rounded-[24px] p-6 border border-[#f0edec] shadow-sm flex flex-col justify-between">
          <p className="text-[#414944] text-[11px] font-bold uppercase tracking-wider mb-2">Total Pendapatan</p>
          <h3 className="text-2xl font-display font-extrabold text-[#002d1c]">Rp 12.450.000</h3>
          <div className="flex items-center mt-4 text-[#002d1c] text-[10px] font-bold">
            <TrendingUp size={12} className="mr-1" />
            <span>+12.4% meningkat bulan ini</span>
          </div>
        </div>

        {/* New Orders */}
        <div className="bg-white rounded-[24px] p-6 border border-[#f0edec] shadow-sm flex flex-col justify-between">
          <p className="text-[#414944] text-[11px] font-bold uppercase tracking-wider mb-2">Pesanan Masuk</p>
          <h3 className="text-2xl font-display font-extrabold text-[#002d1c]">14 Paket</h3>
          <div className="flex items-center mt-4 text-[#ba1a1a] text-[10px] font-bold">
            <AlertCircle size={12} className="mr-1" />
            <span>3 Perlu segera di-proses</span>
          </div>
        </div>

        {/* Active counting */}
        <div className="bg-white rounded-[24px] p-6 border border-[#f0edec] shadow-sm flex flex-col justify-between">
          <p className="text-[#414944] text-[11px] font-bold uppercase tracking-wider mb-2">Listing Aktif</p>
          <h3 className="text-2xl font-display font-extrabold text-[#002d1c]">{myProducts.length} Barang</h3>
          <p className="text-[10px] text-[#414944]/70 mt-4 font-normal">2 produk terjual 7 hari terakhir</p>
        </div>

        {/* Response count */}
        <div className="bg-white rounded-[24px] p-6 border border-[#f0edec] shadow-sm flex flex-col justify-between">
          <p className="text-[#414944] text-[11px] font-bold uppercase tracking-wider mb-2">Tingkat Penjualan</p>
          <h3 className="text-2xl font-display font-extrabold text-[#002d1c]">98% Responsif</h3>
          <div className="flex items-center mt-4 text-[#002d1c] text-[10px] font-bold">
            <ShieldCheck size={12} className="mr-1" />
            <span>Sangat Tanggap & Cepat</span>
          </div>
        </div>
      </div>

      {/* 3. Analytics Chart section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap">
        <div className="lg:col-span-8 bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-display font-bold text-[#002d1c]">Analitik Toko</h3>
              <p className="text-[10px] text-[#414944] mt-0.5 font-medium">Traffic & Konversi Pengunjung Mingguan</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveChartFilter('7')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  activeChartFilter === '7'
                    ? 'bg-[#002d1c] text-white border-transparent'
                    : 'border-[#c1c8c2] text-[#414944] hover:bg-[#f6f3f2]'
                }`}
              >
                7 Hari
              </button>
              <button
                onClick={() => setActiveChartFilter('30')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  activeChartFilter === '30'
                    ? 'bg-[#002d1c] text-white border-transparent'
                    : 'border-[#c1c8c2] text-[#414944] hover:bg-[#f6f3f2]'
                }`}
              >
                Bulanan
              </button>
            </div>
          </div>

          {/* Render bar chart diagrams */}
          <div className="flex-grow flex items-end justify-between gap-1.5 sm:gap-6 h-48 border-b border-[#f0edec]/70 pb-4 mb-4 select-none">
            {chartData.map((data, index) => (
              <div key={index} className="w-full flex flex-col items-center group relative">
                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all font-geist text-[9px] bg-[#002d1c] text-[#c0edd3] px-2.5 py-1 rounded shadow pointer-events-none z-10">
                  Rp {(150 + Math.random() * 300).toFixed(0)}rb
                </div>
                <div
                  className={`w-full bg-[#c0edd3]/40 rounded-t-lg transition-all duration-500 hover:opacity-95 ${data.value}`}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-2 text-[10px] text-[#414944] uppercase tracking-wider">
            {chartData.map((data, index) => (
              <span key={index}>{data.day}</span>
            ))}
          </div>
        </div>

        {/* Quick Tools Grid list */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <button
            onClick={onAddNewListing}
            className="bg-white rounded-[24px] p-6 border border-[#f0edec] hover:border-[#002d1c] transition-all flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:shadow active:scale-98 group"
          >
            <PlusCircle size={28} className="text-[#002d1c] group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-[#1c1b1b]">Tambah Listing</span>
          </button>
          
          <button
            onClick={onNavigateToProducts}
            className="bg-white rounded-[24px] p-6 border border-[#f0edec] hover:border-[#002d1c] transition-all flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:shadow active:scale-98 group"
          >
            <ShoppingBag size={28} className="text-[#002d1c] group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-[#1c1b1b]">Kelola Produk</span>
          </button>
          
          <button
            onClick={onNavigateToFinance}
            className="col-span-2 bg-white rounded-[24px] p-6 border border-[#f0edec] hover:border-[#002d1c] transition-all flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:shadow active:scale-98 group cursor-pointer"
          >
            <Wallet size={28} className="text-[#002d1c] group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-[#1c1b1b]">Keuangan</span>
          </button>
        </div>
      </section>

      {/* 4. Active Incoming orders pipelines */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap">
        {/* Incoming pipelines orders list */}
        <div className="lg:col-span-8 bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-lg text-[#002d1c]">Atur Pesanan Toko</h3>
            <span onClick={onNavigateToOrders} className="text-xs text-[#002d1c] hover:underline cursor-pointer">Lihat Semua</span>
          </div>

          <div className="flex flex-col gap-4">
            <div onClick={onNavigateToOrders} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#fcf9f8] rounded-[16px] border border-[#f0edec] text-xs gap-3 cursor-pointer hover:border-[#002d1c]/45 transition-all">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#c1c8c2]/30 flex items-center justify-center text-[#002d1c] flex-shrink-0">
                  <ShoppingBag size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[#1c1b1b]">Order #RL-2938</h4>
                  <p className="text-[10px] text-[#414944] mt-0.5">2 Barang • Rp 450.000 • Kirim via Kurir</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <span className="px-3 py-1 bg-[#ffdad6] text-[#93000a] text-[10px] rounded-full font-bold self-start sm:self-auto">Perlu Dikirim</span>
                <ChevronRight size={14} className="text-[#414944] flex-shrink-0" />
              </div>
            </div>

            <div onClick={onNavigateToOrders} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#fcf9f8] rounded-[16px] border border-[#f0edec] text-xs gap-3 cursor-pointer hover:border-[#002d1c]/45 transition-all">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#c1c8c2]/30 flex items-center justify-center text-[#002d1c] flex-shrink-0">
                  <ShoppingBag size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[#1c1b1b]">Order #RL-2940</h4>
                  <p className="text-[10px] text-[#414944] mt-0.5">1 Barang • Rp 215.000 • QRIS Escrow</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <span className="px-3 py-1 bg-[#d4e5c7] text-[#002d1c] text-[10px] rounded-full font-bold self-start sm:self-auto">Menunggu Pembayaran</span>
                <ChevronRight size={14} className="text-[#414944] flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Popular Listings & Switch mode banner */}
        <div className="lg:col-span-4 bg-[#1a4331] text-white rounded-[24px] p-6 md:p-8 flex flex-col justify-between overflow-hidden relative shadow-sm text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#002d1c] via-[#1a4331] to-[#002d1c] opacity-90"></div>
          <div className="relative z-10 flex flex-col items-center justify-center py-6">
            <span className="material-symbols-outlined text-4xl text-[#c0edd3] mb-4">swap_horiz</span>
            <h3 className="font-display font-extrabold text-lg mb-2">Ingin belanja mode?</h3>
            <p className="font-body text-[#ebe7e7]/80 text-xs mb-8 max-w-[220px]">
              Klik tombol di bawah ini untuk beralih mode dan menjelajahi katalog sirkular terbaik.
            </p>
            <button
              onClick={onSwitchToBuyer}
              className="bg-[#c0edd3] text-[#002114] px-8 py-3 rounded-full text-xs font-bold hover:shadow-lg transition-transform active:scale-95 duration-200"
            >
              Beralih ke Akun Pembeli
            </button>
          </div>
        </div>
      </section>

      {/* 5. Recent reviews */}
      <section className="bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm">
        <h3 className="font-display font-bold text-lg text-[#002d1c] mb-6">Ulasan Pembeli Terbaru</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[#fcf9f8] border border-[#f0edec] rounded-[24px] flex flex-col gap-3 text-xs leading-normal">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a4331] text-white flex items-center justify-center font-bold">
                AP
              </div>
              <div>
                <p className="font-bold text-[#1c1b1b]">Andi Pratama</p>
                <div className="flex text-yellow-500 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} className="fill-current text-yellow-500" />)}
                </div>
              </div>
            </div>
            <p className="text-[#414944] italic">
              "Kualitas jaketnya luar biasa, sesuai deskripsi. Pengiriman sangat cepat dan aman."
            </p>
          </div>

          <div className="p-5 bg-[#fcf9f8] border border-[#f0edec] rounded-[24px] flex flex-col gap-3 text-xs leading-normal">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a4331] text-white flex items-center justify-center font-bold">
                SA
              </div>
              <div>
                <p className="font-bold text-[#1c1b1b]">Siti Aminah</p>
                <div className="flex text-yellow-500 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={10} className={s <= 4 ? "fill-current text-yellow-500" : "text-[#ebe7e7]"} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[#414944] italic">
              "Sepatunya cantik sekali! Sayang boxnya agak penyok sedikit, tapi barangnya aman."
            </p>
          </div>
        </div>
      </section>


    </div>
  );
};
