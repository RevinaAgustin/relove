/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, CheckCircle2, Heart, RefreshCw, ChevronDown, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Product, Screen } from '../../types';

interface CatalogViewProps {
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
}

// Map Indonesian gender label to Category Segment
const genderToSegment: { [key: string]: string } = {
  'Wanita': 'Womens',
  'Pria': 'Mens',
  'Anak-anak': 'Kids',
  'Semua': '',
};

const segmentToGender: { [key: string]: string } = {
  'Womens': 'Wanita',
  'Mens': 'Pria',
  'Kids': 'Anak-anak',
};

interface Subcategory {
  id: string;
  label: string;
  matches: (p: Product) => boolean;
}

interface CategorySegment {
  id: string;
  label: string;
  subcategories: Subcategory[];
}

const CATEGORY_STRUCTURE: CategorySegment[] = [
  {
    id: 'Womens',
    label: 'Womens',
    subcategories: [
      {
        id: 'Footwear',
        label: 'Footwear',
        matches: (p) => p.category.toLowerCase().includes('sepatu') || p.id.includes('boots') || p.name.toLowerCase().includes('sepatu') || p.name.toLowerCase().includes('boots')
      },
      {
        id: 'Dresses',
        label: 'Dresses',
        matches: (p) => p.category.toLowerCase().includes('wanita') || p.id.includes('gaun') || p.name.toLowerCase().includes('dress') || p.name.toLowerCase().includes('gaun')
      },
      {
        id: 'Tops',
        label: 'Tops',
        matches: (p) => (p.category.toLowerCase().includes('atasan') || p.category.toLowerCase().includes('kaos') || p.name.toLowerCase().includes('t-shirt') || p.name.toLowerCase().includes('kemeja') || p.name.toLowerCase().includes('sweater')) && !p.category.toLowerCase().includes('pria')
      },
      {
        id: 'Bottoms',
        label: 'Bottoms',
        matches: (p) => p.category.toLowerCase().includes('celana') || p.category.toLowerCase().includes('rok') || p.name.toLowerCase().includes('celana') || p.name.toLowerCase().includes('jeans') || p.name.toLowerCase().includes('pants')
      },
      {
        id: 'Outerwear',
        label: 'Outerwear',
        matches: (p) => p.category.toLowerCase().includes('jaket') || p.name.toLowerCase().includes('jacket') || p.name.toLowerCase().includes('jaket') || p.name.toLowerCase().includes('coat') || p.name.toLowerCase().includes('sweater')
      }
    ]
  },
  {
    id: 'Mens',
    label: 'Mens',
    subcategories: [
      {
        id: 'Footwear',
        label: 'Footwear',
        matches: (p) => p.category.toLowerCase().includes('sepatu') || p.id.includes('boots') || p.name.toLowerCase().includes('sepatu') || p.name.toLowerCase().includes('boots')
      },
      {
        id: 'Tops',
        label: 'Tops',
        matches: (p) => p.category.toLowerCase().includes('atasan') || p.category.toLowerCase().includes('pria') || p.name.toLowerCase().includes('sweater') || p.name.toLowerCase().includes('t-shirt') || p.name.toLowerCase().includes('kemeja')
      },
      {
        id: 'Bottoms',
        label: 'Bottoms',
        matches: (p) => p.category.toLowerCase().includes('celana') || p.name.toLowerCase().includes('celana') || p.name.toLowerCase().includes('jeans') || p.name.toLowerCase().includes('pants')
      },
      {
        id: 'Outerwear',
        label: 'Outerwear',
        matches: (p) => p.category.toLowerCase().includes('jaket') || p.name.toLowerCase().includes('jacket') || p.name.toLowerCase().includes('jaket') || p.name.toLowerCase().includes('coat') || p.name.toLowerCase().includes('sweater')
      }
    ]
  },
  {
    id: 'Kids',
    label: 'Kids',
    subcategories: [
      {
        id: 'Tops',
        label: 'Tops',
        matches: (p) => p.name.toLowerCase().includes('anak') || p.description.toLowerCase().includes('anak') || p.category.toLowerCase().includes('anak')
      },
      {
        id: 'Bottoms',
        label: 'Bottoms',
        matches: (p) => p.name.toLowerCase().includes('anak') || p.description.toLowerCase().includes('anak') || p.category.toLowerCase().includes('anak')
      },
      {
        id: 'Toys',
        label: 'Toys',
        matches: (p) => p.category.toLowerCase().includes('mainan') || p.name.toLowerCase().includes('mainan') || p.description.toLowerCase().includes('mainan')
      }
    ]
  }
];

