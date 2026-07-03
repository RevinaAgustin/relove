/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, ShoppingBag, Truck, Info, ShieldCheck, ArrowRight, Plus, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';

interface CheckoutViewProps {
  product?: Product | null;
  checkoutItems?: { product: Product; quantity: number }[];
  onProceedToPayment: (courier: string, courierFee: number, total: number) => void;
  onGoBack: () => void;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  product,
  checkoutItems,
  onProceedToPayment,
  onGoBack,
}) => {
  const [selectedCourier, setSelectedCourier] = useState('sicepat');

  // Address State Management
  const [addresses, setAddresses] = useState<Address[]>(() => {
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

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const saved = localStorage.getItem('re_love_addresses');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        const def = list.find((addr: Address) => addr.isDefault);
        if (def) return def.id;
        if (list.length > 0) return list[0].id;
      } catch (e) {}
    }
    return 'addr-1';
  });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Address Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');

  const activeAddress = addresses.find((addr) => addr.id === selectedAddressId) || addresses[0] || {
    id: 'placeholder',
    name: 'Belum Ada Alamat',
    phone: '',
    fullAddress: 'Silakan tambahkan alamat pengiriman baru di menu ubah alamat.',
    city: '',
    postalCode: ''
  };

  const couriers = [
    { id: 'sicepat', name: 'SiCepat REG', fee: 15000, estimate: '2-3 hari' },
    { id: 'jne', name: 'JNE Reguler', fee: 16000, estimate: '2-3 hari' },
    { id: 'jnt', name: 'J&T Express', fee: 18000, estimate: '1-2 hari' },
  ];

  const activeCourier = couriers.find((c) => c.id === selectedCourier) || couriers[0];
  const serviceFee = 2500;

  // Convert single product or multiple checkout items to common array
  const items = product
    ? [{ product, quantity: 1 }]
    : (checkoutItems || []);

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const itemsSubtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalAmount = itemsSubtotal + activeCourier.fee + serviceFee;

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newFullAddress || !newCity || !newPostalCode) {
      alert('Mohon isi semua data alamat baru Anda.');
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      name: newName,
      phone: newPhone,
      fullAddress: newFullAddress,
      city: newCity,
      postalCode: newPostalCode,
      isDefault: false,
    };

    const updated = [...addresses, newAddr];
    setAddresses(updated);
    localStorage.setItem('re_love_addresses', JSON.stringify(updated));
    setSelectedAddressId(newAddr.id);
    
    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewFullAddress('');
    setNewCity('');
    setNewPostalCode('');
    setIsAddingNew(false);
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header breadcrumb */}
      <div>
        <button
          onClick={onGoBack}
          className="text-xs font-geist text-[#414944] hover:text-[#002d1c] mb-2 transition-colors cursor-pointer"
        >
          &larr; Kembali
        </button>
        <h2 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">Checkout</h2>
        <p className="font-body text-sm text-[#414944] mt-1.5">Selesaikan pesanan Anda untuk melestarikan industri fashion sirkular.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap relative">
        {/* Left Column: Alamat & Core checkout options */}
        <div className="lg:col-span-8 flex flex-col gap-bento-gap">
          {/* 1. Alamat Pengiriman */}
          <section className="bg-white rounded-[24px] p-6 md:p-8 border border-[#c1c8c2]/35 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3 text-[#002d1c]">
                <MapPin className="fill-current text-[#002d1c]" size={20} />
                <h3 className="font-display text-lg font-bold">Alamat Pengiriman</h3>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="w-full sm:w-auto text-center text-xs font-geist font-black text-[#002d1c] bg-[#002d1c]/5 hover:bg-[#002d1c]/10 px-4 py-2 rounded-full transition-colors border border-transparent cursor-pointer"
              >
                Ubah Alamat
              </button>
            </div>
            <div className="pl-8 font-geist text-xs">
              <p className="font-semibold text-[#1c1b1b] text-sm">
                {activeAddress.name} <span className="text-[#414944] font-normal">| {activeAddress.phone}</span>
              </p>
              <p className="text-[#414944] leading-relaxed mt-2 max-w-lg">
                {activeAddress.fullAddress}.<br />
                {activeAddress.city}, {activeAddress.postalCode}
              </p>
            </div>
          </section>

          {/* 2. Ringkasan Produk */}
          <section className="bg-white rounded-[24px] p-6 md:p-8 border border-[#c1c8c2]/35 shadow-sm">
            <div className="flex items-center gap-3 text-[#002d1c] mb-6">
              <ShoppingBag className="text-[#002d1c]" size={20} />
              <h3 className="font-display text-lg font-bold">Ringkasan Produk ({totalItemsCount} Barang)</h3>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex flex-col sm:flex-row gap-6 p-4 rounded-[16px] bg-[#fcf9f8] border border-[#c1c8c2]/20 shadow-inner"
                >
                  <div className="w-24 h-24 flex-shrink-0 bg-[#ebe7e7] rounded-xl overflow-hidden border border-black/5 mx-auto sm:mx-0">
                    <img
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      src={item.product.imagePrimary}
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow font-geist min-w-0">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#1c1b1b] line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-[#414944]/70 uppercase tracking-widest font-black mt-1">BRAND: {item.product.brand}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-block bg-[#e5e2e1] text-[#1c1b1b] text-[10px] px-3 py-1 rounded-full">
                          Ukuran: {item.product.size}
                        </span>
                        <span className="inline-block bg-[#002d1c]/10 text-[#002d1c] text-[10px] px-3 py-1 rounded-full font-bold">
                          Jumlah: {item.quantity}x
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right mt-3">
                      <span className="text-sm text-[#002d1c] font-black">
                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Pilih Kurir */}
          <section className="bg-white rounded-[24px] p-6 md:p-8 border border-[#c1c8c2]/35 shadow-sm">
            <div className="flex items-center gap-3 text-[#002d1c] mb-6">
              <Truck size={20} />
              <h3 className="font-display text-lg font-bold">Pilih Kurir</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {couriers.map((c) => (
                <label
                  key={c.id}
                  onClick={() => setSelectedCourier(c.id)}
                  className={`relative flex flex-col p-5 cursor-pointer rounded-[16px] border-2 transition-all ${
                    selectedCourier === c.id
                      ? 'border-[#002d1c] bg-[#1a4331]/5'
                      : 'border-[#c1c8c2]/40 hover:border-[#002d1c]/50 bg-white'
                  }`}
                >
                  <input
                    className="sr-only"
                    name="courier"
                    type="radio"
                    checked={selectedCourier === c.id}
                    onChange={() => setSelectedCourier(c.id)}
                  />
                  <div className="flex justify-between items-center mb-3 font-geist">
                    <span className="text-xs font-bold text-[#1c1b1b]">{c.name}</span>
                    {selectedCourier === c.id && (
                      <span className="w-2.5 h-2.5 bg-[#002d1c] rounded-full"></span>
                    )}
                  </div>
                  <p className="font-geist text-sm text-[#002d1c] font-black">Rp {c.fee.toLocaleString('id-ID')}</p>
                  <p className="font-geist text-[10px] text-[#414944] mt-4">Est. {c.estimate}</p>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Calculations & Total Payment Information */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 flex flex-col gap-6">

            {/* Guarantee Payment Label */}
            <div className="bg-[#1a4331] text-white rounded-[24px] p-6 border-b border-[#002d1c] shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#002d1c] opacity-20 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex gap-3.5 items-start">
                <ShieldCheck size={24} className="text-[#c0edd3] flex-shrink-0" />
                <div>
                  <h4 className="font-geist font-black text-xs text-[#c0edd3]">Proteksi Transaksi RE-LOVE</h4>
                  <p className="font-geist text-[11px] text-[#ebe7e7] leading-relaxed mt-1">
                    Dana ditahan di sistem penengah RE-LOVE. Penjual baru akan dikirimi saldo setelah kondisi paket disetujui oleh Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Calculations Summary Info */}
            <section className="bg-white rounded-[24px] p-6 border border-[#c1c8c2]/35 shadow-sm font-geist">
              <h3 className="font-display text-[#002d1c] text-lg font-bold mb-6">Ringkasan Belanja</h3>

              <div className="space-y-4 text-xs text-[#414944]">
                <div className="flex justify-between">
                  <span>Harga Produk ({totalItemsCount} barang)</span>
                  <span className="text-[#1c1b1b] font-medium">Rp {itemsSubtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Pengiriman</span>
                  <span className="text-[#1c1b1b] font-medium">Rp {activeCourier.fee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Biaya Layanan RE-LOVE
                    <Info size={12} className="text-[#414944]/70 cursor-help" />
                  </span>
                  <span className="text-[#1c1b1b] font-medium">Rp {serviceFee.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="my-5 border-t border-[#c1c8c2]/20 border-dashed"></div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="text-[#1c1b1b] font-bold text-xs">Total Tagihan</span>
                <span className="text-xl font-black text-[#002d1c]">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Pay trigger Button */}
              <button
                onClick={() => onProceedToPayment(activeCourier.name, activeCourier.fee, totalAmount)}
                className="w-full bg-[#002d1c] text-white hover:opacity-95 text-xs py-4 rounded-[16px] font-black flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight size={14} className="text-[#c0edd3]" />
              </button>

              <p className="text-[10px] text-center text-[#414944]/55 mt-4 leading-relaxed">
                Dengan melanjutkan, Anda menyetujui Ketentuan Layanan & Karbon RE-LOVE.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Address Selector / Change Address Modal */}
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
                <h3 className="font-display font-black text-[#002d1c] text-lg">Alamat Pengiriman Saya</h3>
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
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {!isAddingNew ? (
                  <>
                    {/* List existing addresses */}
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-3 relative ${
                            selectedAddressId === addr.id
                              ? 'border-[#002d1c] bg-[#1a4331]/5'
                              : 'border-[#c1c8c2]/30 hover:border-[#002d1c]/40 bg-white'
                          }`}
                        >
                          <div className="mt-1 shrink-0">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedAddressId === addr.id ? 'border-[#002d1c] bg-[#002d1c]' : 'border-[#c1c8c2]'
                            }`}>
                              {selectedAddressId === addr.id && (
                                <Check size={10} className="text-white stroke-[3.5]" />
                              )}
                            </div>
                          </div>
                          
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#1c1b1b]">{addr.name}</span>
                              {addr.isDefault && (
                                <span className="text-[9px] bg-[#002d1c]/10 text-[#002d1c] font-black px-1.5 py-0.5 rounded uppercase">Default</span>
                              )}
                            </div>
                            <p className="text-[#414944]/80 font-mono text-[11px]">{addr.phone}</p>
                            <p className="text-[#414944] leading-relaxed mt-1 pr-6">{addr.fullAddress}</p>
                            <p className="text-[#1c1b1b] font-medium mt-0.5">{addr.city}, {addr.postalCode}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Trigger for Adding New */}
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="w-full py-3.5 border-2 border-dashed border-[#c1c8c2] hover:border-[#002d1c] text-[#002d1c] font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-[#1a4331]/5 cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Tambah Alamat Baru</span>
                    </button>
                  </>
                ) : (
                  /* Form to add new address */
                  <form onSubmit={handleAddNewAddress} className="space-y-4">
                    <div className="flex items-center justify-between pb-1 border-b border-[#f0edec]">
                      <h4 className="font-display font-black text-xs text-[#002d1c] uppercase tracking-wider">Formulir Alamat Baru</h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="text-xs font-bold text-[#414944] hover:text-[#002d1c] cursor-pointer"
                      >
                        Kembali ke Daftar
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
                        placeholder="contoh: Budi Santoso"
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
                        placeholder="contoh: (+62) 812-3456-7890"
                        className="w-full text-xs font-geist p-3 border border-[#c1c8c2]/50 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none"
                      />
                    </div>

                    {/* Full Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#414944]/80">Alamat Lengkap (Jalan, No, Apartemen/Blok)</label>
                      <textarea
                        required
                        rows={3}
                        value={newFullAddress}
                        onChange={(e) => setNewFullAddress(e.target.value)}
                        placeholder="contoh: Jl. Gatot Subroto No. 12, Kel. Karet, Kec. Setiabudi"
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
                          placeholder="contoh: Jakarta Selatan"
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
                          placeholder="contoh: 12930"
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
                        Simpan & Gunakan
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
                    Gunakan Alamat Terpilih
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

