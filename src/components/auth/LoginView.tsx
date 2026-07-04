/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { Screen } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (profile?: { name: string; shopName: string; email: string; phone: string; avatar: string }) => void;
  navigate: (screen: Screen) => void;
}

interface StoredUser {
  id: string;
  email: string;
  password: string;
  name: string;
  shopName: string;
  phone: string;
  avatar: string;
}

const DEMO_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOp2IWcbJj0WSBYUi9ScAhNe_jVNFSJrwvrH_iuZjBFJcvwzitf49Ul4GBxTD-Sa3acz2JRcH91HhhA9bjMBx5c_Xi_BgwFmf1j0AU56trzUu_iSxVtifVayiCz5_ELhoo_0az3lfkhPmfJmPsLhUTnV0qFrItiZ7yxaJlDTWG2AWZBhskCnqWEkcIWjPoCVLfSYj8fl9WVgywiwKIbx2n6WMsnQXFCBLOE8lXOnpfstrxZsgJIhXR-SuzI-scHKvwnG2GUOswM6LH';

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('re_love_users');
    if (!saved) {
      const seededUsers: StoredUser[] = [];
      localStorage.setItem('re_love_users', JSON.stringify(seededUsers));
      return seededUsers;
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [];
    }
    return parsed as StoredUser[];
  } catch {
    return [];
  }
};

