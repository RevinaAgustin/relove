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
  onContactSeller?: () => void;
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

  // Chat panel states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'seller', text: string, time: string }>>([
    {
      sender: 'seller',
      text: `Halo! Terima kasih telah membeli "${order.productName}" di toko kami. Paket Anda sedang diproses oleh kurir dengan nomor resi ${order.resi}. Apakah ada hal lain terkait produk sirkular preloved ini yang bisa saya bantu? 🌿`,
      time: '12:00'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isTyping, isChatOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Add user message
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: timeNow }]);
    setInputText('');
    setIsTyping(true);

    // Simulate smart seller reply after 1.5s
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      const lowercaseMsg = userMsg.toLowerCase();

      if (lowercaseMsg.includes('resi') || lowercaseMsg.includes('kirim') || lowercaseMsg.includes('kurir')) {
        replyText = `Resi sudah terdaftar ya kak (${order.resi}) menggunakan kurir ${order.courier}. Paket sudah diserahkan kemarin dan saat ini sedang dalam perjalanan menuju kota tujuan.`;
      } else if (lowercaseMsg.includes('kondisi') || lowercaseMsg.includes('minus') || lowercaseMsg.includes('cacat') || lowercaseMsg.includes('ori')) {
        replyText = `Kondisi dijamin mantap kak, sesuai dengan foto & deskripsi. Sudah tim kurasi RE-LOVE verifikasi secara fisik untuk keaslian serta kualitas kebersihannya. Kakak tinggal pakai saat sampai!`;
      } else if (lowercaseMsg.includes('makasih') || lowercaseMsg.includes('terima kasih') || lowercaseMsg.includes('oke') || lowercaseMsg.includes('siap')) {
        replyText = `Sama-sama kak! Senang melayani Anda. Terima kasih juga telah memilih gaya hidup sirkular untuk masa depan bumi yang lebih hijau. Sehat selalu! 💚`;
      } else {
        replyText = `Pertanyaan bagus kak. Pesanan Anda kami packing tebal dengan bubble wrap & polymailer ramah lingkungan. Kami bantu pantau perjalanannya juga ya kak, semoga cepat dan aman sampai ke tangan kakak!`;
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'seller', text: replyText, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1500);
  };

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
                onClick={() => setIsChatOpen(true)}
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
                  Sistem proteksi RE-LOVE mengamankan total tagihan Rp {order.totalAmount.toLocaleString('id-ID')} dengan aman. Dana tidak akan dilepaskan sebelum Anda setuju kondisi sirkular sesuai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Chat Modal Overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-100 p-4 font-geist">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] h-[540px] flex flex-col shadow-2xl border border-[#f0edec] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#002d1c] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <span className="font-bold text-xs text-[#c0edd3]">UA</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{order.sellerName}</span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" title="Online"></span>
                  </h4>
                  <p className="text-[10px] text-[#c0edd3]/80">Respon cepat • Penjual Terverifikasi</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-[#c0edd3] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Context Product Bar */}
            <div className="bg-[#fcf9f8] px-5 py-3 border-b border-[#f0edec] flex items-center gap-3">
              <img src={order.image} alt={order.productName} className="w-10 h-12 rounded object-cover border border-[#ebe7e7]" />
              <div className="flex-1 min-w-0">
                <h5 className="text-[11px] font-bold text-[#1c1b1b] truncate">{order.productName}</h5>
                <p className="text-[10px] text-[#414944] mt-0.5">Lacak Pesanan • No. Resi {order.resi}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-[#002d1c]">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
              <div className="flex justify-center mb-2">
                <span className="text-[9px] font-bold bg-[#ebe7e7] text-[#414944] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={10} className="text-[#3e6752]" />
                  <span>Obrolan Terenkripsi & Terpantau</span>
                </span>
              </div>

              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-[20px] px-4 py-3 text-xs ${
                    msg.sender === 'user' 
                      ? 'bg-[#002d1c] text-white rounded-br-none' 
                      : 'bg-white text-[#1c1b1b] border border-black/5 shadow-xs rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[9px] block text-right mt-1.5 ${msg.sender === 'user' ? 'text-white/60' : 'text-[#414944]/70'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-[#414944] border border-black/5 shadow-xs rounded-[20px] rounded-bl-none px-4 py-3 text-xs flex items-center gap-1.5">
                    <span className="text-[10px] italic">Penjual sedang mengetik</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#f0edec] bg-white flex gap-2">
              <input 
                type="text"
                placeholder="Tulis pesan ke penjual..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-[#fcf9f8] px-4 py-2.5 rounded-full border border-[#c1c8c2]/50 text-xs focus:outline-none focus:border-[#002d1c] font-medium text-[#1c1b1b]"
              />
              <button 
                type="submit"
                className="bg-[#002d1c] text-white p-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send size={14} className="translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
