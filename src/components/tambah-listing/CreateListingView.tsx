/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Camera, Plus, Check, Trash2, ArrowLeft, ArrowRight, Sparkles, HelpCircle, AlertCircle, RotateCw, Crop, X, RefreshCw } from 'lucide-react';
import { Product, Screen } from '../../types';

// Mock database for Dynamic Price Recommendation (FR-02)
const HISTORICAL_DATA = [
  // Brand: Levi's
  { category: 'Pakaian Pria', brand: "Levi's", price: 320000 },
  { category: 'Pakaian Pria', brand: "Levi's", price: 380000 },
  { category: 'Pakaian Pria', brand: "Levi's", price: 290000 },
  { category: 'Pakaian Pria', brand: "Levi's", price: 350000 },
  { category: 'Pakaian Pria', brand: "Levi's", price: 410000 },
  { category: 'Atasan', brand: "Levi's", price: 300000 },
  { category: 'Atasan', brand: "Levi's", price: 360000 },
  { category: 'Atasan', brand: "Levi's", price: 270000 },
  { category: 'Atasan', brand: "Levi's", price: 330000 },
  { category: 'Atasan', brand: "Levi's", price: 390000 },
  
  // Brand: Nike
  { category: 'Sepatu', brand: "Nike", price: 850000 },
  { category: 'Sepatu', brand: "Nike", price: 790000 },
  { category: 'Sepatu', brand: "Nike", price: 920000 },
  { category: 'Sepatu', brand: "Nike", price: 880000 },
  { category: 'Sepatu', brand: "Nike", price: 750000 },

  // Brand: Uniqlo
  { category: 'Pakaian Pria', brand: "Uniqlo", price: 120000 },
  { category: 'Pakaian Pria', brand: "Uniqlo", price: 150000 },
  { category: 'Pakaian Pria', brand: "Uniqlo", price: 135000 },
  { category: 'Pakaian Pria', brand: "Uniqlo", price: 160000 },
  { category: 'Pakaian Pria', brand: "Uniqlo", price: 145000 },
  { category: 'Atasan', brand: "Uniqlo", price: 110000 },
  { category: 'Atasan', brand: "Uniqlo", price: 140000 },
  { category: 'Atasan', brand: "Uniqlo", price: 125000 },
  { category: 'Atasan', brand: "Uniqlo", price: 155000 },
  { category: 'Atasan', brand: "Uniqlo", price: 130000 },

  // Brand: Zara
  { category: 'Pakaian Wanita', brand: "Zara", price: 280000 },
  { category: 'Pakaian Wanita', brand: "Zara", price: 320000 },
  { category: 'Pakaian Wanita', brand: "Zara", price: 250000 },
  { category: 'Pakaian Wanita', brand: "Zara", price: 300000 },
  { category: 'Pakaian Wanita', brand: "Zara", price: 340000 },
];

interface CreateListingViewProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  onPublishListing: (newProduct: Partial<Product>) => void;
  initialProduct?: Product | null;
}