export const CatalogView: React.FC<CatalogViewProps> = ({
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
}) => {
  // Available filter options
  const [selectedSize, setSelectedSize] = useState<string>('Semua');
  const [selectedColor, setSelectedColor] = useState<string>('Semua');
  const [selectedBrand, setSelectedBrand] = useState<string>('Semua');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('Semua');
  const [selectedCondition, setSelectedCondition] = useState<string>('Semua');
  const [selectedSort, setSelectedSort] = useState<string>('Terbaru');

  // Track which dropdown is open
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Dynamic Kategori menu segment state
  const [kategoriMenuSegment, setKategoriMenuSegment] = useState<string | null>(null);

  // Sync Kategori dropdown active segment to match the selected tab
  useEffect(() => {
    if (activeDropdown === 'category') {
      const activeSeg = genderToSegment[selectedGender];
      if (activeSeg) {
        setKategoriMenuSegment(activeSeg);
      } else {
        setKategoriMenuSegment(null);
      }
    }
  }, [activeDropdown, selectedGender]);

  // Dynamically compute size options based on currently active category!
  const sizeOptions = React.useMemo(() => {
    const catLower = selectedCategory.toLowerCase();
    if (catLower === 'footwear' || catLower === 'sepatu') {
      return ['Semua', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
    }
    if (['dresses', 'tops', 'bottoms', 'outerwear', 'pakaian pria', 'pakaian wanita', 'atasan'].includes(catLower)) {
      return ['Semua', 'S', 'M', 'L', 'XL', 'One Size'];
    }
    // Default combined list
    return ['Semua', 'S', 'M', 'L', 'XL', '42', 'One Size'];
  }, [selectedCategory]);

  // Filter and Sort implementation
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Gender filter
    let matchesGender = true;
    if (selectedGender !== 'Semua') {
      if (selectedGender === 'Wanita') {
        matchesGender = p.category.toLowerCase().includes('wanita') || p.id === 'gaun-musim-panas' || p.id === 'canvas-tote';
      } else if (selectedGender === 'Pria') {
        matchesGender = p.category.toLowerCase().includes('pria') || p.id === 'jaket-denim-vintage' || p.id === 'leather-boots' || p.id === 'sweat-wool';
      } else if (selectedGender === 'Anak-anak') {
        matchesGender = p.name.toLowerCase().includes('anak') || p.description.toLowerCase().includes('anak') || p.category.toLowerCase().includes('anak');
      }
    }

    // Adaptive Category filter (checking subcategories matches helper)
    let matchesCategory = true;
    if (selectedCategory !== 'Semua') {
      const segment = genderToSegment[selectedGender];
      if (segment) {
        const subcat = CATEGORY_STRUCTURE.find(s => s.id === segment)?.subcategories.find(sub => sub.id === selectedCategory);
        if (subcat) {
          matchesCategory = subcat.matches(p);
        }
      } else {
        // If "Semua" gender is active but a specific category is selected, see if any segment's subcategory matches
        let foundMatch = false;
        for (const seg of CATEGORY_STRUCTURE) {
          const subcat = seg.subcategories.find(sub => sub.id === selectedCategory);
          if (subcat && subcat.matches(p)) {
            foundMatch = true;
            break;
          }
        }
        matchesCategory = foundMatch;
      }
    }

    // Size filter match
    const matchesSize =
      selectedSize === 'Semua' ||
      p.size.toLowerCase() === selectedSize.toLowerCase();

    // Color filter match (matched based on descriptive keywords)
    let matchesColor = true;
    if (selectedColor !== 'Semua') {
      const desc = (p.name + ' ' + p.description).toLowerCase();
      if (selectedColor === 'Biru') {
        matchesColor = desc.includes('denim') || desc.includes('biru') || desc.includes('blue');
      } else if (selectedColor === 'Cokelat') {
        matchesColor = desc.includes('leather') || desc.includes('boots') || desc.includes('cokelat') || desc.includes('brown');
      } else if (selectedColor === 'Cream') {
        matchesColor = desc.includes('cream') || desc.includes('krem') || desc.includes('wool');
      } else if (selectedColor === 'Floral') {
        matchesColor = desc.includes('floral') || desc.includes('gaun') || desc.includes('bunga');
      } else if (selectedColor === 'Hitam') {
        matchesColor = desc.includes('hitam') || desc.includes('black') || desc.includes('dark');
      } else if (selectedColor === 'Putih') {
        matchesColor = desc.includes('putih') || desc.includes('white');
      }
    }

    // Brand filter match
    const matchesBrand =
      selectedBrand === 'Semua' ||
      p.brand.toLowerCase() === selectedBrand.toLowerCase();

    // Price range match
    let matchesPrice = true;
    if (selectedPriceRange !== 'Semua') {
      if (selectedPriceRange === 'Di bawah Rp 250rb') {
        matchesPrice = p.price < 250000;
      } else if (selectedPriceRange === 'Rp 250rb - Rp 500rb') {
        matchesPrice = p.price >= 250000 && p.price <= 500000;
      } else if (selectedPriceRange === 'Rp 500rb - Rp 1jt') {
        matchesPrice = p.price >= 500000 && p.price <= 1000000;
      } else if (selectedPriceRange === 'Di atas Rp 1jt') {
        matchesPrice = p.price > 1000000;
      }
    }

    // Condition match
    const matchesCondition =
      selectedCondition === 'Semua' ||
      p.condition.toLowerCase() === selectedCondition.toLowerCase();

    return matchesSearch && matchesGender && matchesCategory && matchesSize && matchesColor && matchesBrand && matchesPrice && matchesCondition;
  });

  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'Harga: Rendah ke Tinggi') {
      return a.price - b.price;
    }
    if (selectedSort === 'Harga: Tinggi ke Rendah') {
      return b.price - a.price;
    }
    if (selectedSort === 'Rating Penjual Tertinggi') {
      return b.sellerRating - a.sellerRating;
    }
    // Default / 'Terbaru'
    return 0;
  });

  const uniqueBrands = ['Semua', ...Array.from(new Set(products.map((p) => p.brand)))];

  const handleGenderTabClick = (gender: string) => {
    setSelectedGender(gender);
    setSelectedCategory('Semua');
    setSelectedSize('Semua');
  };

  return (
    <div className="flex flex-col gap-10 py-8 font-geist relative">
      {/* Invisible Screen backdrop for closing dropdowns on outer click */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-30 bg-transparent cursor-default" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* 1. Page Header with Clean Breadcrumbs */}
      <section className="bg-[#fcf9f8] border border-[#f0edec] rounded-[32px] p-8 md:p-12 mb-2 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#c0edd3]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-start text-left gap-4 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-[#414944] font-semibold">
            <span className="hover:underline cursor-pointer" onClick={() => navigate('explore')}>Home</span>
            <ChevronRight size={12} />
            <span className="text-[#002d1c] font-bold">Katalog Produk</span>
            {selectedGender !== 'Semua' && (
              <>
                <ChevronRight size={12} />
                <span className="text-[#002d1c] font-bold">{selectedGender}</span>
              </>
            )}
            {selectedCategory !== 'Semua' && (
              <>
                <ChevronRight size={12} />
                <span className="text-[#002d1c] font-bold">{selectedCategory}</span>
              </>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-black text-[#002d1c] tracking-tight">
            {selectedCategory !== 'Semua' 
              ? `${selectedCategory} ${selectedGender !== 'Semua' ? selectedGender : ''}`
              : 'Katalog Pakaian Preloved'
            }
          </h1>
          <p className="text-sm text-[#414944] leading-relaxed">
            Menjelajahi ribuan pilihan busana preloved berkualitas.
          </p>
        </div>
      </section>

      {/* 2. Interactive Navigation Filters inside Page */}
      <section className="bg-white rounded-[24px] border border-[#f0edec] p-6 shadow-sm flex flex-col gap-6 relative z-40">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Gender Tab Selection Switches */}
          <div className="flex items-center gap-1.5 bg-[#fcf9f8] border border-[#f0edec] p-1.5 rounded-full w-full md:w-auto">
            {['Semua', 'Wanita', 'Pria', 'Anak-anak'].map((gender) => (
              <button
                key={gender}
                onClick={() => handleGenderTabClick(gender)}
                className={`flex-1 md:flex-none px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedGender === gender
                    ? 'bg-[#002d1c] text-white shadow-sm'
                    : 'text-[#414944] hover:text-[#002d1c] hover:bg-black/5'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari brand, nama pakaian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcf9f8] border border-[#f0edec] pl-10 pr-4 py-2.5 rounded-full text-xs text-[#1c1b1b] placeholder-[#414944]/50 focus:outline-none focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] transition-all"
            />
            <Search className="absolute left-3.5 top-3 text-[#414944]/60" size={14} />
          </div>
        </div>

        {/* Custom Interactive Dropdowns for Category, Size, Warna, Brand, Harga, Kondisi, and Sort by */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#f0edec]/85">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#414944] uppercase tracking-wider text-left">
            <SlidersHorizontal size={12} />
            <span>Filter</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {/* 1. Kategori Dropdown (Adaptive Navigation Menu) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedCategory !== 'Semua'
                    ? 'bg-[#d4e5c7] border-[#a2cb8e] text-[#002d1c]'
                    : 'bg-white border-[#f0edec] text-[#414944] hover:border-[#c1c8c2] hover:text-[#002d1c]'
                }`}
              >
                <span className="truncate">Kategori: {selectedCategory}</span>
                <ChevronDown size={14} className={`shrink-0 ml-1 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'category' && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-[#f0edec] rounded-2xl shadow-xl z-50 py-2 text-left overflow-hidden">
                  {kategoriMenuSegment === null ? (
                    /* LEVEL 1: List of Segments (Womens, Mens, Kids) */
                    <div className="flex flex-col">
                      {CATEGORY_STRUCTURE.map((seg) => (
                        <button
                          key={seg.id}
                          type="button"
                          onClick={() => setKategoriMenuSegment(seg.id)}
                          className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-[#414944] hover:bg-[#fcf9f8] hover:text-[#002d1c] transition-colors"
                        >
                          <span>{seg.label}</span>
                          <ChevronRight size={14} className="text-[#414944]/60" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* LEVEL 2: List of Subcategories under active segment */
                    <div className="flex flex-col">
                      {/* Submenu Header with Back Arrow */}
                      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#f0edec] mb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            // If a permanent gender is selected, back button doesn't reset gender, just goes back to top level
                            setKategoriMenuSegment(null);
                          }}
                          className="p-1 hover:bg-[#fcf9f8] rounded-full text-[#414944] hover:text-[#002d1c] transition-colors"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <span className="text-xs font-bold text-[#002d1c]">{kategoriMenuSegment}</span>
                      </div>

                      {/* Subcategory list */}
                      <div className="max-h-60 overflow-y-auto scrollbar-none">
                        {/* Clear/Deselect option */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('Semua');
                            // Map segment to gender
                            const mappedGender = segmentToGender[kategoriMenuSegment!];
                            if (mappedGender) {
                              setSelectedGender(mappedGender);
                            }
                            setActiveDropdown(null);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors ${
                            selectedCategory === 'Semua'
                              ? 'bg-[#002d1c]/5 text-[#002d1c]'
                              : 'text-[#414944] hover:bg-[#fcf9f8] hover:text-[#002d1c]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedCategory === 'Semua' ? 'border-[#002d1c]' : 'border-[#c1c8c2]'
                          }`}>
                            {selectedCategory === 'Semua' && <div className="w-2 h-2 rounded-full bg-[#002d1c]" />}
                          </div>
                          <span>Lihat Semua {kategoriMenuSegment}</span>
                        </button>

                        {CATEGORY_STRUCTURE.find(s => s.id === kategoriMenuSegment)?.subcategories.map((sub) => {
                          const isSelected = selectedCategory === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(sub.id);
                                const mappedGender = segmentToGender[kategoriMenuSegment!];
                                if (mappedGender) {
                                  setSelectedGender(mappedGender);
                                }
                                setActiveDropdown(null);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors ${
                                isSelected
                                  ? 'bg-[#002d1c]/5 text-[#002d1c]'
                                  : 'text-[#414944] hover:bg-[#fcf9f8] hover:text-[#002d1c]'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#002d1c]' : 'border-[#c1c8c2]'
                              }`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-[#002d1c]" />}
                              </div>
                              <span>{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Size Dropdown (Adaptive size options) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'size' ? null : 'size')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedSize !== 'Semua'
                    ? 'bg-[#d4e5c7] border-[#a2cb8e] text-[#002d1c]'
                    : 'bg-white border-[#f0edec] text-[#414944] hover:border-[#c1c8c2] hover:text-[#002d1c]'
                }`}
              >
                <span className="truncate">Size: {selectedSize}</span>
                <ChevronDown size={14} className={`shrink-0 ml-1 transition-transform ${activeDropdown === 'size' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'size' && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-[#f0edec] rounded-2xl shadow-xl z-50 py-2">
                  {sizeOptions.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sz);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                        selectedSize === sz
                          ? 'bg-[#002d1c] text-white'
                          : 'text-[#414944] hover:bg-[#fcf9f8] hover:text-[#002d1c]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Warna Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedColor !== 'Semua'
                    ? 'bg-[#d4e5c7] border-[#a2cb8e] text-[#002d1c]'
                    : 'bg-white border-[#f0edec] text-[#414944] hover:border-[#c1c8c2] hover:text-[#002d1c]'
                }`}
              >
                <span className="truncate">Warna: {selectedColor}</span>
                <ChevronDown size={14} className={`shrink-0 ml-1 transition-transform ${activeDropdown === 'color' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'color' && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-[#f0edec] rounded-2xl shadow-xl z-50 py-2">
                  {['Semua', 'Biru', 'Cokelat', 'Cream', 'Floral', 'Hitam', 'Putih'].map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => {
                        setSelectedColor(clr);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                        selectedColor === clr
                          ? 'bg-[#002d1c] text-white'
                          : 'text-[#414944] hover:bg-[#fcf9f8] hover:text-[#002d1c]'
                      }`}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Brand Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'brand' ? null : 'brand')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedBrand !== 'Semua'
                    ? 'bg-[#d4e5c7] border-[#a2cb8e] text-[#002d1c]'
                    : 'bg-white border-[#f0edec] text-[#414944] hover:border-[#c1c8c2] hover:text-[#002d1c]'
                }`}
              >
                <span className="truncate">Brand: {selectedBrand}</span>
                <ChevronDown size={14} className={`shrink-0 ml-1 transition-transform ${activeDropdown === 'brand' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'brand' && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-[#f0edec] rounded-2xl shadow-xl z-50 py-2">
                  {uniqueBrands.map((brnd) => (
                    <button
                      key={brnd}
                      type="button"
                      onClick={() => {
                        setSelectedBrand(brnd);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                        selectedBrand === brnd
                          ? 'bg-[#002d1c] text-white'
                          : 'text-[#414944] hover:bg-[#fcf9f8] hover:text-[#002d1c]'
                      }`}
                    >
                      {brnd}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Harga Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedPriceRange !== 'Semua'
                    ? 'bg-[#d4e5c7] border-[#a2cb8e] text-[#002d1c]'
                    : 'bg-white border-[#f0edec] text-[#414944] hover:border-[#c1c8c2] hover:text-[#002d1c]'
                }`}
              >
                <span className="truncate">Harga: {selectedPriceRange}</span>
                <ChevronDown size={14} className={`shrink-0 ml-1 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'price' && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-[#f0edec] rounded-2xl shadow-xl z-50 py-2">
                  {['Semua', 'Di bawah Rp 250rb', 'Rp 250rb - Rp 500rb', 'Rp 500rb - Rp 1jt', 'Di atas Rp 1jt'].map((prc) => (
                    <button
                      key={prc}
                      type="button"
                      onClick={() => {
                        setSelectedPriceRange(prc);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                        selectedPriceRange === prc
                          ? 'bg-[#002d1c] text-white'
                          : 'text-[#414944] hover:bg-[#fcf9f8] hover:text-[#002d1c]'
                      }`}
                    >
                      {prc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Kondisi Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'condition' ? null : 'condition')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedCondition !== 'Semua'
                    ? 'bg-[#d4e5c7] border-[#a2cb8e] text-[#002d1c]'
                    : 'bg-white border-[#f0edec] text-[#414944] hover:border-[#c1c8c2] hover:text-[#002d1c]'
                }`}
              >
                <span className="truncate">Kondisi: {selectedCondition}</span>
                <ChevronDown size={14} className={`shrink-0 ml-1 transition-transform ${activeDropdown === 'condition' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'condition' && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-[#f0edec] rounded-2xl shadow-xl z-50 py-2">
                  {['Semua', 'Baru', 'Sangat Baik', 'Baik', 'Pernah Dipakai'].map((cnd) => (
                    <button
                      key={cnd}
                      type="button"
                      onClick={() => {
                        setSelectedCondition(cnd);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                        selectedCondition === cnd
                          ? 'bg-[#002d1c] text-white'
                          : 'text-[#414944] hover:bg-[#fcf9f8] hover:text-[#002d1c]'
                      }`}
                    >
                      {cnd}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 7. Sort by Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedSort !== 'Terbaru'
                    ? 'bg-[#d4e5c7] border-[#a2cb8e] text-[#002d1c]'
                    : 'bg-white border-[#f0edec] text-[#414944] hover:border-[#c1c8c2] hover:text-[#002d1c]'
                }`}
              >
                <span className="truncate">Urutkan: {selectedSort}</span>
                <ChevronDown size={14} className={`shrink-0 ml-1 transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'sort' && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#f0edec] rounded-2xl shadow-xl z-50 py-2">
                  {['Terbaru', 'Harga: Rendah ke Tinggi', 'Harga: Tinggi ke Rendah', 'Rating Penjual Tertinggi'].map((srt) => (
                    <button
                      key={srt}
                      type="button"
                      onClick={() => {
                        setSelectedSort(srt);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                        selectedSort === srt
                          ? 'bg-[#002d1c] text-white'
                          : 'text-[#414944] hover:bg-[#fcf9f8] hover:text-[#002d1c]'
                      }`}
                    >
                      {srt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedGender !== 'Semua' || selectedCategory !== 'Semua' || selectedSize !== 'Semua' || selectedColor !== 'Semua' || selectedBrand !== 'Semua' || selectedPriceRange !== 'Semua' || selectedCondition !== 'Semua' || selectedSort !== 'Terbaru' || searchTerm !== '') && (
          <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-[#f0edec]/85">
            <span className="text-[11px] font-bold text-[#414944] uppercase tracking-wide mr-1 select-none">Filter Aktif:</span>
            
            {selectedGender !== 'Semua' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#c1c8c2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#002d1c] shadow-sm select-none">
                Gender: {selectedGender}
                <button 
                  onClick={() => {
                    setSelectedGender('Semua');
                    setSelectedCategory('Semua');
                    setSelectedSize('Semua');
                  }}
                  className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                >
                  &times;
                </button>
              </span>
            )}

            {selectedCategory !== 'Semua' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#c1c8c2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#002d1c] shadow-sm select-none">
                Kategori: {selectedCategory}
                <button 
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSelectedSize('Semua');
                  }}
                  className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                >
                  &times;
                </button>
              </span>
            )}

            {selectedSize !== 'Semua' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#c1c8c2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#002d1c] shadow-sm select-none">
                Size: {selectedSize}
                <button 
                  onClick={() => setSelectedSize('Semua')}
                  className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                >
                  &times;
                </button>
              </span>
            )}

            {selectedColor !== 'Semua' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#c1c8c2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#002d1c] shadow-sm select-none">
                Warna: {selectedColor}
                <button 
                  onClick={() => setSelectedColor('Semua')}
                  className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                >
                  &times;
                </button>
              </span>
            )}

            {selectedBrand !== 'Semua' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#c1c8c2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#002d1c] shadow-sm select-none">
                Brand: {selectedBrand}
                <button 
                  onClick={() => setSelectedBrand('Semua')}
                  className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                >
                  &times;
                </button>
              </span>
            )}

            {selectedPriceRange !== 'Semua' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#c1c8c2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#002d1c] shadow-sm select-none">
                Harga: {selectedPriceRange}
                <button 
                  onClick={() => setSelectedPriceRange('Semua')}
                  className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                >
                  &times;
                </button>
              </span>
            )}

            {selectedCondition !== 'Semua' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#c1c8c2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#002d1c] shadow-sm select-none">
                Kondisi: {selectedCondition}
                <button 
                  onClick={() => setSelectedCondition('Semua')}
                  className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                >
                  &times;
                </button>
              </span>
            )}

            {selectedSort !== 'Terbaru' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#c1c8c2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#002d1c] shadow-sm select-none">
                Urutan: {selectedSort}
                <button 
                  onClick={() => setSelectedSort('Terbaru')}
                  className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                >
                  &times;
                </button>
              </span>
            )}

            {searchTerm !== '' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#c1c8c2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#002d1c] shadow-sm select-none">
                "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="hover:text-red-500 font-bold ml-1 text-sm leading-none"
                >
                  &times;
                </button>
              </span>
            )}
            
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Semua');
                setSelectedGender('Semua');
                setSelectedSize('Semua');
                setSelectedColor('Semua');
                setSelectedBrand('Semua');
                setSelectedPriceRange('Semua');
                setSelectedCondition('Semua');
                setSelectedSort('Terbaru');
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#ba1a1a] hover:underline underline-offset-2 ml-2 transition-all bg-transparent border-0"
            >
              <RefreshCw size={11} /> Reset Semua
            </button>
          </div>
        )}
      </section>

      {/* 3. Product Listings List */}
      <section className="relative">
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-1 text-left">
            <h2 className="font-display text-[#002d1c] text-2xl font-extrabold tracking-tight">Koleksi Kami</h2>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/5 p-8 flex flex-col items-center justify-center">
            <div className="text-[#414944] font-bold mb-3">Item tidak ditemukan</div>
            <p className="text-sm text-[#414944]/70 max-w-sm mb-6">Pastikan nama kata kunci atau merk sesuai. Anda bisa melakukan reset filter untuk melihat katalog lengkap.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Semua');
                setSelectedGender('Semua');
                setSelectedSize('Semua');
                setSelectedColor('Semua');
                setSelectedBrand('Semua');
                setSelectedPriceRange('Semua');
                setSelectedCondition('Semua');
                setSelectedSort('Terbaru');
              }}
              className="bg-[#002d1c] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-all font-geist"
            >
              Ulangi Pencarian Katalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sortedProducts.map((p) => {
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
        )}
      </section>
    </div>
  );
};
