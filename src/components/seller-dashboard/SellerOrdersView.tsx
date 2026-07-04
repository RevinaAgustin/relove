/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Check, X, Package, AlertCircle, CheckCircle2, ArrowRight, MapPin, Download } from 'lucide-react';
import { Order } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';
import branchesData from '../../../branches.json';

interface SellerOrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], resi?: string) => void;
  onRejectOrder: (orderId: string) => void;
  onGoBack: () => void;
  userProfile?: { name: string; shopName: string; email: string; phone: string; avatar: string };
}

interface Outlet {
  id: string;
  name: string;
  partner: string;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  operatingHours?: string;
}

const branchesList: Outlet[] = ((branchesData as any).branches || []).map((b: any) => ({
  id: b.id,
  name: b.name,
  partner: b.courier || b.partner || 'Mitra',
  lat: b.lat,
  lon: b.lon,
  address: b.address,
  phone: b.phone,
  operatingHours: b.operatingHours
}));

const COURIER_OUTLETS: Record<string, Outlet[]> = {
  sicepat: branchesList.filter(b => b.partner.toLowerCase().includes('sicepat')),
  jne: branchesList.filter(b => b.partner.toLowerCase().includes('jne')),
  'j&t': branchesList.filter(b => b.partner.toLowerCase().includes('j&t')),
  default: [
    { id: 're-love-kb', name: 'RE-LOVE Hub Kebayoran', partner: 'RE-LOVE', lat: -6.2448, lon: 106.7973, address: 'Jl. Kebayoran Baru, Jakarta Selatan', operatingHours: '09:00 - 17:00' },
    { id: 're-love-cbd', name: 'RE-LOVE Hub CBD', partner: 'RE-LOVE', lat: -6.2230, lon: 106.8240, address: 'Jl. Kuningan, Jakarta Selatan', operatingHours: '09:00 - 17:00' },
  ],
};

// Helper to compute map positions from latitude and longitude
const getMapCoords = (lat: number, lon: number) => {
  // Approximate bounds for South Jakarta / Kebayoran Baru area covered by the mock map
  const minLat = -6.30;
  const maxLat = -6.21;
  const minLon = 106.77;
  const maxLon = 106.83;
  
  // Calculate percentage positions
  // Lat: higher negative value (-6.30) is South (bottom), lower negative value (-6.21) is North (top)
  // Lon: lower value (106.77) is West (left), higher value (106.83) is East (right)
  const top = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10; // offset slightly to keep inside bounds
  const left = ((lon - minLon) / (maxLon - minLon)) * 80 + 10;
  
  return { top: `${top}%`, left: `${left}%` };
};

