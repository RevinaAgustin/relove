/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

interface PaymentViewProps {
  totalAmount: number;
  onVerifyPayment: () => void;
  onGoBack: () => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
  totalAmount,
  onVerifyPayment,
  onGoBack,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(24 * 60 * 60);
  const [isVerifying, setIsVerifying] = useState(false);

  // Countdown timer logic using absolute timestamp stored in localStorage
  useEffect(() => {
    const savedExpiration = localStorage.getItem('re_love_qris_expiration_time');
    let expirationTime: number;

    if (savedExpiration) {
      expirationTime = parseInt(savedExpiration, 10);
      // Reset if expired for a long time or invalid to ensure sandboxed test is always valid
      if (Date.now() > expirationTime) {
        expirationTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('re_love_qris_expiration_time', expirationTime.toString());
      }
    } else {
      expirationTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('re_love_qris_expiration_time', expirationTime.toString());
    }

    const calculateTimeLeft = () => {
      const remaining = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    calculateTimeLeft();

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Expired';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate short loader
    setTimeout(() => {
      setIsVerifying(false);
      onVerifyPayment();
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 py-4 max-w-[640px] mx-auto w-full">
      {/* Header Back Button */}
      <header className="flex items-center justify-between w-full pb-4 border-b border-[#f0edec]">
        <button
          onClick={onGoBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f0edec] hover:bg-[#ebe7e7] transition-colors"
        >
          <ArrowLeft size={18} className="text-[#1c1b1b]" />
        </button>
        <h1 className="text-lg font-display font-medium text-[#1c1b1b]">Pembayaran QRIS</h1>
        <div className="w-10"></div>
      </header>

      {/* QRIS payment content */}
      <section className="bg-white rounded-[24px] shadow-lg p-8 flex flex-col items-center text-center border border-[#f0edec] relative overflow-hidden">
        {/* Dynamic decorative blob back */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c0edd3]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 bg-[#f0edec] px-4 py-2 rounded-full mb-6 relative z-10 font-geist text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3e6752] animate-pulse"></span>
          <span className="text-[#414944]">Menunggu Pembayaran</span>
          <span className="text-[#002d1c] font-black ml-2 flex items-center gap-1">
            <Clock size={12} />
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Amount */}
        <div className="mb-6 relative z-10 font-geist">
          <p className="text-[#414944] text-xs font-semibold uppercase tracking-wider mb-1">Total Kewajiban</p>
          <p className="text-4xl font-display font-extrabold text-[#002d1c]">
            Rp {totalAmount.toLocaleString('id-ID')}
          </p>
        </div>

        {/* QR Schematic Area Box */}
        <div className="bg-[#f0edec] p-6 rounded-[24px] mb-8 relative z-10 w-full max-w-[280px] aspect-square flex items-center justify-center border border-[#c1c8c2]">
          <div className="relative w-full h-full bg-white p-3 rounded-xl flex items-center justify-center shadow-inner">
            {/* Embedded aesthetic vector QR code */}
            <svg fill="none" height="180" viewBox="0 0 200 200" width="180" xmlns="http://www.w3.org/2000/svg" className="mix-blend-multiply opacity-90">
              <path
                clipRule="evenodd"
                d="M0 0H60V60H0V0ZM20 20H40V40H20V20ZM140 0H200V60H140V0ZM160 20H180V40H160V20ZM0 140H60V200H0V140ZM20 160H40V180H20V160ZM80 0H120V20H80V0ZM80 40H120V60H80V40ZM120 80H140V100H120V80ZM160 80H200V100H160V80ZM80 120H100V140H80V120ZM120 120H160V140H120V120ZM160 120H180V140H160V120ZM180 140H200V160H180V140ZM140 160H160V200H140V160ZM180 180H200V200H180V180ZM80 160H120V180H80V160ZM80 180H100V200H80V180ZM40 80H60V100H40V80ZM0 80H20V100H0V80ZM20 100H40V120H20V100ZM60 100H80V120H60V100Z"
                fill="#002d1c"
                fillRule="evenodd"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow border border-black/5">
              <span className="font-display font-black text-[#002d1c] text-[10px]">QRIS</span>
            </div>
          </div>
        </div>

        <p className="font-body text-xs text-[#414944] max-w-xs leading-relaxed relative z-10">
          Gunakan m-banking (BCA, Mandiri, dll) atau e-wallet (Gopay, OVO, ShopeePay) anda, kemudian pindai kode QRIS di atas untuk proses instan.
        </p>
      </section>

      {/* Safe transaction protection details */}
      <section className="bg-[#1a4331] text-[#ebe7e7] rounded-[24px] p-6 shadow-md relative overflow-hidden font-geist">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3e6752]/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-12 h-12 bg-[#002d1c] flex items-center justify-center rounded-full border border-[#3e6752]">
            <ShieldCheck className="text-[#c0edd3] fill-transparent" />
          </div>
          <div>
            <h2 className="text-[#c0edd3] font-bold text-sm">Transaksi RE-LOVE Aman & Transparan</h2>
            <p className="text-[10px] text-[#ebe7e7]/70 uppercase tracking-widest font-black">Secure Platform Protection</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed max-w-sm mb-6 relative z-10 text-[#ebe7e7]/90">
          Kenyamanan Anda adalah prioritas. Transaksi preloved dimonitor sistem, dana baru dicairkan ke penjual setelah barang diterima.
        </p>

        {/* Step-by-step progress checklist layout */}
        <div className="relative w-full z-10 mt-2 font-geist">
          {/* Horizontal stepper connecting line background */}
          <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-[#3e6752]/50 pointer-events-none"></div>
          
          <div className="grid grid-cols-5 gap-1 text-center text-[9px] relative z-10">
            <div className="flex flex-col items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#3e6752] text-[#c0edd3] flex items-center justify-center font-bold relative z-20 border border-[#3e6752]/30">1</span>
              <span className="text-[#ebe7e7] font-semibold">Pembayaran</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#3e6752] text-[#c0edd3] flex items-center justify-center font-bold relative z-20 border border-[#3e6752]/30">2</span>
              <span className="text-[#ebe7e7] font-semibold">Dana Terproteksi</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#3e6752] text-[#c0edd3] flex items-center justify-center font-bold relative z-20 border border-[#3e6752]/30">3</span>
              <span className="text-[#ebe7e7] font-semibold">Verifikasi Fisik</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#3e6752] text-[#c0edd3] flex items-center justify-center font-bold relative z-20 border border-[#3e6752]/30">4</span>
              <span className="text-[#ebe7e7] font-semibold">Kirim Paket</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#3e6752] text-[#c0edd3] flex items-center justify-center font-bold relative z-20 border border-[#3e6752]/30">5</span>
              <span className="text-[#ebe7e7] font-semibold">Pelepasan Dana</span>
            </div>
          </div>
        </div>
      </section>

      {/* Verify manual trigger */}
      <button
        onClick={handleVerify}
        disabled={isVerifying}
        className="w-full h-16 bg-[#1a4331] text-white hover:bg-[#3e6752] transition-all rounded-full flex items-center justify-center gap-2 shadow-md active:scale-98"
      >
        <span className="font-geist text-xs font-black uppercase tracking-wider">
          {isVerifying ? 'Sedang Memverifikasi...' : 'Cek Status Pembayaran Rekening'}
        </span>
        <RefreshCw size={16} className={isVerifying ? 'animate-spin' : ''} />
      </button>
    </div>
  );
};
