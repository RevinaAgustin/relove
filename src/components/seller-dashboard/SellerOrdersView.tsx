/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Check, X, Printer, Package, Landmark, Clipboard, Truck, AlertCircle, FileText, CheckCircle2, ShieldCheck, ArrowRight, MapPin, Download } from 'lucide-react';
import { Order } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

interface SellerOrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], resi?: string) => void;
  onRejectOrder: (orderId: string) => void;
  onGoBack: () => void;
  userProfile?: { name: string; shopName: string; email: string; phone: string; avatar: string };
}

// Map outlets locations using real coordinates
interface Outlet {
  id: string;
  name: string;
  distance: string;
  lat: number;
  lon: number;
}

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

  const activeOutlet = activeOrder ? orderOutlets[activeOrder.id] : null;
  const activeResi = activeOrder ? orderResis[activeOrder.id] : '';
  const activePdfDownloaded = activeOrder ? !!orderPdfDownloaded[activeOrder.id] : false;
  const activeArrangeStep = activeOutlet ? 'download-pdf' : 'select-outlet';

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Load Leaflet dynamically from CDN
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setIsLeafletLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      setIsLeafletLoaded(true);
    }
  }, []);

  // Fetch real-time GPS coordinates of the user when setting up shipments
  useEffect(() => {
    if (activeOrder && activeOrder.status === 'Paid' && activeArrangeStep === 'select-outlet') {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation failed or permission denied, using default Kebayoran Baru coordinates.', err);
          // Default: Kebayoran Baru, Jakarta (-6.2446, 106.8006)
          setUserCoords({ lat: -6.2446, lon: 106.8006 });
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [activeOrder?.id, activeOrder?.status, activeArrangeStep]);

  // Dynamically compute nearby outlets around the user's coordinates matching the chosen courier partner
  const outlets = useMemo<Outlet[]>(() => {
    if (!userCoords || !activeOrder) return [];
    const courier = activeOrder.courier.split(' ')[0]; // 'SiCepat' or 'J&T'
    return [
      {
        id: `out-${activeOrder.id}-1`,
        name: `Gerai ${courier} - Cabang Terdekat`,
        distance: '240 m',
        lat: userCoords.lat + 0.0018,
        lon: userCoords.lon - 0.0022,
      },
      {
        id: `out-${activeOrder.id}-2`,
        name: `Hub ${courier} - Drop Point Utama`,
        distance: '580 m',
        lat: userCoords.lat - 0.0025,
        lon: userCoords.lon + 0.0031,
      },
      {
        id: `out-${activeOrder.id}-3`,
        name: `Kolektor ${courier} - Point Express`,
        distance: '1.1 km',
        lat: userCoords.lat + 0.0041,
        lon: userCoords.lon + 0.0015,
      },
    ];
  }, [userCoords, activeOrder?.id, activeOrder?.courier]);

  // Render or update Leaflet map when Leaflet, coordinates, and outlets are loaded
  useEffect(() => {
    if (!isLeafletLoaded || !userCoords || !mapContainerRef.current || activeArrangeStep !== 'select-outlet') return;

    // Clean up existing map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const L = (window as any).L;
    if (!L) return;

    // Initialize Leaflet map targeting the container ref
    const map = L.map(mapContainerRef.current).setView([userCoords.lat, userCoords.lon], 15);
    mapInstanceRef.current = map;

    // Add Tile Layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom Icon for User's real GPS position (Pulsing Blue Ring)
    const userIcon = L.divIcon({
      className: 'custom-user-icon',
      html: `
        <div style="position: relative; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 12px; height: 12px; background-color: #2563eb; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(37,99,235,0.6); z-index: 10;"></div>
          <div style="position: absolute; width: 12px; height: 12px; background-color: #2563eb; border-radius: 50%; transform: scale(2); opacity: 0; animation: pulse-ring-marker 1.8s infinite; z-index: 9;"></div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker([userCoords.lat, userCoords.lon], { icon: userIcon })
      .addTo(map)
      .bindPopup('<strong>Lokasi Toko Anda</strong>')
      .openPopup();

    // Map each outlet to a Leaflet marker
    outlets.forEach((outlet) => {
      const outletIcon = L.divIcon({
        className: 'custom-outlet-pin',
        html: `
          <div style="background-color: #002d1c; color: white; padding: 6px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      const marker = L.marker([outlet.lat, outlet.lon], { icon: outletIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 11px; color: #1c1b1b; text-align: left;">
          <strong style="color: #002d1c; display: block; margin-bottom: 2px;">${outlet.name}</strong>
          <span>Jarak: ${outlet.distance}</span>
          <button 
            style="display: block; margin-top: 6px; padding: 3px 8px; background-color: #002d1c; color: white; border: none; border-radius: 4px; font-size: 9px; font-weight: bold; cursor: pointer; text-transform: uppercase;"
            id="btn-select-${outlet.id}"
          >
            Pilih Gerai ini
          </button>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${outlet.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            handleSelectOutlet(outlet);
          });
        }
      });
    });

    // Append custom animation styles to head
    if (!document.getElementById('leaflet-animation-style')) {
      const style = document.createElement('style');
      style.id = 'leaflet-animation-style';
      style.innerHTML = `
        @keyframes pulse-ring-marker {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.8); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, [isLeafletLoaded, userCoords, outlets, activeArrangeStep]);

  const handleConfirmOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'Paid');
    alert('Pesanan berhasil dikonfirmasi! Silakan lanjutkan untuk Mengatur Pengiriman Gerai.');
  };

  const handleRejectClick = (orderId: string) => {
    const reason = window.prompt('Harap masukkan alasan penolakan pesanan (dana escrow pembeli akan otomatis direfund):', 'Stok barang rusak/hilang');
    if (reason !== null) {
      onRejectOrder(orderId);
      alert('Pesanan ditolak. Dana QRIS Escrow pembeli telah direfund.');
    }
  };

  const handleSelectOutlet = (outlet: Outlet) => {
    if (!activeOrder) return;
    const orderId = activeOrder.id;
    const randNo = `RL-${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    setOrderOutlets(prev => ({ ...prev, [orderId]: outlet }));
    setOrderResis(prev => ({ ...prev, [orderId]: randNo }));
    
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
                setSelectedOrderId(''); // Reset selected order
                setSelectedOutlet(null);
                setPdfDownloaded(false);
                setArrangeStep('select-outlet');
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
                    setSelectedOutlet(null);
                    setPdfDownloaded(false);
                    setArrangeStep('select-outlet');
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
                    Metode Pembayaran: QRIS Escrow (Dana Ditahan Aman)
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
                        Harap periksa kondisi pakaian terlebih dahulu sebelum menerima pesanan ini. Menolak pesanan akan merefund dana escrow secara instan ke pembeli.
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
                        <strong className="text-[#002d1c]">Pilih Gerai Pengiriman Terdekat dari lokasi Anda:</strong>
                        <p className="mt-0.5 text-neutral-500">Klik salah satu pin berlogo lokasi pada peta interaktif di bawah untuk memilih gerai drop-off paket.</p>
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
                        {outlets.map((outlet) => {
                          return (
                            <button
                              key={outlet.id}
                              type="button"
                              onClick={() => handleSelectOutlet(outlet)}
                              className="absolute group flex flex-col items-center cursor-pointer transition-all hover:scale-115 active:scale-95"
                              style={{ left: `${outlet.coords.x}%`, top: `${outlet.coords.y}%` }}
                            >
                              <div className="bg-[#002d1c] text-white p-1.5 rounded-full shadow-md flex items-center justify-center hover:bg-emerald-800 transition-colors animate-bounce">
                                <MapPin size={14} className="stroke-[2.5]" />
                              </div>
                              <span className="scale-0 group-hover:scale-100 transition-transform absolute -top-9 bg-neutral-900 text-white text-[8px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap z-20 pointer-events-none">
                                {outlet.name} ({outlet.distance})
                              </span>
                            </button>
                          );
                        })}

                        <div className="absolute bottom-2 left-2 bg-white/90 border px-2 py-0.5 rounded text-[8px] font-bold text-[#414944] shadow-xs">
                          Peta Lokasi Mitra - Kebayoran Baru
                        </div>
                      </div>

                      {/* Outlet list items */}
                      <div className="flex flex-col gap-2">
                        {outlets.map((outlet) => (
                          <div
                            key={outlet.id}
                            onClick={() => handleSelectOutlet(outlet)}
                            className="flex items-center justify-between p-3 border border-[#f0edec] rounded-xl hover:border-[#002d1c] bg-[#fcf9f8] cursor-pointer transition-all text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-[#002d1c]" />
                              <div>
                                <p className="font-bold text-[#1c1b1b]">{outlet.name}</p>
                                <p className="text-[9px] text-[#414944]">Jarak: {outlet.distance} dari lokasi toko</p>
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
                    <span className="font-bold text-emerald-800 block mb-1">BUKTI PENCAIRAN DANA ESCROW:</span>
                    Penerima: <strong>{sellerName} (Saldo Keuangan Toko)</strong><br />
                    Nominal Transfer: <strong>Rp {activeOrder.totalAmount.toLocaleString('id-ID')}</strong> (Tanpa Biaya Potongan)<br />
                    Status: <strong className="text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded text-[10px] ml-1">TELAH DICAIRKAN (RELEASED)</strong><br />
                    Sistem: Auto-release cron RE-LOVE terverifikasi.
                  </div>

                  <div className="text-[10px] text-emerald-700 font-bold flex gap-1.5 items-center">
                    <Check size={14} className="stroke-[3]" />
                    <span>Dana penjualan preloved sirkular Anda telah sukses masuk saldo Keuangan Toko.</span>
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
