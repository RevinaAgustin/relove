/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Heart, Truck, ShieldCheck, Mail, LogOut, ChevronRight, Lock, MapPin, CreditCard, MessageSquare, Trash2, PlusCircle, Star, TrendingUp, AlertCircle, ShoppingBag, BarChart2, Eye, HelpCircle, X, Plus, Check, Wallet, Info, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Product } from '../../types';

interface ProfileViewProps {
  orders: Order[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  navigate: (screen: any) => void;
  products: Product[];
  initialTab?: 'wishlist' | 'orders' | 'seller';
  setIsLoggedIn?: (val: boolean) => void;
  userProfile?: { name: string; shopName: string; email: string; phone: string; avatar: string };
  onUpdateProfile?: (updated: any) => void;
  onViewOwnShop?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders,
  wishlistProducts,
  toggleWishlist,
  onSelectProduct,
  navigate,
  products,
  initialTab,
  setIsLoggedIn,
  userProfile,
  onUpdateProfile,
  onViewOwnShop,
}) => {
  const [activeProfileTab, setActiveTab] = useState<'wishlist' | 'orders' | 'seller'>(initialTab || 'orders');
  const [activeChartFilter, setActiveChartFilter] = useState<'7' | '30'>('7');
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem('re_love_reviews');
    return saved ? JSON.parse(saved) : [];
  });
  const activeShopName = userProfile?.shopName || 'UrbanArchive Vintage';
  const myProducts = products.filter((p) => p.sellerName === activeShopName);
  const buyerOrders = orders.filter((o) => !o.id.startsWith('ord-seller-'));
  const sellerOrders = orders.filter((o) => o.id.startsWith('ord-seller-'));



  // Address Management State for Profile Settings
  const [addresses, setAddresses] = useState<any[]>(() => {
    const saved = localStorage.getItem('re_love_addresses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    const defaultAddrs = [
      {
        id: 'addr-1',
        name: 'Budi Santoso',
        phone: '(+62) 812-3456-7890',
        fullAddress: 'Jl. Jenderal Sudirman No. 45, Apartemen Senayan City Residence, Tower A, Lantai 12, Unit 1205. Kebayoran Baru',
        city: 'Jakarta Selatan',
        postalCode: '12190',
        isDefault: true,
      },
      {
        id: 'addr-2',
        name: 'Budi Santoso (Kantor)',
        phone: '(+62) 812-1122-3344',
        fullAddress: 'Gedung Tokopedia Tower Lantai 22, Jl. Prof. DR. Satrio No. 3, Karet Semanggi, Setiabudi',
        city: 'Jakarta Selatan',
        postalCode: '12940',
        isDefault: false,
      }
    ];
    localStorage.setItem('re_love_addresses', JSON.stringify(defaultAddrs));
    return defaultAddrs;
  });

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Address Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');

  const saveAddresses = (newAddrs: any[]) => {
    setAddresses(newAddrs);
    localStorage.setItem('re_love_addresses', JSON.stringify(newAddrs));
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    saveAddresses(updated);
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (addresses.length <= 1) {
      alert('Anda harus memiliki setidaknya satu alamat pengiriman.');
      return;
    }
    const target = addresses.find(addr => addr.id === id);
    const updated = addresses.filter((addr) => addr.id !== id);
    if (target?.isDefault) {
      // Set the first remaining address as default
      updated[0].isDefault = true;
    }
    saveAddresses(updated);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newFullAddress || !newCity || !newPostalCode) {
      alert('Mohon isi semua data alamat baru Anda.');
      return;
    }

    const newAddr = {
      id: `addr-${Date.now()}`,
      name: newName,
      phone: newPhone,
      fullAddress: newFullAddress,
      city: newCity,
      postalCode: newPostalCode,
      isDefault: false,
    };

    const updated = [...addresses, newAddr];
    saveAddresses(updated);
    
    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewFullAddress('');
    setNewCity('');
    setNewPostalCode('');
    setIsAddingNew(false);
  };

  // Simulated chart indices values
  const hasOrders = sellerOrders.length > 0;
  const dataset = {
    '7': [
      { day: 'Sen', value: hasOrders ? 'h-10' : 'h-2 bg-[#c0edd3]/30' },
      { day: 'Sel', value: hasOrders ? 'h-24' : 'h-2 bg-[#c0edd3]/30' },
      { day: 'Rab', value: hasOrders ? 'h-14' : 'h-2 bg-[#c0edd3]/30' },
      { day: 'Kam', value: hasOrders ? 'h-36 bg-[#002d1c]' : 'h-2 bg-[#c0edd3]/30' },
      { day: 'Jum', value: hasOrders ? 'h-28' : 'h-2 bg-[#c0edd3]/30' },
      { day: 'Sab', value: hasOrders ? 'h-20' : 'h-2 bg-[#c0edd3]/30' },
      { day: 'Min', value: hasOrders ? 'h-8' : 'h-2 bg-[#c0edd3]/30' },
    ],
    '30': [
      { day: 'M1', value: hasOrders ? 'h-24' : 'h-2 bg-[#c0edd3]/30' },
      { day: 'M2', value: hasOrders ? 'h-32 bg-[#002d1c]' : 'h-2 bg-[#c0edd3]/30' },
      { day: 'M3', value: hasOrders ? 'h-16' : 'h-2 bg-[#c0edd3]/30' },
      { day: 'M4', value: hasOrders ? 'h-28' : 'h-2 bg-[#c0edd3]/30' },
    ],
  };

  const chartData = dataset[activeChartFilter];

  return (
    <div className="flex flex-col gap-10 py-4">
      {/* 1. Header Profil & Real-time Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap">
        {/* Profile Card details */}
        <div className="lg:col-span-8 bg-white rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 relative overflow-hidden border border-[#f0edec] shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c0edd3]/10 rounded-bl-full"></div>
          
          <div className="w-24 h-24 rounded-[24px] overflow-hidden border-4 border-white shadow-md z-10 bg-[#ebe7e7]">
            <img
              alt="Buyer Avatar Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              src={userProfile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDOp2IWcbJj0WSBYUi9ScAhNe_jVNFSJrwvrH_iuZjBFJcvwzitf49Ul4GBxTD-Sa3acz2JRcH91HhhA9bjMBx5c_Xi_BgwFmf1j0AU56trzUu_iSxVtifVayiCz5_ELhoo_0az3lfkhPmfJmPsLhUTnV0qFrItiZ7yxaJlDTWG2AWZBhskCnqWEkcIWjPoCVLfSYj8fl9WVgywiwKIbx2n6WMsnQXFCBLOE8lXOnpfstrxZsgJIhXR-SuzI-scHKvwnG2GUOswM6LH"}
            />
          </div>

          <div className="text-center md:text-left z-10 font-geist">
            <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight mb-1">{userProfile?.name || 'Sarah J.'}</h1>
          </div>

          <div className="md:ml-auto z-10 flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={() => navigate('edit-profile')}
              className="w-full sm:w-auto bg-[#f0edec] text-[#1c1b1b] font-geist text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#ebe7e7] transition-all cursor-pointer"
            >
              Edit Profil
            </button>
            <button 
              onClick={() => navigate('create-listing-info')}
              className="w-full sm:w-auto justify-center bg-[#002d1c] text-white font-geist text-xs font-black px-5 py-2.5 rounded-full hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <PlusCircle size={14} className="text-[#a4d0b8]" />
              <span>Mulai Jual</span>
            </button>
          </div>
        </div>

        {/* Stats card matching theme colors */}
        <div className="lg:col-span-4 bg-[#1a4331] text-white rounded-[24px] p-6 md:p-8 flex flex-col justify-between shadow-sm font-geist">
          <h3 className="text-[#c0edd3] font-bold text-xs uppercase tracking-widest">Ringkasan Aktivitas</h3>
          
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
              <div className="flex items-center gap-2 opacity-90">
                <Truck size={14} />
                <span>Total Pesanan</span>
              </div>
              <span className="text-sm font-bold">{orders.length}</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
              <div className="flex items-center gap-2 opacity-90">
                <Heart size={14} />
                <span>Barang Disimpan</span>
              </div>
              <span className="text-sm font-bold">{wishlistProducts.length}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 opacity-90">
                <MessageSquare size={14} />
                <span>Total Pendapatan Toko</span>
              </div>
              <span className="text-sm font-bold">Rp 12.450.000</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Swappable Tabs (Wishlist / Pesanan Saya / Dashboard Penjual) */}
      <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm">
        <div className="flex flex-wrap gap-4 border-b border-[#f0edec] pb-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`font-display text-sm font-extrabold tracking-tight pb-2 border-b-2 transition-all ${
              activeProfileTab === 'orders'
                ? 'border-[#002d1c] text-[#002d1c]'
                : 'border-transparent text-[#414944]/60 hover:text-[#414944]'
            }`}
          >
            Pesanan Saya ({buyerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`font-display text-sm font-extrabold tracking-tight pb-2 border-b-2 transition-all ${
              activeProfileTab === 'wishlist'
                ? 'border-[#002d1c] text-[#002d1c]'
                : 'border-transparent text-[#414944]/60 hover:text-[#414944]'
            }`}
          >
            Wishlist ({wishlistProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`font-display text-sm font-extrabold tracking-tight pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeProfileTab === 'seller'
                ? 'border-[#002d1c] text-[#002d1c]'
                : 'border-transparent text-[#414944]/60 hover:text-[#414944]'
            }`}
          >
            Dashboard Penjual <span className="bg-[#002d1c] text-[#c0edd3] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Mitra</span>
          </button>
        </div>

        {/* Tab content renderer */}
        {activeProfileTab === 'orders' && (
          buyerOrders.length === 0 ? (
            <div className="text-center py-12 text-sm text-[#414944]/75">
              Belum ada pesanan aktif. Mulai belanja preloved pilihan.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {buyerOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => {
                    if (order.status === 'Waiting') navigate('payment');
                    else navigate('track-order');
                  }}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#fcf9f8] rounded-[16px] border border-[#c1c8c2]/20 hover:border-[#002d1c]/40 hover:shadow-sm transition-all cursor-pointer font-geist gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-xl bg-[#ebe7e7] overflow-hidden flex-shrink-0 border border-black/5">
                      <img alt={order.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" src={order.image} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1c1b1b] line-clamp-1">{order.productName}</h4>
                      <p className="text-[10px] text-[#414944] mt-0.5">Penjual: {order.sellerName} • {order.courier}</p>
                      <p className="text-xs text-[#002d1c] font-black mt-2">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      order.status === 'Waiting' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#c0edd3] text-[#002d1c]'
                    }`}>
                      {order.status === 'Waiting' && 'BELUM DIBAYAR'}
                      {order.status === 'Paid' && 'Telah Dibayar'}
                      {order.status === 'Received' && 'Diterima'}
                      {order.status === 'Reviewed' && 'Selesai di-Review'}
                    </span>
                    <ChevronRight size={16} className="text-[#414944]" />
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeProfileTab === 'wishlist' && (
          wishlistProducts.length === 0 ? (
            <div className="text-center py-12 text-sm text-[#414944]/75">
              Belum ada produk yang disimpan di Wishlist Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-[#fcf9f8] p-4 rounded-[16px] border border-[#c1c8c2]/20 hover:border-[#002d1c]/45 cursor-pointer relative group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#ebe7e7] rounded-xl overflow-hidden flex-shrink-0">
                      <img alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" src={product.imagePrimary} />
                    </div>
                    <div className="font-geist">
                      <h4 className="text-xs font-bold text-[#1c1b1b] max-w-[120px] truncate">{product.name}</h4>
                      <p className="text-[10px] text-[#002d1c] font-bold mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Remove wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="p-2 text-[#414944] hover:text-[#ba1a1a] transition-colors rounded-full hover:bg-red-50 z-10"
                    title="Hapus dari wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {/* INTEGRATED SELLER DASHBOARD VIEW TAB */}
        {activeProfileTab === 'seller' && (
          <div className="flex flex-col gap-8 font-geist">
            {/* 1. Shop Header Details */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#f0edec] pb-6">
              <div>
                <h2 className="font-display text-[#002d1c] text-2xl font-extrabold tracking-tight mb-2">{activeShopName}</h2>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center bg-[#d4e5c7] text-[#002d1c] px-3 py-1 rounded-full font-bold">
                    <Star size={12} className="fill-current mr-1" />
                    <span>4.9 / 5.0 Rating</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    if (onViewOwnShop) {
                      onViewOwnShop();
                    } else {
                      navigate('seller-shop');
                    }
                  }}
                  className="flex items-center gap-2 bg-white border border-[#c1c8c2] text-[#002d1c] hover:bg-[#fcf9f8] px-5 py-3 rounded-full text-xs font-black transition-all cursor-pointer"
                >
                  <Eye size={16} />
                  <span>Lihat Toko Anda</span>
                </button>
                <button
                  onClick={() => navigate('create-listing-info')}
                  className="flex items-center gap-2 bg-[#002d1c] text-white px-6 py-3 rounded-full text-xs font-black hover:opacity-95 active:scale-95 transition-all shadow-md"
                >
                  <PlusCircle size={16} />
                  <span>Tambah Listing Jualan</span>
                </button>
              </div>
            </header>

            {/* 2. Numerical Stats Bento grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Earnings Card */}
              <div className="bg-[#fcf9f8] rounded-[24px] p-6 border border-[#f0edec] flex flex-col justify-between shadow-sm">
                <p className="text-[#414944] text-[10px] font-bold uppercase tracking-wider mb-2">Total Pendapatan</p>
                <h3 className="text-xl font-display font-extrabold text-[#002d1c]">
                  Rp {sellerOrders
                    .filter((o) => o.status === 'Received' || o.status === 'Reviewed')
                    .reduce((sum, o) => sum + o.totalAmount, 0)
                    .toLocaleString('id-ID')}
                </h3>
                <div className="flex items-center mt-3 text-[#002d1c] text-[9px] font-bold">
                  <TrendingUp size={12} className="mr-1" />
                  <span>{sellerOrders.length > 0 ? '+12.4% meningkat bulan ini' : 'Belum ada transaksi'}</span>
                </div>
              </div>

              {/* New Orders */}
              <div className="bg-[#fcf9f8] rounded-[24px] p-6 border border-[#f0edec] flex flex-col justify-between shadow-sm">
                <p className="text-[#414944] text-[10px] font-bold uppercase tracking-wider mb-2">Pesanan Masuk</p>
                <h3 className="text-xl font-display font-extrabold text-[#002d1c]">{sellerOrders.length} Paket</h3>
                <div className="flex items-center mt-3 text-[#ba1a1a] text-[9px] font-bold">
                  <AlertCircle size={12} className="mr-1" />
                  <span>{sellerOrders.filter(o => o.status === 'Waiting' || o.status === 'Paid').length} Perlu segera di-proses</span>
                </div>
              </div>

              {/* Active counting */}
              <div className="bg-[#fcf9f8] rounded-[24px] p-6 border border-[#f0edec] flex flex-col justify-between shadow-sm">
                <p className="text-[#414944] text-[10px] font-bold uppercase tracking-wider mb-2">Listing Aktif</p>
                <h3 className="text-xl font-display font-extrabold text-[#002d1c]">{myProducts.length} Barang</h3>
                <p className="text-[9px] text-[#414944]/70 mt-3 font-normal">
                  {myProducts.filter(p => p.isArchived).length} barang diarsipkan
                </p>
              </div>

              {/* Response count */}
              <div className="bg-[#fcf9f8] rounded-[24px] p-6 border border-[#f0edec] flex flex-col justify-between shadow-sm">
                <p className="text-[#414944] text-[10px] font-bold uppercase tracking-wider mb-2">Tingkat Penjualan</p>
                <h3 className="text-xl font-display font-extrabold text-[#002d1c]">
                  {sellerOrders.length > 0 ? '100% Responsif' : 'Baru Bergabung'}
                </h3>
                <div className="flex items-center mt-3 text-[#002d1c] text-[9px] font-bold">
                  <ShieldCheck size={12} className="mr-1" />
                  <span>{sellerOrders.length > 0 ? 'Sangat Tanggap & Cepat' : 'Belum ada ulasan/pesanan'}</span>
                </div>
              </div>
            </div>

            {/* 3. Analytics Chart section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap">
              <div className="lg:col-span-8 bg-[#fcf9f8] rounded-[24px] p-6 border border-[#f0edec] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-display font-bold text-[#002d1c]">Analitik Pengunjung Toko</h3>
                    <p className="text-[9px] text-[#414944] font-medium mt-0.5">Traffic & Konversi Pengunjung Mingguan</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setActiveChartFilter('7')}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                        activeChartFilter === '7'
                          ? 'bg-[#002d1c] text-white border-transparent'
                          : 'border-[#c1c8c2] text-[#414944] hover:bg-[#f6f3f2]'
                      }`}
                    >
                      7 Hari
                    </button>
                    <button
                      onClick={() => setActiveChartFilter('30')}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
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
                <div className="flex-grow flex items-end justify-between gap-1.5 sm:gap-4 h-48 border-b border-[#f0edec] pb-3 mb-3 select-none">
                  {chartData.map((data, index) => (
                    <div key={index} className="w-full flex flex-col items-center group relative">
                      <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all font-geist text-[9px] bg-[#002d1c] text-[#c0edd3] px-2 py-0.5 rounded shadow pointer-events-none z-10">
                        Rp {(150 + Math.random() * 300).toFixed(0)}rb
                      </div>
                      <div
                        className={`w-full bg-[#c0edd3]/60 rounded-t transition-all duration-500 hover:opacity-95 ${data.value}`}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between px-1 text-[9px] text-[#414944] uppercase tracking-wider font-bold">
                  {chartData.map((data, index) => (
                    <span key={index}>{data.day}</span>
                  ))}
                </div>
              </div>

              {/* Quick Tools Grid list */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('create-listing-info')}
                  className="bg-[#fcf9f8] rounded-[24px] p-4 border border-[#f0edec] hover:border-[#002d1c] transition-all flex flex-col items-center justify-center text-center gap-2 shadow-sm group"
                >
                  <PlusCircle size={24} className="text-[#002d1c] group-hover:scale-105 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1c1b1b]">Tambah Listing</span>
                </button>
                
                <button
                  onClick={() => navigate('seller-products')}
                  className="bg-[#fcf9f8] rounded-[24px] p-4 border border-[#f0edec] hover:border-[#002d1c] transition-all flex flex-col items-center justify-center text-center gap-2 shadow-sm group cursor-pointer"
                >
                  <ShoppingBag size={24} className="text-[#002d1c] group-hover:scale-105 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1c1b1b]">Kelola Produk</span>
                </button>
                
                <button
                  onClick={() => navigate('seller-finance')}
                  className="bg-[#fcf9f8] rounded-[24px] p-4 border border-[#f0edec] hover:border-[#002d1c] transition-all flex flex-col items-center justify-center text-center gap-2 shadow-sm group cursor-pointer"
                >
                  <Wallet size={24} className="text-[#002d1c] group-hover:scale-105 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1c1b1b]">Keuangan</span>
                </button>
                
                <button
                  onClick={() => navigate('seller-orders')}
                  className="bg-[#fcf9f8] rounded-[24px] p-4 border border-[#f0edec] hover:border-[#002d1c] transition-all flex flex-col items-center justify-center text-center gap-2 shadow-sm group cursor-pointer"
                >
                  <Package size={24} className="text-[#002d1c] group-hover:scale-105 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1c1b1b]">Atur Pesanan</span>
                </button>
              </div>
            </div>

            {/* 4. Active Incoming Orders & Inventory Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap">
              {/* Incoming Order confirmation */}
              <div className="lg:col-span-6 bg-[#fcf9f8] rounded-[24px] p-6 border border-[#f0edec] shadow-sm text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-bold text-sm text-[#002d1c]">Atur Pesanan Toko</h3>
                  <span onClick={() => navigate('seller-orders')} className="text-[11px] text-[#002d1c] font-bold hover:underline cursor-pointer">Lihat Semua</span>
                </div>

                <div className="flex flex-col gap-3">
                  {sellerOrders.length === 0 ? (
                    <p className="text-center py-6 text-[11px] text-[#414944]/70">Belum ada pesanan masuk.</p>
                  ) : (
                    sellerOrders.slice(0, 2).map((order) => {
                      const isWaiting = order.status === 'Waiting';
                      const isPaid = order.status === 'Paid';
                      const isShipped = order.status === 'Shipped' || order.status === 'Courier';
                      const isCompleted = order.status === 'Received' || order.status === 'Reviewed';

                      return (
                        <div
                          key={order.id}
                          onClick={() => navigate('seller-orders')}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-[16px] border border-[#f0edec] text-xs gap-3 cursor-pointer hover:border-[#002d1c]/45 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#c0edd3]/25 border border-[#c1c8c2]/20 flex items-center justify-center text-[#002d1c] flex-shrink-0">
                              <ShoppingBag size={16} />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold text-[#1c1b1b]">Order #{order.id.toUpperCase()}</h4>
                              <p className="text-[9px] text-[#414944] mt-0.5">Rp {order.totalAmount.toLocaleString('id-ID')} • {order.courier}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-0.5 text-[9px] rounded-full font-bold uppercase self-start sm:self-auto ${
                            isWaiting ? 'bg-[#fdfaf2] text-[#8a5710]' :
                            isPaid ? 'bg-[#edf5f1] text-[#002d1c]' :
                            isShipped ? 'bg-blue-50 text-blue-700' :
                            'bg-emerald-50 text-emerald-700'
                          }`}>
                            {isWaiting && 'Baru'}
                            {isPaid && 'Perlu Kirim'}
                            {isShipped && 'Dikirim'}
                            {isCompleted && 'Selesai'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Shop Listings Inventory */}
              <div className="lg:col-span-6 bg-[#fcf9f8] rounded-[24px] p-6 border border-[#f0edec] shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-bold text-sm text-[#002d1c]">Barang Jualan Anda ({myProducts.length})</h3>
                  <span onClick={() => navigate('seller-products')} className="text-[11px] text-[#002d1c] font-bold hover:underline cursor-pointer">Selengkapnya</span>
                </div>

                <div className="flex flex-col gap-3">
                  {myProducts.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onSelectProduct(prod)}
                      className="flex items-center justify-between p-3 bg-white rounded-[16px] border border-[#f0edec] text-xs cursor-pointer hover:border-[#002d1c]/40 transition-all gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-[#ebe7e7] rounded-xl overflow-hidden flex-shrink-0">
                          <img alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" src={prod.imagePrimary} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#1c1b1b] line-clamp-1">{prod.name}</h4>
                          <p className="text-[9px] text-[#414944] mt-0.5">Rp {prod.price.toLocaleString('id-ID')} • Size {prod.size}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[#414944] flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Ulasan Pembeli Terbaru */}
            <div className="border-t border-[#f0edec] pt-6 mb-2">
              <h3 className="font-display font-bold text-sm text-[#002d1c] mb-4">Ulasan Pembeli</h3>
              {reviews.length === 0 ? (
                <p className="text-left text-[11px] text-[#414944]/70">Belum ada ulasan untuk toko Anda.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#fcf9f8] border border-[#f0edec] rounded-[20px] flex flex-col gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1c1b1b]">{rev.buyerName}</span>
                        <div className="flex text-yellow-500 gap-0.5">
                          {Array.from({ length: rev.stars }).map((_, s) => (
                            <Star key={s} size={10} className="fill-current text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#414944] italic leading-normal">
                        "{rev.text}"
                      </p>
                      <span className="text-[9px] text-[#414944]/55 text-right font-geist mt-1">{rev.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Account Settings Menu */}
      <section className="bg-white rounded-[24px] overflow-hidden border border-[#f0edec] shadow-sm">
        <h3 className="font-display text-lg font-bold text-[#002d1c] p-6 border-b border-[#f0edec]">
          Pengaturan Akun Anda
        </h3>

        <div className="flex flex-col divide-y divide-[#f0edec] font-geist text-left">
          <a className="flex items-center justify-between p-6 hover:bg-[#f6f3f2] transition-colors group gap-4" href="#settings">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-[#d4e5c7]/40 flex items-center justify-center text-[#54634b] flex-shrink-0">
                <Lock size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#1c1b1b]">Keamanan Akun</h4>
                <p className="text-[10px] text-[#414944] leading-relaxed">Kelola kata sandi & otentikasi dua faktor anda</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#c1c8c2] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </a>

          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="flex items-center justify-between p-6 hover:bg-[#f6f3f2] transition-colors group w-full text-left border-none cursor-pointer gap-4"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-[#d4e5c7]/40 flex items-center justify-center text-[#54634b] flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#1c1b1b]">Alamat Pengiriman</h4>
                <p className="text-[10px] text-[#414944] leading-relaxed">Kelola dan atur alamat pengiriman Anda</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#c1c8c2] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>
        </div>
      </section>

      {/* Address Manager Modal Overlay */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddressModalOpen(false);
                setIsAddingNew(false);
              }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] font-geist border border-[#f0edec]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#f0edec] flex items-center justify-between bg-[#fcf9f8]">
                <h3 className="font-display font-black text-[#002d1c] text-lg">Kelola Alamat Pengiriman</h3>
                <button
                  onClick={() => {
                    setIsAddressModalOpen(false);
                    setIsAddingNew(false);
                  }}
                  className="text-[#414944] hover:text-[#002d1c] p-1.5 rounded-full hover:bg-[#e5e2e1]/40 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left">
                {!isAddingNew ? (
                  <>
                    {/* List existing addresses */}
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-5 rounded-2xl border-2 transition-all flex flex-col gap-3 relative ${
                            addr.isDefault
                              ? 'border-[#002d1c] bg-[#1a4331]/5'
                              : 'border-[#c1c8c2]/30 bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="text-xs space-y-1 pr-8">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#1c1b1b]">{addr.name}</span>
                                {addr.isDefault && (
                                  <span className="text-[9px] bg-[#002d1c] text-white font-black px-2 py-0.5 rounded uppercase">Utama</span>
                                )}
                              </div>
                              <p className="text-[#414944]/80 font-mono text-[11px]">{addr.phone}</p>
                              <p className="text-[#414944] leading-relaxed mt-1">{addr.fullAddress}</p>
                              <p className="text-[#1c1b1b] font-medium mt-0.5">{addr.city}, {addr.postalCode}</p>
                            </div>

                            {/* Delete address action */}
                            <button
                              onClick={(e) => handleDeleteAddress(addr.id, e)}
                              className="text-[#414944]/60 hover:text-[#ba1a1a] p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hapus Alamat"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Secondary action inside address card: Set Default */}
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className="text-[11px] self-start font-black text-[#002d1c] bg-[#002d1c]/5 hover:bg-[#002d1c]/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Jadikan Alamat Utama
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Trigger for Adding New */}
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="w-full py-4 border-2 border-dashed border-[#c1c8c2] hover:border-[#002d1c] text-[#002d1c] font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-[#1a4331]/5 cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Tambah Alamat Baru</span>
                    </button>
                  </>
                ) : (
                  /* Form to add new address */
                  <form onSubmit={handleAddNewAddress} className="space-y-4">
                    <div className="flex items-center justify-between pb-1 border-b border-[#f0edec]">
                      <h4 className="font-display font-black text-xs text-[#002d1c] uppercase tracking-wider">Alamat Pengiriman Baru</h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="text-xs font-bold text-[#414944] hover:text-[#002d1c] cursor-pointer"
                      >
                        Kembali
                      </button>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#414944]/80">Nama Lengkap Penerima</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="contoh: Sarah J."
                        className="w-full text-xs font-geist p-3 border border-[#c1c8c2]/50 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#414944]/80">Nomor Telepon aktif</label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="contoh: (+62) 812-9876-5432"
                        className="w-full text-xs font-geist p-3 border border-[#c1c8c2]/50 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none"
                      />
                    </div>

                    {/* Full Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#414944]/80">Alamat Lengkap (Jalan, No, Unit)</label>
                      <textarea
                        required
                        rows={3}
                        value={newFullAddress}
                        onChange={(e) => setNewFullAddress(e.target.value)}
                        placeholder="contoh: Jalan Kebon Sirih No. 17, Apartemen Menteng Raya, Tower 2, Lantai 5"
                        className="w-full text-xs font-geist p-3 border border-[#c1c8c2]/50 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* City */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-[#414944]/80">Kota / Kabupaten</label>
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          placeholder="contoh: Jakarta Pusat"
                          className="w-full text-xs font-geist p-3 border border-[#c1c8c2]/50 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none"
                        />
                      </div>

                      {/* Postal Code */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-[#414944]/80">Kode Pos</label>
                        <input
                          type="text"
                          required
                          value={newPostalCode}
                          onChange={(e) => setNewPostalCode(e.target.value)}
                          placeholder="contoh: 10110"
                          className="w-full text-xs font-geist p-3 border border-[#c1c8c2]/50 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="py-3 border border-[#c1c8c2] text-[#414944] font-black text-xs rounded-xl hover:bg-[#f6f3f2] transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="py-3 bg-[#002d1c] text-white font-black text-xs rounded-xl hover:opacity-90 transition-colors cursor-pointer"
                      >
                        Simpan Alamat
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Footer */}
              {!isAddingNew && (
                <div className="p-6 border-t border-[#f0edec] bg-[#fcf9f8]">
                  <button
                    onClick={() => setIsAddressModalOpen(false)}
                    className="w-full bg-[#002d1c] text-white font-black text-xs py-3.5 rounded-xl hover:opacity-95 transition-all text-center cursor-pointer"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Log out simulated layout */}
      <div className="flex justify-center mt-2 font-geist">
        <button
          onClick={() => {
            if (setIsLoggedIn) setIsLoggedIn(false);
            alert('Anda telah keluar dari akun.');
            navigate('explore');
          }}
          className="flex items-center gap-2 text-xs font-bold text-[#ba1a1a] hover:opacity-75 transition-opacity cursor-pointer"
        >
          <LogOut size={16} />
          <span>Keluar dari Akun {userProfile?.name || 'Sarah J.'}</span>
        </button>
      </div>
    </div>
  );
};
