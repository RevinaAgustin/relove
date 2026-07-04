/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Heart, ShoppingBag, User, PlusCircle, ArrowLeftRight, Bell, MessageSquare, LogIn } from 'lucide-react';
import { Screen } from '../../types';

const WANITA_COLUMNS = [
  {
    title: 'BAJU',
    items: ['T-shirts', 'Kemeja', 'Blouses', 'Cardigans', 'Crop tops', 'Sweater', 'Hoodies', 'Bottoms', 'Dress', 'Skirts', 'Mini skirts', 'Jaket', 'Blazers']
  },
  {
    title: 'TAS',
    items: ['Handbags', 'Shoulder bags', 'Crossbody bags', 'Tote bags', 'Backpacks', 'Tas dompet']
  },
  {
    title: 'SEPATU',
    items: ['Sneakers', 'Heels', 'Boots', 'Sandals & slides', 'Loafers', 'Platforms', 'Flats', 'Wedges']
  },
  {
    title: 'ACCESSORIES',
    items: ['Belts', 'Hats', 'Dompet', 'Jewellery', 'Sunglasses', 'Watches', 'Scarves']
  }
];

const PRIA_COLUMNS = [
  {
    title: 'BAJU',
    items: ['Kaos', 'Kemeja', 'Polo', 'Sweater', 'Cardigans', 'Hoodies', 'Celana Panjang', 'Celana Pendek', 'Jaket', 'Blazers', 'Coat']
  },
  {
    title: 'TAS',
    items: ['Backpacks', 'Sling bags', 'Briefcases', 'Duffel bags', 'Waist bags', 'Clutch']
  },
  {
    title: 'SEPATU',
    items: ['Sneakers', 'Boots', 'Loafers', 'Oxford', 'Sandals', 'Slip-on', 'Athletic']
  },
  {
    title: 'ACCESSORIES',
    items: ['Belts', 'Hats', 'Watches', 'Sunglasses', 'Ties', 'Wallets', 'Socks']
  }
];

const ANAK_COLUMNS = [
  {
    title: 'BAJU ANAK',
    items: ['Kaos', 'Kemeja', 'Dress', 'Celana', 'Jaket', 'Sweater', 'Piyama', 'Seragam', 'Setelan']
  },
  {
    title: 'SEPATU ANAK',
    items: ['Sneakers', 'Sandals', 'Flats', 'Boots', 'School Shoes', 'Sports Shoes']
  },
  {
    title: 'AKSESORIS & TAS',
    items: ['Tas Sekolah', 'Topi', 'Kaos Kaki', 'Ikat Rambut', 'Kacamata', 'Jam Tangan']
  }
];