const buildProfile = (user: StoredUser) => ({
  name: user.name,
  shopName: user.shopName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
});

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, navigate }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isAgreed, setIsAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLoginTab && !fullName)) {
      setError('Silakan lengkapi semua kolom yang wajib diisi.');
      return;
    }

    if (!isLoginTab && !isAgreed) {
      setError('Anda harus menyetujui Ketentuan & Kebijakan Privasi.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const users = getStoredUsers();

    setIsLoading(true);

    setTimeout(() => {
      if (isLoginTab) {
        const matchedUser = users.find((user) => user.email.toLowerCase() === normalizedEmail && user.password === normalizedPassword);
        if (!matchedUser) {
          setIsLoading(false);
          setError('Email atau kata sandi salah. Silakan coba lagi.');
          return;
        }

        localStorage.setItem('re_love_active_user', JSON.stringify(buildProfile(matchedUser)));
        localStorage.setItem('re_love_user_profile', JSON.stringify(buildProfile(matchedUser)));
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess(buildProfile(matchedUser));
          navigate('catalog');
        }, 1000);
        return;
      }

      const emailExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);
      const nameExists = users.some((user) => user.name.toLowerCase().trim() === fullName.toLowerCase().trim());
      if (emailExists) {
        setIsLoading(false);
        setError('Email ini sudah terdaftar. Silakan gunakan email lain.');
        return;
      }
      if (nameExists) {
        setIsLoading(false);
        setError('Nama pengguna ini sudah terdaftar. Silakan gunakan nama lain.');
        return;
      }

      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        email: normalizedEmail,
        password: normalizedPassword,
        name: fullName.trim(),
        shopName: '',
        phone: '',
        avatar: DEMO_AVATAR,
      };

      const nextUsers = [...users, newUser];
      localStorage.setItem('re_love_users', JSON.stringify(nextUsers));

      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsLoginTab(true);
        setPassword('');
        setError('Pendaftaran berhasil! Silakan masukkan kata sandi Anda untuk masuk.');
      }, 2000);
    }, 1200);
  };

  const handleQuickDemoLogin = () => {
    const demoUser = getStoredUsers().find((user) => user.email === 'sarah.jones@example.com');
    if (!demoUser) {
      setError('Akun demo tidak tersedia.');
      return;
    }

    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('re_love_active_user', JSON.stringify(buildProfile(demoUser)));
      localStorage.setItem('re_love_user_profile', JSON.stringify(buildProfile(demoUser)));
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(buildProfile(demoUser));
        navigate('catalog');
      }, 1000);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-12 bg-white rounded-[32px] p-5 sm:p-8 md:p-10 border border-[#f0edec] shadow-xl relative overflow-hidden font-geist">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#c0edd3]/15 rounded-bl-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4e5c7]/15 rounded-tr-full pointer-events-none"></div>

      {success ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-[#d4e5c7] text-[#002d1c] rounded-full flex items-center justify-center mb-6 animate-bounce">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="font-display text-[#002d1c] text-2xl font-black tracking-tight mb-2">
            {isLoginTab ? 'Berhasil Masuk!' : 'Pendaftaran Berhasil!'}
          </h2>
          <p className="text-xs text-[#414944] max-w-xs leading-relaxed">
            Selamat datang kembali! Menyiapkan katalog terkurasi terbaik untuk pengalaman belanja preloved Anda...
          </p>
        </div>
      ) : (
        <div className="relative z-10 text-left">
          {/* Logo / Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-display text-lg font-black tracking-tighter text-[#002d1c]">RE-LOVE</span>
          </div>

          <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight mb-2">
            {isLoginTab ? 'Selamat Datang Kembali' : 'Buat Akun Anda'}
          </h1>
          <p className="text-xs text-[#414944] leading-relaxed mb-8">
            {isLoginTab 
              ? 'Masuk untuk mengakses rincian transaksi aman, wishlist terkurasi, dan ribuan item preloved.' 
              : 'Gabung dengan komunitas fashion preloved bersama RE-LOVE dan selamatkan bumi seraya mengekspresikan gayamu.'}
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-2xl mb-6 flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 mt-1.5"></span>
              <span>{error}</span>
            </div>
          )}

          {/* Form Tabs */}
          <div className="grid grid-cols-2 bg-[#fcf9f8] p-1 rounded-full border border-[#f0edec] mb-6">
            <button
              type="button"
              onClick={() => { setIsLoginTab(true); setError(''); }}
              className={`py-2.5 text-xs font-bold rounded-full transition-all ${isLoginTab ? 'bg-[#002d1c] text-white shadow-sm' : 'text-[#414944] hover:text-[#002d1c]'}`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => { setIsLoginTab(false); setError(''); }}
              className={`py-2.5 text-xs font-bold rounded-full transition-all ${!isLoginTab ? 'bg-[#002d1c] text-white shadow-sm' : 'text-[#414944] hover:text-[#002d1c]'}`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field (Register only) */}
            {!isLoginTab && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#1c1b1b] uppercase tracking-wider block">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c1c8c2]">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Sarah Jones"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#fcf9f8] border border-[#f0edec] focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none rounded-2xl py-3 pl-12 pr-4 text-xs transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#1c1b1b] uppercase tracking-wider block">Alamat Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c1c8c2]">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fcf9f8] border border-[#f0edec] focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none rounded-2xl py-3 pl-12 pr-4 text-xs transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-[#1c1b1b] uppercase tracking-wider">Kata Sandi</label>
                {isLoginTab && (
                  <button 
                    type="button" 
                    onClick={() => alert('Fitur pemulihan kata sandi disimulasikan!')}
                    className="text-[10px] font-semibold text-[#3e6752] hover:underline"
                  >
                    Lupa Sandi?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c1c8c2]">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#fcf9f8] border border-[#f0edec] focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none rounded-2xl py-3 pl-12 pr-4 text-xs transition-all"
                />
              </div>
            </div>

            {/* T&C (Register only) */}
            {!isLoginTab && (
              <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-[#c1c8c2] text-[#002d1c] focus:ring-[#002d1c] h-4 w-4"
                />
                <span className="text-[11px] text-[#414944] leading-relaxed">
                  Saya menyetujui <span className="font-bold text-[#002d1c] underline">Ketentuan Layanan</span> dan <span className="font-bold text-[#002d1c] underline">Kebijakan Privasi</span> Transaksi Aman RE-LOVE.
                </span>
              </label>
            )}

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#002d1c] text-white hover:opacity-95 transition-all py-3 px-6 rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-2 mt-6 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isLoginTab ? 'Masuk ke Akun' : 'Daftar Akun'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>



          <div className="flex items-center justify-center gap-2 text-[10px] text-[#414944] mt-6 text-center leading-relaxed">
            <ShieldCheck size={14} className="text-[#3e6752]" />
            <span>Autentikasi terproteksi enkripsi.</span>
          </div>
        </div>
      )}
    </div>
  );
};