export const SellerOrdersView: React.FC<SellerOrdersViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onRejectOrder,
  onGoBack,
  userProfile,
}) => {
  const sellerName = userProfile?.shopName || 'UrbanArchive Vintage';
  const sellerOrders = orders.filter(o => o.id.startsWith('ord-seller-'));

  // Tabs split strictly by category (NO "All" tab as requested: "hapus halaman semuaa, aku pengen itu di pisah2 ajaa per kategori")
  const [activeTab, setActiveTab] = useState<'waiting' | 'paid' | 'shipped' | 'completed'>('waiting');
  
  // Selection state
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // Order tracking states mapped by order ID to prevent cross-contamination and lock choice
  const [orderOutlets, setOrderOutlets] = useState<Record<string, Outlet>>({});
  const [orderResis, setOrderResis] = useState<Record<string, string>>({});
  const [orderPdfDownloaded, setOrderPdfDownloaded] = useState<Record<string, boolean>>({});



  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'waiting':
        return sellerOrders.filter(o => o.status === 'Waiting');
      case 'paid':
        return sellerOrders.filter(o => o.status === 'Paid');
      case 'shipped':
        return sellerOrders.filter(o => o.status === 'Shipped' || o.status === 'Courier');
      case 'completed':
        return sellerOrders.filter(o => o.status === 'Received' || o.status === 'Reviewed');
    }
  };

  const getTabCount = (tab: typeof activeTab) => {
    switch (tab) {
      case 'waiting':
        return sellerOrders.filter(o => o.status === 'Waiting').length;
      case 'paid':
        return sellerOrders.filter(o => o.status === 'Paid').length;
      case 'shipped':
        return sellerOrders.filter(o => o.status === 'Shipped' || o.status === 'Courier').length;
      case 'completed':
        return sellerOrders.filter(o => o.status === 'Received' || o.status === 'Reviewed').length;
    }
  };

  const filtered = getFilteredOrders();
  const activeOrder = filtered.find(o => o.id === selectedOrderId) || filtered[0];

  const activeOutlet = activeOrder ? orderOutlets[activeOrder.id] : undefined;
  const activeResi = activeOrder ? orderResis[activeOrder.id] : undefined;
  const activePdfDownloaded = activeOrder ? !!orderPdfDownloaded[activeOrder.id] : false;
  const activeArrangeStep = activeOutlet ? 'download-pdf' : 'select-outlet';

  const courierKey = activeOrder?.courier.toLowerCase() ?? '';
  const selectedCourier = courierKey.includes('sicepat')
    ? 'sicepat'
    : courierKey.includes('jne')
    ? 'jne'
    : courierKey.includes('j&t')
    ? 'j&t'
    : 'default';
  const availableOutlets = activeOrder ? COURIER_OUTLETS[selectedCourier] : COURIER_OUTLETS.default;

  const handleConfirmOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'Paid');
    alert('Pesanan berhasil dikonfirmasi! Silakan lanjutkan untuk Mengatur Pengiriman Gerai.');
  };

  const handleRejectClick = (orderId: string) => {
    const reason = window.prompt('Harap masukkan alasan penolakan pesanan (dana pembeli akan otomatis direfund):', 'Stok barang rusak/hilang');
    if (reason !== null) {
      onRejectOrder(orderId);
      alert('Pesanan ditolak. Dana telah direfund.');
    }
  };

  const handleSelectOutlet = (outlet: Outlet) => {
    if (!activeOrder) return;
    const orderId = activeOrder.id;
    const randNo = `RL-${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    setOrderOutlets(prev => ({ ...prev, [orderId]: outlet }));
    setOrderResis(prev => ({ ...prev, [orderId]: randNo }));
    setOrderPdfDownloaded(prev => ({ ...prev, [orderId]: false }));
    
    alert(`Gerai ${outlet.name} terpilih! Nomor antrian pengiriman/resi (${randNo}) telah diterbitkan oleh gerai ini.`);
  };

  const handleDownloadPDF = (order: Order) => {
    setOrderPdfDownloaded(prev => ({ ...prev, [order.id]: true }));
    // Simulate PDF file download trigger
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `RELOVE-LABEL-${order.id}.pdf`);
    
    // Alert the user of successful download
    alert(`File label_pengiriman_RL-${order.id}.pdf berhasil diunduh ke folder Downloads Anda! Silakan cetak label ini untuk diserahkan ke petugas gerai.`);
  };

  const handleConfirmDropoff = (orderId: string) => {
    const resi = orderResis[orderId];
    if (!orderPdfDownloaded[orderId]) {
      alert('Anda harus mengunduh PDF Resi terlebih dahulu sebelum melakukan penyerahan barang!');
      return;
    }
    // Update order status to Shipped with the generated tracking number
    onUpdateOrderStatus(orderId, 'Shipped', resi);
    alert(`Sukses! Pesanan dipindahkan ke tab "Dikirim". Nomor Pelacakan aktif: ${resi}.`);
    setActiveTab('shipped');
    setSelectedOrderId(orderId);
  };

  const breadcrumbItems = [
    { label: 'Dashboard Penjual', onClick: onGoBack },
    { label: 'Atur Pesanan Toko' }
  ];

  return (
    <div className="flex flex-col gap-6 py-4 max-w-[1000px] mx-auto w-full font-geist text-left">
      {/* Navigation Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#f0edec] pb-4">
        <button
          onClick={onGoBack}
          className="p-2 hover:bg-[#f0edec] rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} className="text-[#002d1c]" />
        </button>
        <div>
          <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">Atur Pesanan Toko</h1>
          <p className="text-xs text-[#414944] mt-0.5">Kelola pesanan masuk, pilih gerai kurir, dan unduh label cetak PDF.</p>
        </div>
      </div>

      {/* Tabs Row (Strictly divided by Category, NO "All" tab) */}
      <div className="flex gap-2 border-b border-[#f0edec] pb-px overflow-x-auto select-none scrollbar-none">
        {(['waiting', 'paid', 'shipped', 'completed'] as const).map((tab) => {
          let label = 'Pesanan Baru';
          if (tab === 'paid') label = 'Perlu Kirim';
          else if (tab === 'shipped') label = 'Dikirim';
          else if (tab === 'completed') label = 'Selesai';

          const count = getTabCount(tab);
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedOrderId('');
              }}
              className={`px-4 py-3 text-xs font-black uppercase tracking-wider relative transition-all border-b-2 cursor-pointer ${
                isActive 
                  ? 'border-[#002d1c] text-[#002d1c]' 
                  : 'border-transparent text-[#414944] hover:text-[#002d1c]'
              }`}
            >
              <span>{label}</span>
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[9px] ${isActive ? 'bg-[#002d1c] text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#f0edec] p-12 text-center flex flex-col items-center gap-4">
          <Package size={48} className="text-[#414944]/40" />
          <div>
            <h3 className="font-display font-bold text-base text-[#1c1b1b]">Belum ada pesanan</h3>
            <p className="text-xs text-[#414944] mt-1 max-w-[280px] leading-relaxed">
              Pesanan pada kategori ini kosong.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Orders list (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {filtered.map((order) => {
              const isSelected = order.id === activeOrder.id;
              const isWaiting = order.status === 'Waiting';
              const isPaid = order.status === 'Paid';
              const isShipped = order.status === 'Shipped' || order.status === 'Courier';
              const isCompleted = order.status === 'Received' || order.status === 'Reviewed';

              return (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrderId(order.id);
                  }}
                  className={`p-4 rounded-[20px] border transition-all cursor-pointer text-left flex flex-col gap-3 relative overflow-hidden ${
                    isSelected 
                      ? 'border-[#002d1c] bg-[#1a4331]/5 shadow-sm' 
                      : 'border-[#f0edec] bg-white hover:border-[#002d1c]/40'
                  }`}
                >
                  <div className="flex justify-between items-start min-w-0">
                    <span className="text-[9px] font-bold text-[#414944]/80 tracking-wider font-mono">
                      #{order.id.toUpperCase()}
                    </span>
                    
                    {/* Tiny Status Dot Badge */}
                    {isWaiting && (
                      <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Baru
                      </span>
                    )}
                    {isPaid && (
                      <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Atur Kirim
                      </span>
                    )}
                    {isShipped && (
                      <span className="bg-blue-100 text-blue-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Dikirim
                      </span>
                    )}
                    {isCompleted && (
                      <span className="bg-neutral-100 text-neutral-600 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Selesai
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-black/5 overflow-hidden flex-shrink-0">
                      <img src={order.image} alt={order.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h4 className="font-extrabold text-[12px] text-[#1c1b1b] line-clamp-1">{order.productName}</h4>
                      <p className="text-[10px] text-[#414944] mt-0.5 font-bold">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[9px] text-[#414944]/70 border-t border-[#f0edec]/40 pt-2 font-medium">
                    <span>Kurir: {order.courier}</span>
                    <span>{order.date}</span>
                  </div>

                  {isSelected && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#002d1c]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Interactive State Processing steps (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-[24px] border border-[#f0edec] p-6 shadow-sm space-y-5 text-left">
              {/* Product and buyer summaries */}
              <div className="flex justify-between items-start gap-4 border-b border-[#f0edec] pb-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#002d1c]">{activeOrder.productName}</h3>
                  <p className="text-[10px] text-[#414944] mt-1">
                    Pemesan: <strong>Budi Santoso</strong> • Kebayoran Baru, Jakarta Selatan
                  </p>
                  <p className="text-[9px] text-[#414944]/80 mt-0.5">
                    Metode Pembayaran: QRIS
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#414944] block">Hasil Bersih</span>
                  <span className="font-display font-black text-[#002d1c] text-sm">
                    Rp {activeOrder.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* STAGE 1: PESANAN BARU (Waiting) */}
              {activeOrder.status === 'Waiting' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 text-xs text-[#8a5710] bg-[#fdfaf2] border border-[#f3ebcd] rounded-xl p-3.5">
                    <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Konfirmasi Pesanan</p>
                      <p className="opacity-90 mt-0.5">
                        Harap periksa kondisi pakaian terlebih dahulu sebelum menerima pesanan ini. Menolak pesanan akan merefund dana secara instan ke pembeli.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => handleConfirmOrder(activeOrder.id)}
                      className="w-full bg-[#002d1c] text-white hover:opacity-95 text-xs py-3.5 rounded-[14px] font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check size={14} />
                      <span>Konfirmasi & Atur Pesanan</span>
                    </button>
                    <button
                      onClick={() => handleRejectClick(activeOrder.id)}
                      className="w-full border border-red-200 hover:bg-red-50 text-red-600 text-xs py-3 rounded-[12px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <X size={12} />
                      <span>Tolak Pesanan</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: PERLU DIKIRIM (Paid) - STEP BY STEP ATUR PESANAN */}
              {activeOrder.status === 'Paid' && (
                <div className="space-y-5">
                  {/* Step Indicators */}
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#414944] border-b border-[#f0edec] pb-3 select-none">
                    <span className={`flex items-center gap-1.5 ${activeArrangeStep === 'select-outlet' ? 'text-[#002d1c]' : 'text-neutral-300'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${activeArrangeStep === 'select-outlet' ? 'bg-[#002d1c] text-white' : 'bg-neutral-100 text-neutral-400'}`}>1</span>
                      Pilih Gerai Terdekat
                    </span>
                    <span className={`flex items-center gap-1.5 ${activeArrangeStep === 'download-pdf' ? 'text-[#002d1c]' : 'text-neutral-300'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${activeArrangeStep === 'download-pdf' ? 'bg-[#002d1c] text-white' : 'bg-neutral-100 text-neutral-400'}`}>2</span>
                      Cetak Label & Drop-off
                    </span>
                  </div>

                  {/* STEP 1: SELECT OUTLET */}
                  {activeArrangeStep === 'select-outlet' && (
                    <div className="space-y-4">
                      <div className="text-[11px] text-[#414944] leading-relaxed">
                        <strong className="text-[#002d1c]">Pilih Gerai Pengiriman Terdekat untuk paket Anda:</strong>
                        <p className="mt-0.5 text-neutral-500">Pilih salah satu gerai yang tersedia di bawah untuk melanjutkan proses unduh label dan drop-off paket.</p>
                      </div>

                      {/* Map Container SVG Simulation */}
                      <div className="relative w-full h-48 bg-[#f5f2f0] border border-[#e5dfdb] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                        {/* Simulated Map Grid Roads */}
                        <svg className="absolute inset-0 w-full h-full text-neutral-300 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="0" y1="50" x2="350" y2="50" stroke="currentColor" strokeWidth="6" />
                          <line x1="120" y1="0" x2="120" y2="200" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                          <line x1="280" y1="0" x2="280" y2="200" stroke="currentColor" strokeWidth="6" />
                          <line x1="0" y1="120" x2="350" y2="120" stroke="currentColor" strokeWidth="10" />
                          {/* Green spaces */}
                          <rect x="10" y="65" width="95" height="40" fill="#edf5f1" rx="4" />
                          <rect x="135" y="10" width="130" height="95" fill="#edf5f1" rx="4" />
                        </svg>

                        {/* Outer Pins mapping */}
                        {availableOutlets.map((outlet) => {
                          const coords = getMapCoords(outlet.lat, outlet.lon);
                          return (
                            <button
                              key={outlet.id}
                              type="button"
                              onClick={() => handleSelectOutlet(outlet)}
                              className="absolute p-2.5 rounded-full bg-white border border-[#f0edec] hover:border-[#002d1c] hover:scale-110 shadow-md transition-all cursor-pointer group z-10"
                              style={{ top: coords.top, left: coords.left }}
                            >
                              <MapPin size={16} className="text-[#002d1c] fill-[#002d1c]/15 group-hover:text-emerald-700" />
                              
                              {/* Custom Premium Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white border border-[#f0edec] p-2.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-left space-y-1">
                                <p className="font-bold text-[#1c1b1b] text-[10px] leading-tight">{outlet.name}</p>
                                <p className="text-[8px] text-neutral-500 font-semibold font-geist">Mitra {outlet.partner}</p>
                                {outlet.operatingHours && (
                                  <p className="text-[8px] text-[#002d1c] font-medium bg-[#edf5f1] px-1.5 py-0.5 rounded-sm inline-block">
                                    {outlet.operatingHours}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}

                        <div className="absolute bottom-2 left-2 bg-white/90 border px-2 py-0.5 rounded text-[8px] font-bold text-[#414944] shadow-xs">
                          Peta Lokasi Mitra - Kebayoran Baru
                        </div>
                      </div>

                      {/* Outlet list items */}
                      <div className="flex flex-col gap-2">
                        {availableOutlets.map((outlet) => (
                          <div
                            key={outlet.id}
                            onClick={() => handleSelectOutlet(outlet)}
                            className="flex items-center justify-between p-3 border border-[#f0edec] rounded-xl hover:border-[#002d1c] bg-[#fcf9f8] cursor-pointer transition-all text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-[#002d1c]" />
                              <div>
                                <p className="font-bold text-[#1c1b1b]">{outlet.name}</p>
                                <p className="text-[9px] text-[#414944]">Mitra {outlet.partner}</p>
                                {outlet.address && <p className="text-[9px] text-[#414944]/80 mt-0.5">{outlet.address}</p>}
                                {outlet.operatingHours && <p className="text-[9px] text-[#414944]/70 mt-0.5">Jam: {outlet.operatingHours}</p>}
                              </div>
                            </div>
                            <span className="text-[10px] text-[#002d1c] font-bold flex items-center gap-0.5">
                              Pilih <ArrowRight size={10} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DOWNLOAD PDF & CONFIRM DROPOFF */}
                  {activeArrangeStep === 'download-pdf' && activeOutlet && (
                    <div className="space-y-4">
                      {/* Selected Outlet Tag */}
                      <div className="bg-[#edf5f1] border border-[#c0edd3] p-3.5 rounded-xl flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-[#002d1c]" />
                          <div>
                            <p className="text-[9px] uppercase font-bold text-[#002d1c]">Gerai Drop-off Terpilih:</p>
                            <p className="font-bold text-[#1c1b1b]">{activeOutlet.name}</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-[#002d1c] font-bold bg-white/80 border px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          <span>Terdaftar</span>
                        </span>
                      </div>

                      {/* PDF Print Instruction */}
                      <div className="bg-neutral-50 border rounded-xl p-4 text-[11px] leading-relaxed text-[#414944] space-y-2">
                        <p className="font-bold text-[#1c1b1b]">PROSEDUR PENYERAHAN RESI CETAK:</p>
                        <p>1. Klik tombol <strong>"Unduh Label Pengiriman (PDF)"</strong> untuk mengunduh berkas resi resmi ke penyimpanan lokal Anda.</p>
                        <p>2. Cetak berkas PDF tersebut atau tunjukkan barcode digital kepada staf di counter gerai <strong>{activeOutlet.name}</strong>.</p>
                        <p>3. Serahkan paket pakaian ke staf kurir tanpa biaya tunai.</p>
                      </div>

                      {/* Download PDF Action Button */}
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF(activeOrder)}
                        className={`w-full text-xs py-3.5 rounded-[14px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                          activePdfDownloaded 
                            ? 'bg-[#edf5f1] text-[#002d1c] border-[#c0edd3]'
                            : 'bg-white border-[#c1c8c2] hover:bg-[#fcf9f8] text-[#002d1c]'
                        }`}
                      >
                        <Download size={14} />
                        <span>{activePdfDownloaded ? 'Unduh Ulang Resi (PDF)' : 'Unduh Resi (PDF)'}</span>
                      </button>

                      {/* Tracking code generated box */}
                      {activeResi && (
                        <div className="bg-[#002d1c]/5 border border-[#002d1c]/20 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#002d1c] uppercase">No Resi Mitra Anda:</span>
                          <span className="font-mono text-xs font-black text-[#002d1c] bg-white border border-[#002d1c]/15 px-2.5 py-1 rounded">
                            {activeResi}
                          </span>
                        </div>
                      )}

                      {/* SLA Warning countdown */}
                      <p className="text-[10px] text-red-600 font-medium italic">
                        * Batas drop-off SLA aktif: Kirimkan sebelum 2x24 jam setelah pesanan dikonfirmasi.
                      </p>

                      {/* Confirm dropoff */}
                      <button
                        type="button"
                        disabled={!activePdfDownloaded}
                        onClick={() => handleConfirmDropoff(activeOrder.id)}
                        className={`w-full text-xs py-3.5 rounded-[14px] font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                          activePdfDownloaded 
                            ? 'bg-[#002d1c] text-white hover:opacity-95' 
                            : 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                        }`}
                      >
                        <Check size={14} />
                        <span>Konfirmasi Penyerahan ke Gerai</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 3: DALAM PENGIRIMAN (Shipped) */}
              {activeOrder.status === 'Shipped' && (
                <div className="space-y-4 text-left">
                  <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 text-[11px] leading-relaxed text-[#414944] space-y-2">
                    <span className="font-bold text-blue-700 block mb-1">PELACAKAN LOKASI BARANG AKTIF:</span>
                    <p>Nomor Resi: <strong className="font-mono text-xs bg-white border border-blue-100 px-1.5 py-0.5 rounded text-[#1c1b1b]">{activeOrder.resi}</strong></p>
                    <p>Kurir Mitra: <strong>{activeOrder.courier}</strong></p>
                    
                    {/* Simulated live tracking history */}
                    <div className="mt-4 border-l border-blue-200 pl-4 space-y-3 relative ml-1">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <p className="font-bold text-blue-700 text-[10px]">Paket sedang dikirim oleh kurir</p>
                        <p className="text-[9px] text-neutral-500">Kebayoran Baru Hub Jakarta Selatan • Hari ini</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-neutral-300" />
                        <p className="font-bold text-neutral-600 text-[10px]">Paket sukses di drop-off di Gerai Mitra</p>
                        <p className="text-[9px] text-neutral-400">SiCepat Plaza Indonesia • Kemarin</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#414944]/80 flex gap-2 items-start pt-2 border-t border-[#f0edec]">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Sistem Auto-Release</strong>: Bila pembeli tidak mengklik terima secara manual, dana Anda akan otomatis dilepas oleh sistem node-cron 3x24 jam setelah paket diestimasikan tiba.
                    </span>
                  </div>
                </div>
              )}

              {/* STAGE 4: SELESAI (Completed) */}
              {(activeOrder.status === 'Received' || activeOrder.status === 'Reviewed') && (
                <div className="space-y-4 text-left">
                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 text-[11px] leading-relaxed text-[#414944]">
                    <span className="font-bold text-emerald-800 block mb-1">BUKTI PENCAIRAN DANA:</span>
                    Penerima: <strong>{sellerName} (Saldo Keuangan Toko)</strong><br />
                    Nominal Transfer: <strong>Rp {activeOrder.totalAmount.toLocaleString('id-ID')}</strong> (Tanpa Biaya Potongan)<br />
                    Status: <strong className="text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded text-[10px] ml-1">TELAH DICAIRKAN</strong><br />
                    Sistem: Auto-release cron RE-LOVE terverifikasi.
                  </div>

                  <div className="text-[10px] text-emerald-700 font-bold flex gap-1.5 items-center">
                    <Check size={14} className="stroke-[3]" />
                    <span>Dana penjualan preloved Anda telah sukses masuk saldo Keuangan Toko.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