interface HeaderProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  userMode: 'buyer' | 'seller';
  setUserMode: (mode: 'buyer' | 'seller') => void;
  cartCount: number;
  wishlistCount: number;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoggedIn?: boolean;
  setIsLoggedIn?: (val: boolean) => void;
  onOpenWishlistDrawer?: () => void;
  onOpenCartDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  navigate,
  userMode,
  setUserMode,
  cartCount,
  wishlistCount,
  selectedGender,
  setSelectedGender,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  isLoggedIn = false,
  setIsLoggedIn,
  onOpenWishlistDrawer,
  onOpenCartDrawer,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'wanita' | 'pria' | 'anak' | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: 'wanita' | 'pria' | 'anak') => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleUserMode = () => {
    if (userMode === 'buyer') {
      setUserMode('seller');
      navigate('seller-dashboard');
    } else {
      setUserMode('buyer');
      navigate('explore');
    }
  };

  const isTransactional = ['checkout', 'payment', 'create-listing-info', 'create-listing-photo', 'create-listing-price', 'create-listing-review'].includes(currentScreen);

  if (isTransactional) {
    // Transactional minimalist header to keep focus
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#f0edec] px-4 md:px-16 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (currentScreen === 'checkout') navigate('product-detail');
              else if (currentScreen === 'payment') navigate('explore');
              else if (currentScreen.startsWith('create-listing-')) {
                if (currentScreen === 'create-listing-info') navigate('profile');
                else if (currentScreen === 'create-listing-photo') navigate('create-listing-info');
                else if (currentScreen === 'create-listing-price') navigate('create-listing-photo');
                else if (currentScreen === 'create-listing-review') navigate('create-listing-price');
              } else {
                navigate('explore');
              }
            }}
            aria-label="Kembali"
            className="text-[#414944] hover:text-[#002d1c] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f6f3f2]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span 
            onClick={() => navigate('explore')}
            className="font-display text-2xl font-extrabold tracking-tighter text-[#002d1c] cursor-pointer"
          >
            RE-LOVE
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-geist text-[#414944]">
          </div>
        </div>
      </header>
    );
  }

  const handleItemClick = (gender: string, subCategory: string) => {
    setSelectedGender(gender);
    setSearchTerm(subCategory);
    setSelectedCategory('Semua');
    setActiveDropdown(null);
    navigate('catalog');
  };

  const handleGenderClick = (gender: 'Wanita' | 'Pria' | 'Anak-anak') => {
    setSelectedGender(gender);
    setSearchTerm('');
    if (gender === 'Wanita') {
      setSelectedCategory('Pakaian Wanita');
    } else if (gender === 'Pria') {
      setSelectedCategory('Pakaian Pria');
    } else {
      setSelectedCategory('Semua');
    }
    setActiveDropdown(null);
    navigate('catalog');
  };

  const renderDropdownContent = () => {
    if (!activeDropdown) return null;
    
    let columns = WANITA_COLUMNS;
    let genderLabel = 'Wanita';
    if (activeDropdown === 'pria') {
      columns = PRIA_COLUMNS;
      genderLabel = 'Pria';
    } else if (activeDropdown === 'anak') {
      columns = ANAK_COLUMNS;
      genderLabel = 'Anak-anak';
    }

    return (
      <div 
        className="absolute top-[calc(100%-8px)] left-0 right-0 bg-white rounded-[32px] border border-black/5 shadow-2xl p-8 z-50 font-geist"
        style={{ width: '100%' }}
        onMouseEnter={() => {
          if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        }}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`grid gap-8 ${activeDropdown === 'anak' ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {columns.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h4 className="text-[11px] font-bold text-[#002d1c] tracking-wider uppercase border-b border-[#f0edec] pb-1.5">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-1.5 text-left">
                {col.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleItemClick(genderLabel, item)}
                      className="text-xs text-[#414944] hover:text-[#002d1c] hover:font-bold transition-all text-left w-full block py-0.5"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav 
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1280px] rounded-full bg-white/90 backdrop-blur-xl border border-black/5 shadow-sm z-50 flex justify-between items-center px-6 md:px-10 py-3 transition-all duration-300"
      onMouseLeave={handleMouseLeave}
    >
      <div 
        onClick={() => {
          setActiveDropdown(null);
          navigate('explore');
        }}
        className="font-display text-2xl font-extrabold tracking-tighter text-[#002d1c] cursor-pointer active:scale-95 transition-transform"
        onMouseEnter={() => setActiveDropdown(null)}
      >
        RE-LOVE
      </div>

      <div className="hidden md:flex gap-8 items-center h-full">
        <div 
          className="relative py-2"
          onMouseEnter={() => handleMouseEnter('wanita')}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            onClick={() => handleGenderClick('Wanita')}
            className={`font-geist text-sm text-[14px] ${selectedGender === 'Wanita' ? 'text-[#002d1c] font-bold underline decoration-2 underline-offset-4' : 'text-[#414944] hover:text-[#002d1c]'} transition-colors`}
          >
            Wanita
          </button>
        </div>

        <div 
          className="relative py-2"
          onMouseEnter={() => handleMouseEnter('pria')}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            onClick={() => handleGenderClick('Pria')}
            className={`font-geist text-sm text-[14px] ${selectedGender === 'Pria' ? 'text-[#002d1c] font-bold underline decoration-2 underline-offset-4' : 'text-[#414944] hover:text-[#002d1c]'} transition-colors`}
          >
            Pria
          </button>
        </div>

        <div 
          className="relative py-2"
          onMouseEnter={() => handleMouseEnter('anak')}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            onClick={() => handleGenderClick('Anak-anak')}
            className={`font-geist text-sm text-[14px] ${selectedGender === 'Anak-anak' ? 'text-[#002d1c] font-bold underline decoration-2 underline-offset-4' : 'text-[#414944] hover:text-[#002d1c]'} transition-colors`}
          >
            Anak-anak
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3" onMouseEnter={() => {
        // Close dropdown when entering the right hand actions container
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setActiveDropdown(null);
      }}>
        <button 
          onClick={() => {
            if (isLoggedIn) {
              navigate('messages');
            } else {
              alert('Silakan masuk ke akun Anda terlebih dahulu untuk melihat pesan.');
              navigate('login');
            }
          }}
          className="p-2 text-[#414944] hover:text-[#002d1c] transition-colors relative"
          title="Pesan / Chat"
        >
          <MessageSquare size={20} />
          <span className="absolute top-1.5 right-1.5 bg-[#3e6752] w-2 h-2 rounded-full animate-pulse"></span>
        </button>

        <button 
          onClick={() => {
            if (onOpenWishlistDrawer) {
              onOpenWishlistDrawer();
            } else {
              navigate('profile');
            }
          }}
          className="p-2 text-[#414944] hover:text-[#002d1c] transition-colors relative"
          title="Wishlist"
        >
          <Heart size={20} className={wishlistCount > 0 ? "fill-red-500 text-red-500" : ""} />
          {wishlistCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
              {wishlistCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => {
            if (onOpenCartDrawer) {
              onOpenCartDrawer();
            } else {
              navigate('profile');
            }
          }}
          className="p-2 text-[#414944] hover:text-[#002d1c] transition-colors relative"
          title="My Bag"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#3e6752] text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>

        {isLoggedIn ? (
          <>
            <button 
              onClick={() => navigate('profile')}
              className="p-2 text-[#414944] hover:text-[#002d1c] transition-colors flex items-center justify-center relative"
              title="Account Profile"
            >
              <div className="w-8 h-8 rounded-full border-2 border-[#1a4331] overflow-hidden bg-[#e5e2e1] flex items-center justify-center">
                <img
                  alt="Sarah J. Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOp2IWcbJj0WSBYUi9ScAhNe_jVNFSJrwvrH_iuZjBFJcvwzitf49Ul4GBxTD-Sa3acz2JRcH91HhhA9bjMBx5c_Xi_BgwFmf1j0AU56trzUu_iSxVtifVayiCz5_ELhoo_0az3lfkhPmfJmPsLhUTnV0qFrItiZ7yxaJlDTWG2AWZBhskCnqWEkcIWjPoCVLfSYj8fl9WVgywiwKIbx2n6WMsnQXFCBLOE8lXOnpfstrxZsgJIhXR-SuzI-scHKvwnG2GUOswM6LH"
                />
              </div>
            </button>

            <button 
              onClick={() => navigate('create-listing-info')}
              className="hidden sm:flex bg-[#002d1c] text-white px-5 py-2 rounded-full font-geist text-xs hover:opacity-90 transition-all items-center gap-1.5 active:scale-95 shadow-sm font-black"
            >
              <PlusCircle size={14} className="text-[#a4d0b8]" />
              <span>Mulai Jual</span>
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('login')}
            className="p-2 text-[#414944] hover:text-[#002d1c] transition-colors relative"
            title="Masuk / Daftar"
          >
            <LogIn size={20} />
          </button>
        )}
      </div>

      {renderDropdownContent()}
    </nav>
  );
};
