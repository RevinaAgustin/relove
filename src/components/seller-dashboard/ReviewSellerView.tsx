/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, Camera, Check, Sparkles, MessageSquare } from 'lucide-react';

interface ReviewSellerViewProps {
  onSubmitReview: (stars: number, text: string) => void;
  sellerName: string;
  productName: string;
}

export const ReviewSellerView: React.FC<ReviewSellerViewProps> = ({
  onSubmitReview,
  sellerName,
  productName,
}) => {
  const [rating, setRating] = useState<number>(4);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedTags, setSelectedCategoryTags] = useState<string[]>(['Kualitas Sesuai']);
  const [reviewText, setReviewText] = useState('');

  const availableTags = ['Respon Cepat', 'Kualitas Sesuai', 'Packing Aman', 'Pengiriman Cepat', 'Ramah'];

  const toggleTag = (tag: string) => {
    setSelectedCategoryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePublishReview = () => {
    let finalMsg = reviewText;
    if (finalMsg.trim() === '') {
      finalMsg = `Pengalaman luar biasa! ${selectedTags.join(', ')}.`;
    }
    onSubmitReview(rating, finalMsg);
  };

  return (
    <div className="flex flex-col gap-8 py-4 max-w-[768px] mx-auto w-full">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">Bagaimana pesanan Anda?</h1>
        <p className="font-body text-sm text-[#414944] max-w-lg mx-auto">
          Terima kasih telah berpartisipasi dan melestarikan ekosistem pakaian sirkular. Ulasan jujur Anda sangat membantu kurasi RE-LOVE.
        </p>
      </div>

      {/* Seller & Item Inclosure Box */}
      <section className="bg-white rounded-[24px] p-6 border border-[#f0edec] shadow-sm flex items-center gap-5">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-[#002d1c] text-white font-display font-extrabold flex items-center justify-center text-xl shadow">
          {sellerName.charAt(0)}
        </div>
        <div>
          <p className="font-geist text-[10px] text-[#414944] uppercase tracking-wider font-bold mb-0.5">Penjual</p>
          <h3 className="font-display text-md font-extrabold text-[#1c1b1b]">{sellerName}</h3>
          <p className="font-geist text-xs text-[#414944] mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#3e6752]"></span>
            {productName}
          </p>
        </div>
      </section>

      {/* Review Interactive Form */}
      <section className="bg-white rounded-[24px] p-8 border border-[#f0edec] shadow-sm flex flex-col gap-8">
        
        {/* Star Interactive rating */}
        <div className="flex flex-col items-center gap-3">
          <p className="font-geist text-xs font-bold text-[#414944] uppercase tracking-wider">Beri nilai pengalaman Anda</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((starIdx) => {
              const isActive = (hoveredRating !== null ? hoveredRating : rating) >= starIdx;
              return (
                <button
                  key={starIdx}
                  onClick={() => setRating(starIdx)}
                  onMouseEnter={() => setHoveredRating(starIdx)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="focus:outline-none transition-transform active:scale-95 duration-100"
                >
                  <Star
                    size={40}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-[#002d1c] fill-[#002d1c]' : 'text-[#ebe7e7]'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <p className="font-geist text-xs text-[#002d1c] font-black capitalize">
            {rating === 5 && 'Sempurna'}
            {rating === 4 && 'Sangat Bagus'}
            {rating === 3 && 'Cukup Baik'}
            {rating === 2 && 'Buruk'}
            {rating === 1 && 'Sangat Buruk'}
          </p>
        </div>

        {/* Quick Review Feedback Tags Selector */}
        <div className="space-y-3 font-geist">
          <p className="text-xs font-bold text-[#414944] uppercase tracking-wider">Apa yang paling Anda sukai?</p>
          <div className="flex flex-wrap gap-2.5">
            {availableTags.map((tag) => {
              const checked = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full border transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 ${
                    checked
                      ? 'border-[#002d1c] bg-[#1a4331]/5 text-[#002d1c] font-bold'
                      : 'border-[#c1c8c2] text-[#414944] hover:border-[#002d1c]'
                  }`}
                >
                  {checked && <Check size={12} className="text-[#002d1c]" />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text description Area */}
        <div className="space-y-2 font-geist">
          <label className="text-xs font-bold text-[#414944] uppercase tracking-wider flex items-center gap-1.5" htmlFor="review-text">
            <MessageSquare size={14} />
            <span>Detail Ulasan</span>
          </label>
          <textarea
            id="review-text"
            className="w-full bg-[#fcf9f8] p-4 rounded-[16px] border border-[#c1c8c2]/35 focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none font-body text-sm text-[#1c1b1b] resize-none h-32 transition-all placeholder:text-[#414944]/55"
            placeholder="Ceritakan pengalaman belanja Anda dengan penjual ini..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>

        {/* Dynamic fake photo upload */}
        <div className="space-y-2 font-geist">
          <p className="text-xs font-bold text-[#414944] uppercase tracking-wider">Tambah Foto (Opsional)</p>
          <button className="w-full sm:w-auto h-32 aspect-[4/3] border-2 border-dashed border-[#c1c8c2]/50 hover:border-[#002d1c] rounded-[16px] flex flex-col items-center justify-center gap-2 text-[#414944] hover:bg-[#1a4331]/5 transition-all group p-4">
            <Camera size={24} className="group-hover:text-[#002d1c] transition-colors" />
            <span className="text-xs group-hover:text-[#002d1c] transition-colors text-center leading-normal">
              Unggah Foto Kondisi
            </span>
          </button>
        </div>

        {/* CTA Submit Button */}
        <button
          onClick={handlePublishReview}
          className="w-full bg-[#002d1c] text-white hover:opacity-95 font-geist font-black text-xs uppercase tracking-wider h-14 rounded-[16px] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#002d1c]/10"
        >
          <span>Kirim Ulasan</span>
        </button>
      </section>
    </div>
  );
};