export const CreateListingView: React.FC<CreateListingViewProps> = ({
  currentScreen,
  navigate,
  onPublishListing,
  initialProduct,
}) => {
  // Parsers for initialProduct
  const getParsedCategory = (cat: string) => {
    let seg: 'Womens' | 'Mens' | 'Kids' = 'Mens';
    let sub = 'Tops';
    
    if (cat.includes('Wanita')) {
      seg = 'Womens';
      if (cat.includes('Atasan')) sub = 'Tops';
      else if (cat.includes('Celana')) sub = 'Bottoms';
      else if (cat.includes('Sepatu')) sub = 'Footwear';
      else if (cat.includes('Jaket')) sub = 'Outerwear';
      else if (cat.includes('Pakaian')) sub = 'Dresses';
      else if (cat.includes('Aksesoris')) sub = 'Aksesoris';
    } else if (cat.includes('Pria')) {
      seg = 'Mens';
      if (cat.includes('Atasan')) sub = 'Tops';
      else if (cat.includes('Celana')) sub = 'Bottoms';
      else if (cat.includes('Sepatu')) sub = 'Footwear';
      else if (cat.includes('Jaket')) sub = 'Outerwear';
      else if (cat.includes('Aksesoris')) sub = 'Aksesoris';
    } else if (cat.includes('Anak')) {
      seg = 'Kids';
      if (cat.includes('Atasan')) sub = 'Tops';
      else if (cat.includes('Celana')) sub = 'Bottoms';
      else if (cat.includes('Mainan')) sub = 'Toys';
      else if (cat.includes('Aksesoris')) sub = 'Aksesoris';
    }
    return { seg, sub };
  };

  const getParsedColorAndDesc = (desc: string) => {
    let col = 'Hitam';
    let cleanDesc = desc;
    if (desc.startsWith('[Warna: ')) {
      const match = desc.match(/^\[Warna:\s*([^\]]+)\]\s*(.*)$/);
      if (match) {
        col = match[1];
        cleanDesc = match[2];
      }
    }
    return { col, cleanDesc };
  };

  const parsedCat = initialProduct ? getParsedCategory(initialProduct.category) : { seg: 'Mens' as const, sub: 'Tops' };
  const parsedDesc = initialProduct ? getParsedColorAndDesc(initialProduct.description) : { col: 'Hitam', cleanDesc: '' };

  // Step State Variables
  const [name, setName] = useState(initialProduct ? initialProduct.name.replace(/\s*\([^)]+\)$/, '') : '');
  const [brand, setBrand] = useState(initialProduct ? initialProduct.brand : '');
  const [size, setSize] = useState(initialProduct ? initialProduct.size : 'M');
  const [segment, setSegment] = useState<'Womens' | 'Mens' | 'Kids'>(parsedCat.seg);
  const [subcategory, setSubcategory] = useState<string>(parsedCat.sub);
  const [color, setColor] = useState(parsedDesc.col);
  const [condition, setCondition] = useState(initialProduct ? initialProduct.condition : 'Baru');
  const [description, setDescription] = useState(parsedDesc.cleanDesc);
  const [price, setPrice] = useState<number>(initialProduct ? initialProduct.price : 350000);

  const category = `${subcategory} ${segment === 'Womens' ? 'Wanita' : segment === 'Mens' ? 'Pria' : 'Anak'}`;

  const getSubcategoriesForSegment = (seg: 'Womens' | 'Mens' | 'Kids') => {
    switch (seg) {
      case 'Womens':
        return ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Aksesoris'];
      case 'Mens':
        return ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Aksesoris'];
      case 'Kids':
        return ['Tops', 'Bottoms', 'Toys', 'Aksesoris'];
      default:
        return ['Tops'];
    }
  };

  const handleSegmentChange = (seg: 'Womens' | 'Mens' | 'Kids') => {
    setSegment(seg);
    setSubcategory('Tops');
    setSize('M');
  };

  const handleSubcategoryChange = (sub: string) => {
    setSubcategory(sub);
    if (sub === 'Footwear') {
      setSize(segment === 'Womens' ? '38' : '41');
    } else if (sub === 'Aksesoris' || sub === 'Toys') {
      setSize('Sedang');
    } else {
      setSize('M');
    }
  };

  const getSizeOptions = (sub: string) => {
    if (sub === 'Footwear') {
      return ['37', '38', '39', '40', '41', '42', '43', '44', '45'];
    }
    if (sub === 'Aksesoris' || sub === 'Toys') {
      return ['Kecil', 'Sedang', 'Besar'];
    }
    return ['S', 'M', 'L', 'XL', 'XXL'];
  };
  
  // Labeled 5 slots for Verified Condition Check (FR-01)
  const [photos, setPhotos] = useState<{
    depan: string | null;
    belakang: string | null;
    tag: string | null;
    minus: string | null;
    detail: string | null;
  }>({
    depan: initialProduct ? initialProduct.imagePrimary : null,
    belakang: initialProduct ? initialProduct.imageHover : null,
    tag: initialProduct ? (initialProduct as any).imageTag || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY7RgKRR--WV_tAd9SPVkiCsi8eLuii-7l7lxX2C8dyEhHpCKjWb5627gWUMBiMbBJsi16MlVBl0KzVr6yM4qOCLIBdSieAwyB11X81dc77fOvUkgUrN-iMr73YacBV7bzavKAV7cxhcmGReVGLaJobEicNTqhnvKiLvs9D9oQu0opEDIxkdX1US33G4Yw887vPTc-tJ-ddZOia8OGA-q0D-p2Bh0Z1sQvHMaVQO5Txo7CyQyUPpuErLVXa9r9mdkZlM330fl152Vx' : null,
    minus: initialProduct ? (initialProduct as any).imageMinus || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeaaSSlwZgkNTPgGz4AyxDMt-MWKJdq4PVgkFOUnAOrcFITJyHqtGxxwzq6r-unalJF4MLtNFyUZIaDPx3--QudBhABuXFhOK0Ru2kqtox9GNgL5B3xUhNbyEQ3p9xqhUkIuocopCbiCOF-AOXCE642SL3Av4Vj1Xwm3aZkDFtC_xircD3xswsprnXF0l4NimrpKwjhqDWWLu-IZiu4eE1jJbH7Q0LnZpCQkMBDvbgT0GrtpPjxMIINzxa3eaevmjbWkwOQajCWnlu' : null,
    detail: initialProduct ? (initialProduct as any).imageDetail || 'https://lh3.googleusercontent.com/aida-public/AB6AXuByq6OAT-vWno4PR8k6FHbcNE-0cppxIFOuqCTjxNVnLCc4HoKpiNm6ZJuX3cC8_qVqRiV7lkccvlY2LEUTn9GNORJrU-iXGv2TkOo__EMM5oYXt_OqO1yfdOH--mvMrt_4s7VqeviCUZcF7XG-1OeHvB4mQZBH7yl01S-_zzynWg47yubF_s99wbbzNSj0-hSQAv9ld_BFdej8ok4Eb8nN0r5oiDfaTg-VKchZjqcmFOH24i8Ek0GuAlQiSmS0fOBeOpTE-A0DugbS' : null,
  });

  // Photo Editor Modal States
  const [activePhotoSlot, setActivePhotoSlot] = useState<'depan' | 'belakang' | 'tag' | 'minus' | 'detail' | null>(null);
  const [pendingPhotoSlot, setPendingPhotoSlot] = useState<'depan' | 'belakang' | 'tag' | 'minus' | 'detail' | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isCropped, setIsCropped] = useState(false);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getSlotGuide = (slot: string) => {
    switch (slot) {
      case 'depan':
        return {
          title: 'Sisi Depan Pakaian',
          desc: 'Pilih foto pakaian secara utuh dari depan. Bentangkan atau gantung pakaian secara simetris.',
          overlay: 'Posisikan kerah baju tegak di area kotak hijau sirkular'
        };
      case 'belakang':
        return {
          title: 'Sisi Belakang Pakaian',
          desc: 'Pilih foto pakaian secara utuh dari belakang. Perlihatkan detail punggung secara rata.',
          overlay: 'Posisikan jahitan punggung sejajar garis horizontal'
        };
      case 'tag':
        return {
          title: 'Label / Tag Ukuran & Merk',
          desc: 'Pilih foto label merk, tag ukuran, dan petunjuk pencucian untuk verifikasi keaslian barang.',
          overlay: 'Dekatkan dan sejajarkan teks label di dalam area bundar fokus'
        };
      case 'minus':
        return {
          title: 'Detail Minus / Cacat',
          desc: 'Pilih foto close-up area minus jika ada (noda, robek kecil, fading parah, kancing hilang). Jika tidak ada minus, foto tag logo merk.',
          overlay: 'Tandai bagian minus di dalam bidik lensa merah'
        };
      case 'detail':
        return {
          title: 'Detail Bahan & Serat Kain',
          desc: 'Pilih foto close-up tekstur serat kain pakaian di bawah pencahayaan yang terang untuk meyakinkan pembeli.',
          overlay: 'Dekatkan lensa hingga serat anyaman kain terlihat padat'
        };
      default:
        return { title: '', desc: '', overlay: '' };
    }
  };

  const handlePhotoClick = (slot: 'depan' | 'belakang' | 'tag' | 'minus' | 'detail') => {
    setPendingPhotoSlot(slot);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingPhotoSlot) return;

    // Size validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Batas ukuran masing-masing foto adalah 5MB. Silakan pilih file yang lebih kecil.');
      return;
    }

    // Type validation (PNG/JPG/JPEG)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Harap hanya mengunggah file berformat PNG atau JPG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSimulatedImage(reader.result as string);
      setRotation(0);
      setIsCropped(false);
      setActivePhotoSlot(pendingPhotoSlot);
      setPendingPhotoSlot(null);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (imageSrc: string, rotateDeg: number, doCrop: boolean): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        if (doCrop) {
          const size = Math.min(img.width, img.height);
          sourceX = (img.width - size) / 2;
          sourceY = (img.height - size) / 2;
          sourceWidth = size;
          sourceHeight = size;
        }

        let destWidth = sourceWidth;
        let destHeight = sourceHeight;
        if (rotateDeg === 90 || rotateDeg === 270) {
          destWidth = sourceHeight;
          destHeight = sourceWidth;
        }

        canvas.width = destWidth;
        canvas.height = destHeight;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotateDeg * Math.PI) / 180);
        
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          -sourceWidth / 2,
          -sourceHeight / 2,
          sourceWidth,
          sourceHeight
        );

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });
  };

  const handleSavePhoto = async () => {
    if (activePhotoSlot && simulatedImage) {
      try {
        const finalImage = await processImage(simulatedImage, rotation, isCropped);
        setPhotos((prev) => ({
          ...prev,
          [activePhotoSlot]: finalImage
        }));
        setActivePhotoSlot(null);
      } catch (err) {
        setPhotos((prev) => ({
          ...prev,
          [activePhotoSlot]: simulatedImage
        }));
        setActivePhotoSlot(null);
      }
    }
  };

  const handleRemovePhoto = (slot: 'depan' | 'belakang' | 'tag' | 'minus' | 'detail', e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos(prev => ({
      ...prev,
      [slot]: null
    }));
  };

  const [publishSuccess, setPublishSuccess] = useState(false);

  const conditions = ['Baru', 'Seperti Baru', 'Digunakan dengan Baik', 'Sering Digunakan'];

  const popularBrands = ["Levi's", "Nike", "Uniqlo", "Zara", "H&M", "Adidas", "Prada", "Balenciaga"];
  
  const colors = [
    { name: 'Hitam', hex: '#1c1b1b' },
    { name: 'Putih', hex: '#ffffff', border: '#cbd5e1' },
    { name: 'Cokelat', hex: '#78350f' },
    { name: 'Biru', hex: '#1d4ed8' },
    { name: 'Cream', hex: '#fef3c7', border: '#fcd34d' },
    { name: 'Floral', bgClass: 'bg-gradient-to-tr from-pink-400 via-yellow-200 to-blue-300' },
    { name: 'Abu-abu', hex: '#6b7280' },
    { name: 'Hijau', hex: '#15803d' },
    { name: 'Merah', hex: '#b91c1c' },
  ];

  const getStepNumber = () => {
    switch (currentScreen) {
      case 'create-listing-info': return 1;
      case 'create-listing-photo': return 2;
      case 'create-listing-price': return 3;
      case 'create-listing-review': return 4;
      default: return 1;
    }
  };

  const isPhotoStepComplete = !!(photos.depan && photos.belakang && photos.tag && photos.minus && photos.detail);

  const getPricingStats = () => {
    if (!brand || !subcategory) return null;
    
    let targetCat = 'Atasan';
    if (subcategory === 'Footwear') targetCat = 'Sepatu';
    else if (subcategory === 'Toys') targetCat = 'Mainan';
    else if (subcategory === 'Aksesoris') targetCat = 'Aksesoris';
    else if (segment === 'Womens') targetCat = 'Pakaian Wanita';
    else if (segment === 'Mens') targetCat = 'Pakaian Pria';

    const matching = HISTORICAL_DATA.filter(
      (item) =>
        item.category.toLowerCase() === targetCat.toLowerCase() &&
        item.brand.toLowerCase() === brand.trim().toLowerCase()
    );
    if (matching.length < 5) {
      return null;
    }
    const prices = matching.map((m) => m.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
    return { min, max, avg };
  };

  const handleNextStep = () => {
    if (currentScreen === 'create-listing-info') {
      if (!name || !brand || !size || !color || !description.trim()) {
        alert('Harap lengkapi semua data wajib (Nama, Kategori, Ukuran, Warna, Brand, dan Deskripsi) sebelum melanjutkan!');
        return;
      }
      navigate('create-listing-photo');
    } else if (currentScreen === 'create-listing-photo') {
      if (!isPhotoStepComplete) {
        alert('Harap unggah seluruh 5 foto wajib sebelum melanjutkan!');
        return;
      }
      // Autofill price estimate average if available
      const stats = getPricingStats();
      if (stats) {
        setPrice(stats.avg);
      }
      navigate('create-listing-price');
    } else if (currentScreen === 'create-listing-price') {
      navigate('create-listing-review');
    }
  };

  const handleGoBack = () => {
    if (getStepNumber() === 1) {
      if (initialProduct) {
        navigate('seller-products');
      } else {
        navigate('seller-dashboard');
      }
    } else if (getStepNumber() === 2) {
      navigate('create-listing-info');
    } else if (getStepNumber() === 3) {
      navigate('create-listing-photo');
    } else if (getStepNumber() === 4) {
      navigate('create-listing-price');
    }
  };

  const handlePublish = () => {
    // Append color info for accurate catalog search indexing (since catalog searches description / title keywords)
    const displayDescription = `[Warna: ${color}] ${description || 'Pakaian preloved berkualitas tinggi terkurasi oleh RE-LOVE.'}`;
    const displayName = name.toLowerCase().includes(color.toLowerCase()) ? name : `${name} (${color})`;

    // Map subcategory + segment to standard database category string
    let finalCategory = 'Atasan Pria';
    if (segment === 'Womens') {
      if (subcategory === 'Tops') finalCategory = 'Atasan Wanita';
      else if (subcategory === 'Bottoms') finalCategory = 'Celana Wanita';
      else if (subcategory === 'Footwear') finalCategory = 'Sepatu Wanita';
      else if (subcategory === 'Outerwear') finalCategory = 'Jaket Wanita';
      else if (subcategory === 'Dresses') finalCategory = 'Pakaian Wanita';
      else if (subcategory === 'Aksesoris') finalCategory = 'Aksesoris Wanita';
    } else if (segment === 'Mens') {
      if (subcategory === 'Tops') finalCategory = 'Atasan Pria';
      else if (subcategory === 'Bottoms') finalCategory = 'Celana Pria';
      else if (subcategory === 'Footwear') finalCategory = 'Sepatu Pria';
      else if (subcategory === 'Outerwear') finalCategory = 'Jaket Pria';
      else if (subcategory === 'Aksesoris') finalCategory = 'Aksesoris Pria';
    } else if (segment === 'Kids') {
      if (subcategory === 'Tops') finalCategory = 'Atasan Anak';
      else if (subcategory === 'Bottoms') finalCategory = 'Celana Anak';
      else if (subcategory === 'Toys') finalCategory = 'Mainan Anak';
      else if (subcategory === 'Aksesoris') finalCategory = 'Aksesoris Anak';
    }

    onPublishListing({
      ...(initialProduct || {}),
      name: displayName,
      brand,
      size,
      category: finalCategory,
      condition: condition as any,
      description: displayDescription,
      price,
      imagePrimary: photos.depan || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrhdI843bQdpMFp8kbPiZL85TEhBMNfRDdvsR5vP570EccF_YcIkxry9d5eFMWJz8SQhM9OS55kzsbQkophmT9Oq0VhYZ0z9aNxO0NiTCZNtc8WbAX-i8uxa-ainus5nyFkhvZWrPKAzoJFI2A8LhQOa8G0AV95j19MIXCch_4aHz_TiwBq2hRVYBNVyoW-dQdRIAtL64VhxFdFn42F2ywBGmYXymImoql2sNBpOlpG16xwLIAygERb3UdUeymuKdcbaWc3m31hjVG',
      imageHover: photos.belakang || photos.depan || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY7RgKRR--WV_tAd9SPVkiCsi8eLuii-7l7lxX2C8dyEhHpCKjWb5627gWUMBiMbBJsi16MlVBl0KzVr6yM4qOCLIBdSieAwyB11X81dc77fOvUkgUrN-iMr73YacBV7bzavKAV7cxhcmGReVGLaJobEicNTqhnvKiLvs9D9oQu0opEDIxkdX1US33G4Yw887vPTc-tJ-ddZOia8OGA-q0D-p2Bh0Z1sQvHMaVQO5Txo7CyQyUPpuErLVXa9r9mdkZlM330fl152Vx',
      isVerified: true,
      sellerName: initialProduct ? initialProduct.sellerName : 'UrbanArchive Vintage',
      sellerRating: initialProduct ? initialProduct.sellerRating : 4.9,
      imageTag: photos.tag,
      imageMinus: photos.minus,
      imageDetail: photos.detail,
    });
    setPublishSuccess(true);
  };

  if (publishSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 font-geist max-w-[500px] mx-auto w-full">
        <div className="w-20 h-20 bg-[#c0edd3] text-[#002d1c] rounded-full flex items-center justify-center shadow-lg mb-8">
          <Check size={40} className="stroke-[3]" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#002d1c] tracking-tight mb-2">
          {initialProduct ? 'Listing Berhasil Diperbarui!' : 'Produk Berhasil Di-publish!'}
        </h1>
        <p className="text-sm text-[#414944] leading-relaxed mb-8">
          {initialProduct 
            ? 'Perubahan listing preloved Anda resmi disimpan dan diperbarui di katalog sirkular RE-LOVE.'
            : 'Listing barang preloved Anda resmi dipublikasikan di katalog sirkular RE-LOVE dan telah diamankan dengan sistem perlindungan pembayaran.'}
        </p>

        <button
          onClick={() => {
            setPublishSuccess(false);
            if (initialProduct) {
              navigate('seller-products');
            } else {
              navigate('seller-dashboard');
            }
          }}
          className="w-full bg-[#002d1c] text-white hover:opacity-95 text-xs py-4 rounded-[16px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          {initialProduct ? 'Kembali ke Kelola Produk' : 'Kembali ke Dashboard Penjual'}
        </button>
      </div>
    );
  }

  const step = getStepNumber();

  return (
    <div className="flex flex-col gap-8 py-4 max-w-[800px] mx-auto w-full relative">
      {/* Hidden file input for real uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />
      {/* 1. Universal Multi-step visual progress bar */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 font-geist text-xs text-[#414944] font-bold border-b border-[#f0edec] pb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1.5 hover:text-[#002d1c] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? 'bg-[#002d1c] border-transparent text-white' : 'border-[#c1c8c2]'}`}>1</span>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? 'bg-[#002d1c] border-transparent text-white' : 'border-[#c1c8c2]'}`}>2</span>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? 'bg-[#002d1c] border-transparent text-white' : 'border-[#c1c8c2]'}`}>3</span>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 4 ? 'bg-[#002d1c] border-transparent text-white' : 'border-[#c1c8c2]'}`}>4</span>
        </div>

        <span className="text-[#002d1c] tracking-widest text-[10px] uppercase font-black">Langkah {step} dari 4</span>
      </section>

      {/* 2. Step View Selector */}
      {step === 1 && (
        <section className="bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm flex flex-col gap-6 font-geist">
          <div className="border-b border-[#f0edec] pb-4 mb-2">
            <h2 className="font-display font-bold text-xl text-[#002d1c]">Informasi Umum Barang</h2>
            <p className="text-xs text-[#414944] mt-0.5">Tulis detail produk preloved Anda dengan jujur & transparan.</p>
          </div>

          <div className="space-y-5">
            {/* Input Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#414944] uppercase tracking-wider" htmlFor="product-name">
                Nama Barang *
              </label>
              <input
                id="product-name"
                className="bg-[#fcf9f8] p-4 rounded-[16px] border border-[#c1c8c2]/55 focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none text-xs text-[#1c1b1b] font-medium"
                placeholder="cth. Jaket Vintage Levi's Denim Blue"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Input Category */}
            <div className="flex flex-col gap-2 text-left">
              <span className="text-xs font-bold text-[#414944] uppercase tracking-wider">Kategori Barang *</span>
              
              {/* Segment selection (Womens, Mens, Kids) */}
              <div className="flex flex-wrap gap-2 mb-2">
                {['Womens', 'Mens', 'Kids'].map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => handleSegmentChange(seg as any)}
                    className={`px-6 py-2.5 border transition-all text-xs font-bold rounded-full cursor-pointer ${
                      segment === seg
                        ? 'border-[#002d1c] bg-[#1a4331]/5 text-[#002d1c]'
                        : 'border-[#c1c8c2]/55 text-[#414944] hover:border-[#002d1c]'
                    }`}
                  >
                    {seg}
                  </button>
                ))}
              </div>

              {/* Subcategory Dropdown selection */}
              <div className="flex flex-col gap-1.5">
                <select
                  value={subcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="bg-[#fcf9f8] p-4 rounded-[16px] border border-[#c1c8c2]/55 focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none text-xs text-[#1c1b1b] font-medium cursor-pointer"
                >
                  {getSubcategoriesForSegment(segment).map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input Size (Adapts to Category) */}
            <div className="flex flex-col gap-2 text-left">
              <span className="text-xs font-bold text-[#414944] uppercase tracking-wider">Size *</span>
              <div className="flex flex-wrap gap-2">
                {getSizeOptions(subcategory).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSize(sz)}
                    className={`px-4 py-2 border transition-all text-xs font-bold rounded-xl cursor-pointer ${
                      size === sz
                        ? 'border-[#002d1c] bg-[#1a4331]/5 text-[#002d1c]'
                        : 'border-[#c1c8c2]/55 text-[#414944] hover:border-[#002d1c]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-[10px] text-[#414944] font-semibold">Atau ketik ukuran kustom:</span>
                <input
                  className="bg-[#fcf9f8] px-3 py-1.5 rounded-lg border border-[#c1c8c2]/55 focus:border-[#002d1c] outline-none text-xs text-[#1c1b1b] w-28 font-medium"
                  placeholder="cth. 32 / M fit L"
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
            </div>

            {/* Input Warna (Swatches) */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#414944] uppercase tracking-wider">Warna Barang *</span>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {colors.map((clr) => (
                  <button
                    key={clr.name}
                    type="button"
                    onClick={() => setColor(clr.name)}
                    className={`relative flex flex-col items-center justify-center p-2 border rounded-xl transition-all hover:bg-[#fcf9f8] ${
                      color === clr.name
                        ? 'border-[#002d1c] bg-[#1a4331]/5 ring-1 ring-[#002d1c]'
                        : 'border-[#c1c8c2]/35'
                    }`}
                  >
                    {/* Color Circle Swatch */}
                    <div 
                      className={`w-4 h-4 rounded-full mb-1 shadow-sm border ${clr.bgClass || ''}`}
                      style={clr.hex ? { backgroundColor: clr.hex, borderColor: clr.border || 'transparent' } : undefined}
                    />
                    <span className="text-[9px] font-bold text-[#414944]">{clr.name}</span>
                    {color === clr.name && (
                      <span className="absolute top-0.5 right-0.5 bg-[#002d1c] text-white rounded-full p-0.5">
                        <Check size={6} className="stroke-[3]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-[10px] text-[#414944] font-semibold">Atau ketik warna kustom:</span>
                <input
                  className="bg-[#fcf9f8] px-3 py-1.5 rounded-lg border border-[#c1c8c2]/55 focus:border-[#002d1c] outline-none text-xs text-[#1c1b1b] w-36 font-medium"
                  placeholder="cth. Navy, Olive, Maroon"
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            {/* Input Brand (With No Brand option) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#414944] uppercase tracking-wider" htmlFor="product-brand">
                  Brand *
                </label>
                <button
                  type="button"
                  onClick={() => setBrand('No Brand')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all border ${
                    brand === 'No Brand'
                      ? 'bg-[#002d1c] border-transparent text-white'
                      : 'bg-[#fcf9f8] border-[#c1c8c2]/60 text-[#414944] hover:bg-[#ebe7e7]'
                  }`}
                >
                  No Brand
                </button>
              </div>
              <input
                id="product-brand"
                className="bg-[#fcf9f8] p-4 rounded-[16px] border border-[#c1c8c2]/55 focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none text-xs text-[#1c1b1b] font-medium"
                placeholder="cth. Levi's, Nike, Uniqlo, dll."
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              
              {/* Popular Brand Suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="text-[10px] text-[#414944] font-semibold flex items-center mr-1">Rekomendasi:</span>
                {popularBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                      brand === b
                        ? 'border-[#002d1c] bg-[#1a4331]/5 text-[#002d1c] font-bold'
                        : 'border-[#c1c8c2]/35 text-[#414944] hover:border-[#c1c8c2]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Condition (With descriptions) */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#414944] uppercase tracking-wider">Kondisi Barang *</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {conditions.map((cond) => {
                  let badgeColor = '';
                  let condDesc = '';
                  if (cond === 'Baru') {
                    badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                    condDesc = 'Mulus total, tag masih terpasang';
                  } else if (cond === 'Seperti Baru') {
                    badgeColor = 'text-[#002d1c] bg-[#1a4331]/5 border-[#c1c8c2]';
                    condDesc = 'Jika ada minus hampir tidak terlihat';
                  } else if (cond === 'Digunakan dengan Baik') {
                    badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
                    condDesc = 'Hanya ada beberapa minus yang terlihat';
                  } else {
                    badgeColor = 'text-red-700 bg-red-50 border-red-200';
                    condDesc = 'Ada minus yang selengkapnya dijelaskan dideskripsi';
                  }

                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCondition(cond)}
                      className={`flex flex-col items-start text-left p-3 border transition-all rounded-xl ${
                        condition === cond
                          ? 'border-[#002d1c] bg-[#1a4331]/5 ring-1 ring-[#002d1c]'
                          : 'border-[#c1c8c2]/55 hover:border-[#002d1c]'
                      }`}
                    >
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-1.5 ${badgeColor}`}>
                        {cond}
                      </span>
                      <p className="text-[9px] text-[#414944] leading-relaxed font-medium">
                        {condDesc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#414944] uppercase tracking-wider" htmlFor="product-description">
                Deskripsi Tambahan & Minus *
              </label>
              <textarea
                id="product-description"
                className="bg-[#fcf9f8] p-4 rounded-[16px] border border-[#c1c8c2]/55 focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none text-xs text-[#1c1b1b] resize-none h-32"
                placeholder="Terangkan minus atau keunikan dari barang preloved Anda di sini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Photos */}
      {step === 2 && (
        <section className="bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm flex flex-col gap-6 font-geist">
          <div className="border-b border-[#f0edec] pb-4 mb-2">
            <h2 className="font-display font-bold text-xl text-[#002d1c]">Unggah 5 Foto</h2>
            <p className="text-xs text-[#414944] mt-0.5">Demi akurasi kurasi, wajib unggah foto dari 5 sudut wajib berikut secara jelas.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Slot Depan */}
            <div 
              onClick={() => handlePhotoClick('depan')}
              className={`relative border-2 border-dashed transition-colors rounded-xl aspect-square flex flex-col items-center justify-center text-center p-3 cursor-pointer overflow-hidden ${
                photos.depan ? 'border-emerald-500 bg-emerald-50/10' : 'border-[#002d1c]/40 hover:border-[#002d1c] bg-[#002d1c]/5'
              }`}
            >
              {photos.depan ? (
                <>
                  <img src={photos.depan} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="text-white text-[9px] font-bold bg-[#002d1c] px-2 py-0.5 rounded">Ubah</span>
                    <button 
                      onClick={(e) => handleRemovePhoto('depan', e)}
                      className="p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">Depan</span>
                </>
              ) : (
                <>
                  <Camera size={24} className="text-[#002d1c] mb-1.5" />
                  <span className="text-[9px] font-bold text-[#002d1c]">Depan</span>
                </>
              )}
            </div>

            {/* Slot Belakang */}
            <div 
              onClick={() => handlePhotoClick('belakang')}
              className={`relative border-2 border-dashed transition-colors rounded-xl aspect-square flex flex-col items-center justify-center text-center p-3 cursor-pointer overflow-hidden ${
                photos.belakang ? 'border-emerald-500 bg-emerald-50/10' : 'border-[#c1c8c2] hover:border-[#002d1c]'
              }`}
            >
              {photos.belakang ? (
                <>
                  <img src={photos.belakang} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="text-white text-[9px] font-bold bg-[#002d1c] px-2 py-0.5 rounded">Ubah</span>
                    <button 
                      onClick={(e) => handleRemovePhoto('belakang', e)}
                      className="p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">Belakang</span>
                </>
              ) : (
                <>
                  <Camera size={20} className="text-[#414944] mb-1.5" />
                  <span className="text-[9px] text-[#414944]">Belakang</span>
                </>
              )}
            </div>

            {/* Slot Tag */}
            <div 
              onClick={() => handlePhotoClick('tag')}
              className={`relative border-2 border-dashed transition-colors rounded-xl aspect-square flex flex-col items-center justify-center text-center p-3 cursor-pointer overflow-hidden ${
                photos.tag ? 'border-emerald-500 bg-emerald-50/10' : 'border-[#c1c8c2] hover:border-[#002d1c]'
              }`}
            >
              {photos.tag ? (
                <>
                  <img src={photos.tag} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="text-white text-[9px] font-bold bg-[#002d1c] px-2 py-0.5 rounded">Ubah</span>
                    <button 
                      onClick={(e) => handleRemovePhoto('tag', e)}
                      className="p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">Label/Tag</span>
                </>
              ) : (
                <>
                  <Camera size={20} className="text-[#414944] mb-1.5" />
                  <span className="text-[9px] text-[#414944]">Label/Tag</span>
                </>
              )}
            </div>

            {/* Slot Minus */}
            <div 
              onClick={() => handlePhotoClick('minus')}
              className={`relative border-2 border-dashed transition-colors rounded-xl aspect-square flex flex-col items-center justify-center text-center p-3 cursor-pointer overflow-hidden ${
                photos.minus ? 'border-emerald-500 bg-emerald-50/10' : 'border-red-200 hover:border-red-400 bg-red-50/25'
              }`}
            >
              {photos.minus ? (
                <>
                  <img src={photos.minus} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="text-white text-[9px] font-bold bg-[#002d1c] px-2 py-0.5 rounded">Ubah</span>
                    <button 
                      onClick={(e) => handleRemovePhoto('minus', e)}
                      className="p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">Minus</span>
                </>
              ) : (
                <>
                  <Camera size={20} className="text-red-600 mb-1.5" />
                  <span className="text-[9px] text-red-600 font-bold">Detail Minus</span>
                </>
              )}
            </div>

            {/* Slot Detail */}
            <div 
              onClick={() => handlePhotoClick('detail')}
              className={`relative border-2 border-dashed transition-colors rounded-xl aspect-square flex flex-col items-center justify-center text-center p-3 cursor-pointer overflow-hidden ${
                photos.detail ? 'border-emerald-500 bg-emerald-50/10' : 'border-[#c1c8c2] hover:border-[#002d1c]'
              }`}
            >
              {photos.detail ? (
                <>
                  <img src={photos.detail} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="text-white text-[9px] font-bold bg-[#002d1c] px-2 py-0.5 rounded">Ubah</span>
                    <button 
                      onClick={(e) => handleRemovePhoto('detail', e)}
                      className="p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">Detail Bahan</span>
                </>
              ) : (
                <>
                  <Camera size={20} className="text-[#414944] mb-1.5" />
                  <span className="text-[9px] text-[#414944]">Detail Bahan</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-[#f0edec] p-4 rounded-xl flex flex-col gap-2.5 mt-4 border border-[#c1c8c2]/20 text-xs text-left">
            <div className="flex gap-3 items-start">
              <Sparkles size={18} className="text-[#002d1c] flex-shrink-0 mt-0.5" />
              <p className="text-[#414944] leading-relaxed">
                Tim admin RE-LOVE akan me-review 5 sudut di atas guna menjamin keaslian barang serta transparansi.
              </p>
            </div>
            <div className="border-t border-[#c1c8c2]/35 pt-2 flex flex-col gap-1 text-[11px] text-[#414944]/80 font-medium pl-7 list-none">
              <div>• Batas ukuran masing-masing file foto maksimal <strong>5 MB</strong>.</div>
              <div>• Format foto yang didukung hanya <strong>PNG, JPG, atau JPEG</strong>.</div>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Pricing estimates with Slider */}
      {step === 3 && (
        <section className="bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm flex flex-col gap-6 font-geist">
          <div className="border-b border-[#f0edec] pb-4 mb-2">
            <h2 className="font-display font-bold text-xl text-[#002d1c]">Harga & Estimasi Terpilih</h2>
            <p className="text-xs text-[#414944] mt-0.5">Tentukan nilai tukar sirkular preloved terbaik bagi barang Anda.</p>
          </div>

          <div className="space-y-6">
            {/* Dynamic Price Recommendations Banner (FR-02) */}
            <div className="bg-[#f6f3f2] rounded-[24px] p-5 border border-[#c1c8c2]/35 flex flex-col gap-3 font-geist">
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-[#002d1c] fill-[#c0edd3]/50" />
                <span className="text-xs font-extrabold text-[#002d1c] uppercase tracking-wider"> Price Recommendation</span>
              </div>
              
              {getPricingStats() ? (
                <div className="space-y-2">
                  <p className="text-xs text-[#414944] leading-relaxed">
                    Berdasarkan riwayat transaksi produk serupa (<span className="font-bold">{brand} - {category}</span>) di platform RE-LOVE 30 hari terakhir:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    <div className="bg-white p-3 rounded-xl border border-[#f0edec]">
                      <span className="text-[9px] text-[#414944] uppercase tracking-wider font-bold">Harga Rerata Terjual</span>
                      <p className="text-[#002d1c] font-black text-sm mt-0.5">
                        Rp {getPricingStats()?.avg.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#f0edec]">
                      <span className="text-[9px] text-[#414944] uppercase tracking-wider font-bold">Rentang Harga Pasar</span>
                      <p className="text-[#1c1b1b] font-extrabold text-xs mt-0.5">
                        Rp {getPricingStats()?.min.toLocaleString('id-ID')} - Rp {getPricingStats()?.max.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1.5 mt-1">
                    <Check size={12} className="stroke-[3]" />
                    <span>Rekomendasi harga berhasil diaplikasikan secara otomatis ke penggeser Anda!</span>
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 text-xs text-[#8a5710] bg-[#fdfaf2] border border-[#f3ebcd] rounded-xl p-3.5">
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Data harga belum tersedia untuk kategori ini</p>
                    <p className="opacity-90 mt-0.5">
                      Jumlah riwayat penjualan untuk kategori <span className="font-bold">"{category}"</span> dengan brand <span className="font-bold">"{brand || '-'}"</span> masih di bawah 5 transaksi. Silakan tentukan harga jual Anda secara mandiri.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#fcf9f8] p-6 rounded-[24px] border border-[#c1c8c2]/35 shadow-inner">
              <span className="text-xs font-bold text-[#414944] uppercase tracking-wider">Harga Penjualan (IDR)</span>
              
              {/* Interactive Manual Price Input */}
              <div className="my-4 flex items-center bg-white p-4 rounded-[16px] border border-[#c1c8c2]/55 focus-within:border-[#002d1c] focus-within:ring-1 focus-within:ring-[#002d1c]">
                <span className="text-xl font-display font-extrabold text-[#002d1c] mr-2">Rp</span>
                <input
                  type="number"
                  value={price === 0 ? '' : price}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPrice(val);
                  }}
                  placeholder="Masukkan harga manual..."
                  className="bg-transparent w-full text-xl font-display font-extrabold text-[#002d1c] outline-none border-none p-0 focus:ring-0"
                />
              </div>

              <input
                className="w-full h-2 bg-[#f0edec] rounded-lg appearance-none cursor-pointer accent-[#002d1c]"
                max={5000000}
                min={50000}
                step={50000}
                type="range"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <div className="flex justify-between text-[10px] text-[#414944] font-medium mt-1">
                <span>Rp 50.000 (Min)</span>
                <span>Rp 5.000.000 (Max)</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Preview Card prior to final publication */}
      {step === 4 && (
        <section className="bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm flex flex-col gap-6 font-geist">
          <div className="border-b border-[#f0edec] pb-4 mb-2">
            <h2 className="font-display font-bold text-xl text-[#002d1c]">Pratinjau Pengajuan</h2>
            <p className="text-xs text-[#414944] mt-0.5">Pastikan semua data di bawah ini benar sebelum diposting di katalog.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-[24px] bg-[#fcf9f8] border border-[#c1c8c2]/35 shadow-inner">
            <div className="w-full sm:w-36 h-48 rounded-xl bg-[#ebe7e7] overflow-hidden flex-shrink-0 border border-black/5">
              <img alt="Pratinjau" className="w-full h-full object-cover" referrerPolicy="no-referrer" src={photos.depan || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrhdI843bQdpMFp8kbPiZL85TEhBMNfRDdvsR5vP570EccF_YcIkxry9d5eFMWJz8SQhM9OS55kzsbQkophmT9Oq0VhYZ0z9aNxO0NiTCZNtc8WbAX-i8uxa-ainus5nyFkhvZWrPKAzoJFI2A8LhQOa8G0AV95j19MIXCch_4aHz_TiwBq2hRVYBNVyoW-dQdRIAtL64VhxFdFn42F2ywBGmYXymImoql2sNBpOlpG16xwLIAygERb3UdUeymuKdcbaWc3m31hjVG'} />
            </div>
            
            <div className="flex flex-col justify-between flex-grow">
              <div className="space-y-1.5">
                <span className="text-[10px] bg-[#002d1c] text-white px-2.5 py-0.5 rounded-full uppercase tracking-widest font-black">
                  KONDISI: {condition}
                </span>
                <h3 className="text-md font-extrabold text-[#1c1b1b] leading-tight pt-1">{name || 'Nama Produk'}</h3>
                <p className="text-xs text-[#414944] font-medium uppercase tracking-wider">{brand || 'Brand'}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-[#ebe7e7] text-on-surface text-[10px] px-3 py-1 rounded">Ukuran: {size}</span>
                  <span className="bg-[#ebe7e7] text-on-surface text-[10px] px-3 py-1 rounded">Kategori: {segment} - {subcategory}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f0edec] mt-4 flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#414944]">Harga Barang</span>
                <span className="text-xl font-black text-[#002d1c]">Rp {price.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Global CTA / Step controller panels */}
      <section className="flex flex-col gap-4">
        {step === 2 && !isPhotoStepComplete && (
          <div className="w-full text-center bg-red-50 text-red-700 text-xs py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 border border-red-200">
            <AlertCircle size={14} />
            <span>Harap lengkapi semua 5 foto wajib (Depan, Belakang, Tag, Minus, Detail) sebelum melanjutkan.</span>
          </div>
        )}

        <div className="flex gap-4 w-full">
          {step > 1 && (
            <button
              onClick={handleGoBack}
              className="w-1/3 bg-transparent border border-[#002d1c] hover:bg-[#002d1c]/5 text-[#002d1c] font-geist font-bold text-xs h-14 rounded-[16px] transition-all active:scale-95"
            >
              Kembali
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="flex-grow bg-[#002d1c] text-white hover:opacity-95 font-geist font-black text-xs uppercase tracking-wider h-14 rounded-[16px] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Selanjutnya</span>
              <ArrowRight size={14} className="text-[#c0edd3]" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="flex-grow bg-[#002d1c] text-white hover:opacity-95 font-geist font-black text-xs uppercase tracking-wider h-14 rounded-[16px] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#002d1c]/10"
            >
              <span> Update Listing</span>
            </button>
          )}
        </div>
      </section>

      {/* Photo Simulator Modal (FR-01) */}
      {activePhotoSlot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-geist">
          <div className="bg-white rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl border border-[#f0edec]">
            {/* Header */}
            <div className="p-6 border-b border-[#f0edec] flex justify-between items-center bg-[#fcf9f8]">
              <div>
                <h3 className="text-base font-bold text-[#002d1c] mt-0.5">{getSlotGuide(activePhotoSlot).title}</h3>
              </div>
              <button 
                onClick={() => setActivePhotoSlot(null)}
                className="p-2 hover:bg-[#ebe7e7] rounded-full transition-colors"
              >
                <X size={18} className="text-[#414944]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-5">
              <p className="text-xs text-[#414944] leading-relaxed text-left">
                {getSlotGuide(activePhotoSlot).desc}
              </p>

              {/* Simulated Camera Viewfinder */}
              <div className="relative aspect-[4/3] bg-neutral-900 rounded-2xl overflow-hidden border-4 border-neutral-800 shadow-inner flex items-center justify-center">
                {simulatedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <img 
                      src={simulatedImage} 
                      alt="Simulated Capture" 
                      className={`max-w-full max-h-full object-contain transition-all duration-200 ${
                        rotation === 90 ? 'rotate-90' : 
                        rotation === 180 ? 'rotate-180' : 
                        rotation === 270 ? 'rotate-270' : ''
                      } ${isCropped ? 'scale-90 p-2 border border-dashed border-emerald-500' : ''}`}
                    />
                    
                    {/* Visual 1:1 Square Crop Overlay */}
                    {isCropped && (
                      <div className="absolute w-[80%] aspect-square border-2 border-dashed border-emerald-500 pointer-events-none flex items-center justify-center bg-black/10">
                        <span className="text-[9px] font-bold text-emerald-400 bg-black/75 px-2 py-0.5 rounded shadow tracking-wide">
                          TINJAUAN POTONGAN PERSEGI
                        </span>
                      </div>
                    )}

                    {/* Visual Guideline Overlay over the preview */}
                    <div className="absolute inset-0 border border-white/25 pointer-events-none flex items-center justify-center">
                      <div className="w-11/12 h-5/6 border border-dashed border-white/35 rounded flex items-center justify-center">
                        <span className="text-[8px] text-white/90 bg-[#002d1c]/90 px-2 py-1 rounded font-bold uppercase tracking-wider">
                          Panduan: {getSlotGuide(activePhotoSlot).overlay}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 text-white/60">
                    <Camera size={44} className="stroke-[1.5] mb-2 text-white/40" />
                    <p className="text-xs font-medium">Belum ada foto terpilih</p>
                  </div>
                )}

                {/* Viewfinder Overlay Frame */}
                <div className="absolute inset-4 border border-dashed border-white/20 rounded pointer-events-none"></div>
                <div className="absolute top-3 left-3 bg-emerald-600 w-2.5 h-2.5 rounded-full animate-pulse"></div>
                <div className="absolute top-3 right-3 text-[9px] text-white/80 font-mono tracking-widest bg-black/50 px-2 py-0.5 rounded">
                  HD PREVIEW
                </div>
              </div>

              {/* Sunting Tools (FR-01: Preview foto dengan opsi rotasi dan crop) */}
              {simulatedImage && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between gap-3">
                    <button
                      onClick={() => setRotation(r => (r + 90) % 360)}
                      className="flex-1 border border-[#c1c8c2] hover:bg-[#f6f3f2] text-[#414944] text-xs py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCw size={14} />
                      <span>Putar 90°</span>
                    </button>
                    <button
                      onClick={() => setIsCropped(c => !c)}
                      className={`flex-1 border text-xs py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCropped 
                          ? 'bg-[#1a4331]/10 border-[#002d1c] text-[#002d1c]' 
                          : 'border-[#c1c8c2] hover:bg-[#f6f3f2] text-[#414944]'
                      }`}
                    >
                      <Crop size={14} />
                      <span>{isCropped ? 'Batal Potong' : 'Potong (Crop)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-6 bg-[#fcf9f8] border-t border-[#f0edec] flex gap-3">
              <button
                onClick={() => setActivePhotoSlot(null)}
                className="flex-1 border border-[#002d1c] text-[#002d1c] hover:bg-[#002d1c]/5 text-xs py-3.5 rounded-[14px] font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={!simulatedImage}
                onClick={handleSavePhoto}
                className="flex-1 bg-[#002d1c] text-white hover:opacity-95 disabled:opacity-40 text-xs py-3.5 rounded-[14px] font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check size={14} />
                <span>Simpan Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
