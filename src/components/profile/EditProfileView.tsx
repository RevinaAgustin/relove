/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Upload, Save, X, Image as ImageIcon } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';

interface EditProfileViewProps {
  userProfile: { name: string; shopName: string; email: string; phone: string; avatar: string };
  onUpdateProfile: (updated: any) => void;
  onGoBack: () => void;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onGoBack,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [shopName, setShopName] = useState(userProfile.shopName);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [avatar, setAvatar] = useState(userProfile.avatar);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        alert('Hanya diperbolehkan berkas foto PNG atau JPG!');
        return;
      }
      // Maximum file size limit of 2MB to prevent localStorage overflow
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar! Maksimal ukuran file adalah 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shopName.trim() || !email.trim() || !phone.trim()) {
      alert('Nama, Nama Toko, Email, dan Nomor Telepon wajib diisi!');
      return;
    }
    onUpdateProfile({
      name: name.trim(),
      shopName: shopName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar: avatar,
    });
    alert('Profil dan Informasi Toko berhasil diperbarui!');
    onGoBack();
  };

  const breadcrumbItems = [
    { label: 'Profil Saya', onClick: onGoBack },
    { label: 'Edit Profil' }
  ];

  return (
    <div className="flex flex-col gap-6 py-4 max-w-[600px] mx-auto w-full font-geist text-left">
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
          <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">Edit Profil</h1>
          <p className="text-xs text-[#414944] mt-0.5">Ubah informasi akun dan detail toko circular Anda.</p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[28px] border border-[#f0edec] p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Profile Picture Uploader */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#f0edec]">
          <div className="w-24 h-24 rounded-[24px] overflow-hidden border-2 border-[#002d1c]/20 bg-neutral-50 shadow-inner flex-shrink-0 relative group">
            <img
              src={avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOp2IWcbJj0WSBYUi9ScAhNe_jVNFSJrwvrH_iuZjBFJcvwzitf49Ul4GBxTD-Sa3acz2JRcH91HhhA9bjMBx5c_Xi_BgwFmf1j0AU56trzUu_iSxVtifVayiCz5_ELhoo_0az3lfkhPmfJmPsLhUTnV0qFrItiZ7yxaJlDTWG2AWZBhskCnqWEkcIWjPoCVLfSYj8fl9WVgywiwKIbx2n6WMsnQXFCBLOE8lXOnpfstrxZsgJIhXR-SuzI-scHKvwnG2GUOswM6LH'}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
            {avatar && (
              <button
                type="button"
                onClick={() => setAvatar('')}
                className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
                title="Hapus foto"
              >
                <X size={10} />
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <span className="text-xs font-black text-[#002d1c] uppercase tracking-wider">Foto Profil (PNG/JPG)</span>
            <p className="text-[10px] text-[#414944] leading-relaxed max-w-[280px]">
              Ukuran file maksimal adalah 2MB.
            </p>
            <label className="mt-2 inline-flex items-center justify-center gap-2 bg-[#f0edec] hover:bg-[#ebe7e7] text-[#1c1b1b] px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer w-fit mx-auto sm:mx-0">
              <Upload size={14} className="text-[#002d1c]" />
              <span>Pilih Berkas Foto</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-[#002d1c] tracking-wider" htmlFor="input-name">
              Nama Lengkap / Akun *
            </label>
            <input
              id="input-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full text-xs font-geist p-3.5 border border-[#c1c8c2]/55 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none font-medium bg-[#fcf9f8]"
            />
          </div>

          {/* Shop Name */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-[#002d1c] tracking-wider" htmlFor="input-shop">
              Nama Toko Circular *
            </label>
            <input
              id="input-shop"
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Masukkan nama toko jualan Anda"
              className="w-full text-xs font-geist p-3.5 border border-[#c1c8c2]/55 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none font-medium bg-[#fcf9f8]"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-[#002d1c] tracking-wider" htmlFor="input-email">
              Alamat Email *
            </label>
            <input
              id="input-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: budi@relove.com"
              className="w-full text-xs font-geist p-3.5 border border-[#c1c8c2]/55 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none font-medium bg-[#fcf9f8]"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black text-[#002d1c] tracking-wider" htmlFor="input-phone">
              Nomor Telepon / WhatsApp *
            </label>
            <input
              id="input-phone"
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="contoh: +62 812-3456-7890"
              className="w-full text-xs font-geist p-3.5 border border-[#c1c8c2]/55 rounded-xl focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none font-medium bg-[#fcf9f8]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#f0edec]">
          <button
            type="button"
            onClick={onGoBack}
            className="py-3.5 border border-[#c1c8c2] text-[#414944] font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#f6f3f2] transition-colors cursor-pointer text-center"
          >
            Batal
          </button>
          <button
            type="submit"
            className="py-3.5 bg-[#002d1c] text-white font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-colors cursor-pointer text-center shadow-md flex items-center justify-center gap-1.5"
          >
            <Save size={14} />
            <span>Simpan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
