/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Truck, MessageSquare, ShieldCheck, CheckCircle2, ChevronRight, MapPin, ListCollapse, Play, Send, X, ShieldAlert } from 'lucide-react';
import { Order } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

interface TrackOrderViewProps {
  order: Order;
  onConfirmReceived: () => void;
  onContactSeller?: (sellerName: string, productName: string, productImage: string, initialText: string) => void;
  navigate?: (screen: any) => void;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  order,
  onConfirmReceived,
  onContactSeller,
  navigate,
}) => {
  // Simulate stepper progression
  const [step, setStep] = useState<number>(() => {
    if (order.status === 'Received' || order.status === 'Reviewed') {
      return 2;
    }
    return 1;
  });

  const handleSimulateDelivery = () => {
    setStep(2);
  };

  const breadcrumbItems = [
    { label: 'Beranda', onClick: () => navigate?.('explore') },
    { label: 'Profil Saya', onClick: () => navigate?.('profile') },
    { label: `Lacak Pesanan ${order.id}` }
  ];

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Breadcrumbs Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header element */}
      <div className="flex justify-between items-start md:items-center flex-wrap gap-4 border-b border-[#f0edec] pb-4">
        <div>
          <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">Lacak Pesanan</h1>
          <p className="font-body text-xs text-[#414944] mt-1">
            Nomor Resi: <strong className="text-[#1c1b1b] font-geist select-all">{order.resi}</strong>
          </p>
        </div>
        
        {/* Step Simulator Helper Corner for the sandbox */}
        <div className="bg-[#f0edec] p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 border border-[#c1c8c2]/40 w-full sm:w-auto">
          <div className="text-[10px] font-geist text-[#414944] max-w-full sm:max-w-[200px] leading-tight">
            <strong>Sandbox Helper</strong>: Simulasikan kurir mengantarkan paket Anda ke depan pintu.
          </div>
          <button
            onClick={handleSimulateDelivery}
            disabled={step === 2}
            className={`w-full sm:w-auto flex items-center justify-center gap-1 text-[11px] font-geist font-bold px-3.5 py-2 rounded-full transition-all active:scale-95 ${
              step === 2
                ? 'bg-[#c0edd3] text-[#002d1c] cursor-default'
                : 'bg-[#002d1c] text-white hover:opacity-95'
            }`}
          >
            <Play size={12} className="fill-current" />
            <span>{step === 2 ? 'Paket Sampai' : 'Simulasikan Sampai'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
        {/* Left Column: Carrier details and live horizontal stepper progress */}
        <div className="md:col-span-8 flex flex-col gap-bento-gap">
          
          {/* Sicepat Carrier Card */}
          <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm font-geist">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <p className="text-[10px] text-[#414944] uppercase tracking-wider mb-0.5">Informasi Kurir</p>
                <h2 className="text-xl font-bold text-[#002d1c]">{order.courier}</h2>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10px] text-[#414944] uppercase tracking-wider mb-0.5">Estimasi Tiba</p>
                <h2 className="text-xl font-bold text-[#002d1c]">
                  {step === 2 ? 'Tiba di Lokasi' : '1-2 Hari Jauh'}
                </h2>
              </div>
            </div>

            {/* Simulated Live Horizontal Track Bar */}
            <div className="relative h-2 bg-[#f0edec] rounded-full overflow-hidden mt-6 mb-3">
              <div
                className="absolute top-0 left-0 h-full bg-[#1a4331] rounded-full transition-all duration-700"
                style={{ width: step === 2 ? '100%' : '75%' }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-[#414944] font-medium px-1">
              <span>Dikemas</span>
              <span className={step === 1 ? "text-[#002d1c] font-bold" : ""}>Dalam Perjalanan</span>
              <span className={step === 2 ? "text-[#002d1c] font-bold" : ""}>Diterima</span>
            </div>
          </div>

          {/* Detailed Timeline Steps Inclosure */}
          <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm">
            <h3 className="font-display text-lg font-bold text-[#002d1c] mb-8 flex items-center gap-2">
              <MapPin size={20} className="text-[#002d1c]" />
              <span>Riwayat Perjalanan</span>
            </h3>

            {/* Interactive elements timeline chain */}
            <div className="relative pl-12 space-y-8 font-geist">
              {/* Central vertical connecting line bar */}
              <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-[#f0edec]"></div>
              <div className={`relative flex gap-4 transition-all duration-500 ${step === 1 ? 'opacity-40' : 'opacity-100'}`}>
                {/* Visual Circle check center point */}
                <div className={`absolute -left-[42px] w-9 h-9 rounded-full flex items-center justify-center border-2 z-10 transition-colors bg-white ${
                  step === 2 ? 'border-[#002d1c] text-[#002d1c]' : 'border-[#c1c8c2] text-[#414944]'
                }`}>
                  <CheckCircle2 size={16} className={step === 2 ? "fill-[#c0edd3] text-[#002d1c]" : ""} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                    <h4 className="text-sm font-bold text-[#1c1b1b]">Paket Telah Tiba & Diterima</h4>
                    {step === 2 && <span className="text-[10px] text-[#002d1c] bg-[#c0edd3] px-2 py-0.5 rounded-full font-bold self-start sm:self-auto">Baru Saja</span>}
                  </div>
                  <p className="text-xs text-[#414944] leading-relaxed">
                    Paket diterima oleh [Budi Santoso] di lobi Apartemen Senayan City. Silakan konfirmasi untuk melepaskan dana ke penjual.
                  </p>
                </div>
              </div>

              {/* Step: Pesanan Sedang Dikirim ke Lokasi Anda */}
              <div className={`relative flex gap-4 transition-all duration-500 ${step === 1 ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`absolute -left-[42px] w-9 h-9 rounded-full flex items-center justify-center border-2 z-10 bg-white ${
                  step === 1 ? 'border-[#002d1c] bg-[#1a4331]/5 text-[#002d1c] animate-pulse' : 'border-[#002d1c] text-[#002d1c]'
                }`}>
                  <Truck size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                    <h4 className="text-sm font-bold text-[#1c1b1b]">Pesanan Sedang Dikirim ke Lokasi</h4>
                    <span className="text-[9px] text-[#414944] bg-[#f0edec] px-2 py-0.5 rounded self-start sm:self-auto">Hari ini, 09:42</span>
                  </div>
                  <p className="text-xs text-[#414944] leading-relaxed">
                    Kurir membawa paket [Sicepat] sedang mengarah ke titik alamat pengantaran Anda.
                  </p>
                </div>
              </div>

              {/* Step: Pesanan Diserahkan ke Kurir */}
              <div className="relative flex gap-4 opacity-75">
                <div className="absolute -left-[42px] w-9 h-9 rounded-full bg-white border border-[#002d1c] text-[#002d1c] flex items-center justify-center z-10">
                  <CheckCircle2 size={16} className="fill-[#c0edd3] text-[#002d1c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                    <h4 className="text-sm font-bold text-[#1c1b1b]">Paket Diserahkan ke Kurir</h4>
                    <span className="text-[9px] text-[#414944]/70 self-start sm:self-auto">Kemarin, 16:30</span>
                  </div>
                  <p className="text-xs text-[#414944] leading-relaxed">
                    Pesanan telah disortir dan diserahkan ke agen Sicepat hub wilayah Jakarta Pusat.
                  </p>
                </div>
              </div>

              {/* Step: Penjual Menyiapkan Pesanan */}
              <div className="relative flex gap-4 opacity-75 font-geist">
                <div className="absolute -left-[42px] w-9 h-9 rounded-full bg-white border border-[#002d1c] text-[#002d1c] flex items-center justify-center z-10">
                  <CheckCircle2 size={16} className="fill-[#c0edd3] text-[#002d1c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                    <h4 className="text-sm font-bold text-[#1c1b1b]">Penjual Menyiapkan Pesanan</h4>
                    <span className="text-[9px] text-[#414944]/70 self-start sm:self-auto">24 Jun, 10:15</span>
                  </div>
                  <p className="text-xs text-[#414944]">
                    Penjual selesai memproses verifikasi fisik dan telah membungkus paket dengan rapi.
                  </p>
                </div>
              </div>

              {/* Step: Pesanan Dibayar */}
              <div className="relative flex gap-4 opacity-75">
                <div className="absolute -left-[42px] w-9 h-9 rounded-full bg-white border border-[#002d1c] text-[#002d1c] flex items-center justify-center z-10">
                  <CheckCircle2 size={16} className="fill-[#c0edd3] text-[#002d1c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                    <h4 className="text-sm font-bold text-[#1c1b1b]">Pesanan Dibayar & Terverifikasi</h4>
                    <span className="text-[9px] text-[#414944]/70 self-start sm:self-auto">24 Jun, 09:00</span>
                  </div>
                  <p className="text-xs text-[#414944]">
                    Pembayaran via QRIS terverifikasi otomatis oleh payment gateway RE-LOVE.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order summary calculations and Confirm Received Action */}
        <div className="md:col-span-4 flex flex-col gap-bento-gap font-geist">
          {/* Order Summary box */}
          <section className="bg-white rounded-[24px] p-6 border border-[#f0edec] shadow-sm flex flex-col gap-5">
            <h4 className="text-[10px] text-[#414944] uppercase tracking-wider font-bold">Ringkasan Pesanan</h4>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#f0edec] overflow-hidden flex-shrink-0 border border-black/5">
                <img alt={order.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" src={order.image} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1c1b1b] line-clamp-1">{order.productName}</h5>
                <p className="text-[10px] text-[#414944] mt-0.5">Penjual: {order.sellerName}</p>
                <p className="text-xs text-[#002d1c] font-black mt-2">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-[#f0edec]">
              <button
                onClick={onConfirmReceived}
                disabled={step === 1 || order.status === 'Received' || order.status === 'Reviewed'}
                className={`w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  (step === 1 || order.status === 'Received' || order.status === 'Reviewed')
                    ? 'bg-[#ebe7e7] text-[#414944]/55 cursor-not-allowed'
                    : 'bg-[#002d1c] text-white hover:opacity-95 active:scale-95 shadow-md shadow-[#002d1c]/10 cursor-pointer'
                }`}
              >
                {order.status === 'Reviewed' 
                  ? 'Pesanan Selesai' 
                  : order.status === 'Received'
                  ? 'Sudah Diterima'
                  : 'Konfirmasi Diterima'
                }
              </button>
              
              <button
                onClick={() => {
                  if (onContactSeller) {
                    const initialText = `Halo! Terima kasih telah membeli "${order.productName}" di toko kami. Paket Anda sedang diproses oleh kurir dengan nomor resi ${order.resi}. Apakah ada hal lain terkait produk preloved ini yang bisa saya bantu? 🌿`;
                    onContactSeller(order.sellerName, order.productName, order.image, initialText);
                  }
                }}
                className="w-full py-3 px-6 rounded-full border border-[#002d1c] bg-[#1a4331]/5 text-[#002d1c] text-xs font-bold hover:bg-[#1a4331]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>Hubungi Penjual</span>
              </button>
            </div>
            
            {step === 1 && (
              <p className="text-[9px] text-[#414944]/70 text-center leading-normal">
                Tombol Konfirmasi Diterima akan menyala otomatis segera setelah barang terkirim ke alamat Anda.
              </p>
            )}
          </section>

          {/* Secure Protection badge */}
          <div className="bg-[#1a4331] text-white rounded-[24px] p-6 border-b border-[#002d1c] shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#002d1c] opacity-25 rounded-full blur-xl"></div>
            <div className="relative z-10 flex gap-3.5 items-start">
              <ShieldCheck size={20} className="text-[#c0edd3] flex-shrink-0" />
              <div>
                <h4 className="font-black text-xs text-[#c0edd3]">Dana Aman Terproteksi</h4>
                <p className="text-[10px] text-[#ebe7e7]/85 leading-relaxed mt-1">
                  Sistem proteksi RE-LOVE mengamankan total tagihan Rp {order.totalAmount.toLocaleString('id-ID')} dengan aman. Dana tidak akan dilepaskan sebelum Anda setuju kondisi barang sesuai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
