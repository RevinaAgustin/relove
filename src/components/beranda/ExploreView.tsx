/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, CheckCircle2, ShieldCheck, Heart, Star, Sparkles } from 'lucide-react';
import { Product, Screen } from '../../types';

interface ExploreViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  navigate: (screen: Screen) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoggedIn?: boolean;
  setIsLoggedIn?: (val: boolean) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  products,
  onSelectProduct,
  navigate,
  wishlist,
  toggleWishlist,
  selectedGender,
  setSelectedGender,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  isLoggedIn = false,
  setIsLoggedIn,
}) => {
  const [clothingCount, setClothingCount] = useState(1);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const calculateWaterSavings = (count: number) => count * 2700;
  const calculateCo2Savings = (count: number) => count * 15;

  // Typing effect state for Hero Title
  const [typedTitle1, setTypedTitle1] = useState('');
  const [typedTitle2, setTypedTitle2] = useState('');
  const [showCaret1, setShowCaret1] = useState(true);
  const [showCaret2, setShowCaret2] = useState(false);

  useEffect(() => {
    const fullText1 = 'Gaya Baru,';
    const fullText2 = 'Dampak Baru.';
    
    let timer1: any;
    let timer2: any;
    
    let i = 0;
    const type1 = () => {
      if (i <= fullText1.length) {
        setTypedTitle1(fullText1.slice(0, i));
        i++;
        timer1 = setTimeout(type1, 70);
      } else {
        setShowCaret1(false);
        setShowCaret2(true);
        let j = 0;
        const type2 = () => {
          if (j <= fullText2.length) {
            setTypedTitle2(fullText2.slice(0, j));
            j++;
            timer2 = setTimeout(type2, 70);
          } else {
            // Keep status but let caret fade or stop after completion
            timer2 = setTimeout(() => setShowCaret2(false), 2500);
          }
        };
        type2();
      }
    };
    
    const startTimeout = setTimeout(type1, 200);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const categories = ['Semua', 'Pakaian Pria', 'Pakaian Wanita', 'Aksesoris', 'Sepatu', 'Atasan'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'Pakaian Pria' && p.category.includes('Pria')) ||
      (selectedCategory === 'Pakaian Wanita' && p.category.includes('Wanita'));

    const matchesGender =
      selectedGender === 'Semua' ||
      (selectedGender === 'Wanita' && (p.category.toLowerCase().includes('wanita') || p.id === 'gaun-musim-panas' || p.id === 'canvas-tote')) ||
      (selectedGender === 'Pria' && (p.category.toLowerCase().includes('pria') || p.id === 'jaket-denim-vintage' || p.id === 'leather-boots' || p.id === 'sweat-wool')) ||
      (selectedGender === 'Anak-anak' && (p.name.toLowerCase().includes('anak') || p.description.toLowerCase().includes('anak') || p.category.toLowerCase().includes('anak')));

    return matchesSearch && matchesCategory && matchesGender;
  });

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap items-center min-h-[450px]">
        <div className="md:col-span-7 flex flex-col space-y-6 text-left">
          <h1 className="font-display text-5xl md:text-6xl lg:text-[72px] lg:leading-[1.05] font-black text-[#002d1c] tracking-tighter min-h-[140px] md:min-h-[120px] lg:min-h-[160px]">
            <span className="inline-block">{typedTitle1}</span>
            {showCaret1 && (
              <span className="inline-block w-[4px] h-[36px] md:h-[48px] lg:h-[60px] bg-[#002d1c] ml-2 animate-pulse align-middle"></span>
            )}
            <br />
            <span className="inline-block text-[#3e6752]">{typedTitle2}</span>
            {showCaret2 && (
              <span className="inline-block w-[4px] h-[36px] md:h-[48px] lg:h-[60px] bg-[#3e6752] ml-2 animate-pulse align-middle"></span>
            )}
          </h1>
          <p className="font-body text-body-lg text-[#414944] max-w-lg leading-relaxed">
            Temukan pakaian preloved berkualitas yang ramah di kantong. Mulai langkah sirkularmu hari ini!
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => {
                navigate('catalog');
              }}
              className="bg-[#002d1c] text-white px-8 py-4 rounded-full font-geist font-semibold hover:opacity-90 transition-all shadow-md active:scale-95"
            >
              Mulai Beli
            </button>
            <button
              onClick={() => navigate('create-listing-info')}
              className="border-2 border-[#002d1c] text-[#002d1c] px-8 py-4 rounded-full font-geist font-semibold bg-transparent hover:bg-[#002d1c]/5 transition-colors active:scale-95"
            >
              Mulai Jual
            </button>
          </div>
        </div>
        <div className="md:col-span-12 lg:col-span-5 relative h-[450px] hidden md:block">
          {/* Card 1: Vintage Jacket */}
          <div
            onClick={() => onSelectProduct(products[0])}
            className="absolute top-2 right-2 w-52 lg:w-64 xl:w-72 bg-white p-3 lg:p-4 rounded-[24px] shadow-lg rotate-3 z-10 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30 hover:shadow-xl border border-black/5"
          >
            <div className="w-full h-48 lg:h-56 xl:h-64 rounded-xl mb-3 bg-[#f6f3f2] overflow-hidden relative">
              <img
                alt={products[0].name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
                src={products[0].imagePrimary}
              />
              <span className="absolute top-2 left-2 bg-[#002d1c] text-white text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest font-geist shadow-sm">
                Vintage Peak
              </span>
            </div>
            <div className="flex justify-between items-center px-1 font-geist">
              <span className="text-xs lg:text-sm text-[#1c1b1b] font-semibold truncate max-w-[110px] lg:max-w-[170px]">{products[0].name}</span>
              <span className="text-xs lg:text-sm text-[#002d1c] font-black">Rp {products[0].price.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Card 2: Leather Boots (Shoe) */}
          <div
            onClick={() => onSelectProduct(products[1] || products[0])}
            className="absolute bottom-2 left-2 w-48 lg:w-52 xl:w-60 bg-white p-3 lg:p-4 rounded-[24px] shadow-lg -rotate-6 z-20 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30 hover:shadow-xl border border-black/5"
          >
            <div className="w-full h-40 lg:h-44 xl:h-52 rounded-xl mb-3 bg-[#f6f3f2] overflow-hidden relative">
              <img
                alt={products[1]?.name || 'Product'}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
                src={products[1]?.imagePrimary || products[0].imagePrimary}
              />
              <span className="absolute top-2 left-2 bg-[#94442a] text-white text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest font-geist shadow-sm">
                Curated
              </span>
            </div>
            <div className="flex justify-between items-center px-1 font-geist">
              <span className="text-xs lg:text-sm text-[#1c1b1b] font-semibold truncate max-w-[90px] lg:max-w-[130px]">{products[1]?.name || 'Minimalist Item'}</span>
              <span className="text-xs lg:text-sm text-[#002d1c] font-bold">Rp {(products[1]?.price || 350000).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Search & Browse Redirection */}
      <section className="-mt-8" id="quick-browse">
        <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-6 text-center">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              navigate('catalog');
            }}
            className="relative"
          >
            <input
              className="w-full h-16 pl-14 pr-6 rounded-full bg-white border border-[#c1c8c2] focus:border-[#002d1c] focus:ring-4 focus:ring-[#002d1c]/5 font-body text-body-md shadow-sm outline-none transition-all placeholder:text-[#414944]/55 font-geist"
              placeholder="Cari jaket, sepatu, kemeja, atau brand impian Anda..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute left-5 top-1/2 -translate-y-1/2 text-[#414944]">
              <Search size={20} />
            </button>
          </form>

          {/* Quick Category Suggestions */}
        </div>
      </section>

      {/* 3. Produk Terbaru Preview Grid (Showing exactly 4 items) */}
      <section className="mt-4">
        <div className="flex justify-between items-end mb-8 text-left">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight mt-1">Produk Terbaru Bulan Ini</h2>
            <p className="text-xs text-[#414944] font-geist">Koleksi pakaian preloved terbaru saat ini!</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('Semua');
              setSelectedGender('Semua');
              setSearchTerm('');
              navigate('catalog');
            }}
            className="font-geist text-xs text-[#002d1c] hover:underline cursor-pointer flex items-[#002d1c] gap-1 items-center font-bold bg-transparent border-0"
          >
            Lihat Seluruh Katalog <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(2, 6).map((p) => {
            const isFav = wishlist.includes(p.id);
            return (
              <div key={p.id} className="group cursor-pointer relative flex flex-col">
                {/* Photo Inclosure */}
                <div className="aspect-[3/4] overflow-hidden rounded-[24px] mb-4 bg-[#f0edec] relative border border-black/5">
                  {/* Primary Image */}
                  <img
                    onClick={() => onSelectProduct(p)}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                    src={p.imagePrimary}
                  />
                  
                  {/* Micro Authentication Badge */}
                  {p.isVerified && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 size={12} className="text-[#002d1c] fill-[#c0edd3]" />
                      <span className="text-[9px] font-bold text-[#002d1c] font-geist uppercase tracking-widest">
                        Terverifikasi
                      </span>
                    </div>
                  )}

                  {/* Wishlist triggers */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-[#414944] hover:text-[#ba1a1a] transition-colors"
                  >
                    <Heart size={14} className={isFav ? "fill-red-500 text-red-500" : ""} />
                  </button>
                </div>

                {/* Metadata */}
                <div onClick={() => onSelectProduct(p)} className="flex flex-col flex-grow font-geist text-left">
                  <div className="text-[11px] text-[#414944] uppercase tracking-wider mb-0.5">{p.brand}</div>
                  <h3 className="text-sm font-semibold text-[#1c1b1b] line-clamp-1 group-hover:text-[#002d1c] transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-sm text-[#002d1c] font-black">
                      Rp {p.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-[#414944] bg-[#f0edec] px-2 py-0.5 rounded font-medium">
                      Ukuran {p.size}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Trending Ecostyle Brands Stripe */}
      <section className="py-12 border-y border-[#c1c8c2]/30">
        <p className="font-geist text-[10px] text-center uppercase tracking-widest text-[#414944] mb-8 font-bold">
          Brand Kemitraan
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 text-[#1c1b1b]/55 font-display text-2xl font-bold tracking-tight">
          <span className="hover:text-[#002d1c] transition-colors">Urban Thrift</span>
          <span className="italic font-normal hover:text-[#002d1c] transition-colors">Vintage Core</span>
          <span className="font-black hover:text-[#002d1c] transition-colors">EcoStyle</span>
          <span className="tracking-widest font-geist hover:text-[#002d1c] transition-colors">Nomad Wear</span>
          <span className="underline decoration-2 hover:text-[#002d1c] transition-colors">Common Goods</span>
        </div>
      </section>

      {/* 6. How It Works (Anatomy of secure circular flow) */}
      <section className="py-8 bg-white border border-black/5 rounded-[32px] p-10 shadow-sm flex flex-col gap-12">
        <h2 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight text-center">
          Cara Kerja RE-LOVE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-[#f0edec] rounded-full flex items-center justify-center text-[#002d1c] shadow-sm">
              <Sparkles size={24} />
            </div>
            <h3 className="font-display text-[#1c1b1b] text-lg font-bold">1. Temukan Koleksi Terbaik</h3>
            <p className="font-body text-sm text-[#414944] max-w-xs leading-relaxed">
              Cari fashion preloved terkurasi tinggi, lolos kurasi keaslian, dan diskon hingga 70% dari harga ritel.
            </p>
          </div>
          <div className="text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-[#f0edec] rounded-full flex items-center justify-center text-[#002d1c] shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-display text-lg font-bold">2. Bayar QRIS Aman</h3>
            <p className="font-body text-sm text-[#414944] max-w-xs">
              Bayar instan via QRIS dalam hitungan detik. Dana Anda dijamin aman terproteksi oleh sistem RE-LOVE.
            </p>
          </div>
          <div className="text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-[#f0edec] rounded-full flex items-center justify-center text-[#002d1c] shadow-sm">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-display text-[#1c1b1b] text-lg font-bold">3. Konfirmasi & Nikmati</h3>
            <p className="font-body text-sm text-[#414944] max-w-xs leading-relaxed">
              Barang dikirim terproteksi. Dana baru akan diteruskan ke penjual setelah pembeli mengonfirmasi kepuasan kondisi.
            </p>
          </div>
        </div>
      </section>

{/* 7. SECTION KALKULATOR DAMPAK EKOLOGI (Exquisite organic asymmetrical block) */}
      <section className="bg-[#fcf9f8] rounded-[60px_120px_40px_100px] border border-[#f0edec] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-md relative overflow-hidden mt-12">
        {/* Decorative backdrop elements */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#d4e5c7]/35 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/60 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex-1 flex flex-col items-start gap-5 text-left font-geist relative z-10 max-w-xl">
          <span className="text-[9px] font-black text-[#002d1c] uppercase tracking-widest bg-[#d4e5c7] px-4 py-1.5 rounded-full inline-block">
            Sirkular Impact Calculator
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-[#002d1c] m-0 tracking-tight leading-tight">
            Hitung Kontribusi <br/>
            <span className="text-[#3e6752] italic font-serif">Ekologismu</span> Nyata.
          </h2>
          <p className="text-xs text-[#414944] leading-relaxed">
            Membeli pakaian preloved secara langsung mengurangi penggunaan air bersih baru dan emisi gas karbon dioksida yang dilepaskan industri manufaktur garmen cepat. Sesuaikan jumlah pakaian di bawah ini untuk melihat kontribusi ekologismu!
          </p>

          <div className="w-full mt-6 space-y-3.5">
            <div className="flex justify-between items-center text-xs font-black text-[#1c1b1b] uppercase tracking-wide">
              <span>Jumlah Pakaian Terselamatkan</span>
              <span className="text-[#002d1c] font-mono text-sm bg-white border border-[#f0edec] px-3.5 py-1 rounded-full shadow-xs">
                {clothingCount} pcs
              </span>
            </div>
            
            <div className="relative w-full bg-white p-4 rounded-3xl border border-[#f0edec] shadow-xs">
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={clothingCount} 
                onChange={(e) => setClothingCount(Number(e.target.value))}
                className="w-full h-1.5 cursor-pointer accent-[#002d1c] bg-[#e5e2e1] rounded-lg appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Off-kilter dynamic visual results card */}
        <div 
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
          style={{
            transform: isCardHovered 
              ? 'rotate(0deg) translateY(0px)' 
              : `rotate(${((clothingCount - 1) / 49) * 6}deg) translateY(${((clothingCount - 1) / 49) * 3}px)`,
            transformOrigin: 'left center',
          }}
          className="w-full lg:w-96 flex flex-col gap-6 bg-[#002d1c] text-white p-8 rounded-[40px_20px_50px_20px] shrink-0 font-geist shadow-xl relative z-10 transition-transform duration-300 ease-out border border-[#1a4331]"
        >
          {/* Subtle line background */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/10 pointer-events-none rounded-[40px_20px_50px_20px]"></div>

          <div className="text-left relative z-10">
            <span className="text-[9px] text-[#c0edd3] font-black uppercase tracking-widest block mb-1">Dampak Air Bersih</span>
            <span className="block text-4xl font-display font-black text-[#c0edd3] tracking-tighter">
              {calculateWaterSavings(clothingCount).toLocaleString('id-ID')} L
            </span>
            <p className="text-[10px] text-white/70 mt-1 font-medium leading-relaxed">Air tawar bersih yang berhasil dilestarikan dari proses produksi garmen baru.</p>
          </div>

          <div className="border-t border-white/10 pt-5 text-left relative z-10">
            <span className="text-[9px] text-[#c0edd3] font-black uppercase tracking-widest block mb-1">Dampak Jejak Karbon</span>
            <span className="block text-4xl font-display font-black text-white tracking-tighter">
              {calculateCo2Savings(clothingCount)} Kg
            </span>
            <p className="text-[10px] text-white/70 mt-1 font-medium leading-relaxed">Emisi gas berbahaya CO₂ yang dicegah masuk ke lapisan atmosfer bumi kita.</p>
          </div>

          <div className="text-[9px] text-white/50 italic leading-snug text-left mt-2 border-t border-white/10 pt-4 relative z-10">
            *Rasio dihitung berdasarkan standardisasi global Life Cycle Assessment (LCA) industri tekstil sirkular.
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews & Login Gateway Section */}
      <section className="relative bg-white rounded-[32px] border border-[#f0edec] p-8 md:p-12 shadow-sm overflow-hidden flex flex-col gap-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">
            Review Jujur Para Pembeli Kami
          </h2>
          <p className="text-xs text-[#414944] max-w-md mx-auto">
            Cerita asli dari mereka yang merangkul gaya hidup sirkular modern, ramah lingkungan, dan ekonomis.
          </p>
        </div>

        {/* Masonry / Grid of Testimonials with progressive blur */}
        <div className="relative max-h-[460px] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 (Clear) */}
            <div className="bg-[#fcf9f8] p-6 rounded-[24px] space-y-4 border border-[#f0edec] shadow-sm text-left">
              <div className="flex gap-1 text-[#002d1c]">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className="fill-current text-[#002d1c]" />)}
              </div>
              <p className="font-body text-xs text-[#1c1b1b] leading-relaxed italic">
                "Pengalaman belanja preloved terbaik. Di RE-LOVE aslinya dijamin dan verifikasi detail minus benar-benar akurat sesuai foto!"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#f0edec]">
                <div className="w-9 h-9 rounded-full bg-[#1a4331] text-white flex items-center justify-center font-geist text-xs font-bold shrink-0">
                  SJ
                </div>
                <div>
                  <p className="text-xs font-bold font-geist">Sarah J.</p>
                  <p className="text-[10px] text-[#414944]">Kolektor Vintage • Bandung</p>
                </div>
              </div>
            </div>

            {/* Card 2 (Clear) */}
            <div className="bg-[#fcf9f8] p-6 rounded-[24px] space-y-4 border border-[#f0edec] shadow-sm text-left">
              <div className="flex gap-1 text-[#002d1c]">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className="fill-current text-[#002d1c]" />)}
              </div>
              <p className="font-body text-xs text-[#1c1b1b] leading-relaxed italic">
                "Menjual pakaian desainer saya yang sudah lama tidak dipakai di RE-LOVE sangat mudah dan cepat. Sistem proteksinya aman sekali."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#f0edec]">
                <div className="w-9 h-9 rounded-full bg-[#1a4331] text-white flex items-center justify-center font-geist text-xs font-bold shrink-0">
                  BW
                </div>
                <div>
                  <p className="text-xs font-bold font-geist">Budi W.</p>
                  <p className="text-[10px] text-[#414944]">Fashion Enthusiast • Jakarta</p>
                </div>
              </div>
            </div>

            {/* Card 3 (Clear) */}
            <div className="bg-[#fcf9f8] p-6 rounded-[24px] space-y-4 border border-[#f0edec] shadow-sm text-left">
              <div className="flex gap-1 text-[#002d1c]">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className="fill-current text-[#002d1c]" />)}
              </div>
              <p className="font-body text-xs text-[#1c1b1b] leading-relaxed italic">
                "Bisa tetap tampil super maksimal di skena fashion lokal dengan budget bersahabat seraya melestarikan ekologi bumi."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#f0edec]">
                <div className="w-9 h-9 rounded-full bg-[#1a4331] text-white flex items-center justify-center font-geist text-xs font-bold shrink-0">
                  AR
                </div>
                <div>
                  <p className="text-xs font-bold font-geist">Anisa R.</p>
                  <p className="text-[10px] text-[#414944]">Model & Aktivis Lingkungan</p>
                </div>
              </div>
            </div>

            {/* Card 4 (Slightly Blurred) */}
            <div className="bg-[#fcf9f8] p-6 rounded-[24px] space-y-4 border border-[#f0edec] shadow-sm blur-[1px] text-left">
              <div className="flex gap-1 text-[#002d1c]">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className="fill-current text-[#002d1c]" />)}
              </div>
              <p className="font-body text-xs text-[#1c1b1b] leading-relaxed italic">
                "Gokil sih! Dapet varsity jacket vintage 90s mulus banget. Sellernya ramah & pengiriman cepet karena lolos inspeksi RE-LOVE dulu."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#f0edec]">
                <div className="w-9 h-9 rounded-full bg-[#1a4331] text-white flex items-center justify-center font-geist text-xs font-bold shrink-0">
                  DK
                </div>
                <div>
                  <p className="text-xs font-bold font-geist">Dimas K.</p>
                  <p className="text-[10px] text-[#414944]">Kolektor Heritage • Jogja</p>
                </div>
              </div>
            </div>

            {/* Card 5 (More Blurred) */}
            <div className="bg-[#fcf9f8] p-6 rounded-[24px] space-y-4 border border-[#f0edec] shadow-sm blur-[1.5px] md:blur-[2px] text-left">
              <div className="flex gap-1 text-[#002d1c]">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className="fill-current text-[#002d1c]" />)}
              </div>
              <p className="font-body text-xs text-[#1c1b1b] leading-relaxed italic">
                "Suka banget sama transparansi kondisinya. Ada noda minor dijelasin di deskripsi & di-zoom fotonya. Gak ada tipu-tipu."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#f0edec]">
                <div className="w-9 h-9 rounded-full bg-[#1a4331] text-white flex items-center justify-center font-geist text-xs font-bold shrink-0">
                  CS
                </div>
                <div>
                  <p className="text-xs font-bold font-geist">Clara S.</p>
                  <p className="text-[10px] text-[#414944]">Eco Curator • Surabaya</p>
                </div>
              </div>
            </div>

            {/* Card 6 (Highly Blurred) */}
            <div className="bg-[#fcf9f8] p-6 rounded-[24px] space-y-4 border border-[#f0edec] shadow-sm blur-[3px] md:blur-[4px] text-left">
              <div className="flex gap-1 text-[#002d1c]">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className="fill-current text-[#002d1c]" />)}
              </div>
              <p className="font-body text-xs text-[#1c1b1b] leading-relaxed italic">
                "Sistem Rekber QRIS di sini penyelamat banget buat belanja barang preloved branded biar terhindar dari scammer luar sana."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#f0edec]">
                <div className="w-9 h-9 rounded-full bg-[#1a4331] text-white flex items-center justify-center font-geist text-xs font-bold shrink-0">
                  RA
                </div>
                <div>
                  <p className="text-xs font-bold font-geist">Rizky A.</p>
                  <p className="text-[10px] text-[#414944]">Branded Enthusiast • Medan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Elegant Linear-Gradient Overlay Blur & Backdrop Blur paywall fade */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/85 to-transparent backdrop-blur-[1px] z-10"></div>
        </div>

        {/* Big visual CTA button & micro-text displayed beautifully on top of the blurred component */}
        <div className="relative -mt-16 md:-mt-24 pb-4 z-20 flex flex-col items-center justify-center space-y-4">
          <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[32px] border border-[#f0edec] shadow-xl text-center max-w-md w-full font-geist">
            <span className="text-[10px] font-black uppercase text-[#3e6752] bg-[#c0edd3] px-3.5 py-1 rounded-full mb-3 inline-block">
              {isLoggedIn ? "AKUN SAYA AKTIF" : "GABUNG RE-LOVE SEKARANG"}
            </span>
            <h3 className="text-sm font-extrabold text-[#002d1c] mb-1.5">
              {isLoggedIn 
                ? "Siap Berburu Preloved Mewah?" 
                : "Akses Penuh Koleksi Preloved Eksklusif!"}
            </h3>
            <p className="text-[11px] text-[#414944] leading-relaxed mb-6">
              {isLoggedIn 
                ? "Akun Anda terhubung dengan sukses. Masuk ke katalog produk sirkular dan dapatkan diskon potongan eksklusif hingga 70%!"
                : "Masuk atau daftarkan akun Anda secara gratis untuk melihat harga penuh dan transaksi belanja aman."}
            </p>
            <button
              onClick={() => {
                if (isLoggedIn) {
                  navigate('catalog');
                } else {
                  navigate('login');
                }
              }}
              className="w-full bg-[#002d1c] text-white font-geist text-xs font-black py-3.5 px-8 rounded-full hover:opacity-95 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 hover:gap-3 group"
            >
              <span>{isLoggedIn ? "Beli Sekarang" : "Miliki Sekarang"}</span>
              <svg className="w-4 h-4 text-[#c0edd3] transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
