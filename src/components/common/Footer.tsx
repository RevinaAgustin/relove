/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FooterProps {
  navigate: (screen: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="w-full rounded-t-[40px] mt-24 bg-[#f0edec] border-t border-black/5 dark:bg-[#1c1b1b]/5 py-16 px-6 md:px-16 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <span 
          onClick={() => navigate('explore')}
          className="font-display text-3xl font-extrabold tracking-tighter text-[#002d1c] cursor-pointer"
        >
          RE-LOVE
        </span>
        <p className="font-body text-sm text-[#414944] mt-2 max-w-xs">
          Membangun ekosistem circular fashion berkelanjutan untuk masa depan bumi kita. Terkurasi dan Terverifikasi.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-geist text-sm text-[#414944]">
        <button onClick={() => navigate('explore')} className="hover:text-[#002d1c] transition-colors">How it works</button>
        <button onClick={() => navigate('explore')} className="hover:text-[#002d1c] transition-colors">Sustainability Manifesto</button>
        <button onClick={() => navigate('profile')} className="hover:text-[#002d1c] transition-colors">Privacy Policy</button>
        <button onClick={() => navigate('seller-dashboard')} className="hover:text-primary font-bold">Seller Dashboard</button>
      </div>

      <div className="font-body text-xs text-[#414944]/70 text-center md:text-right">
        © 2026 RE-LOVE Marketplace. All rights reserved.
      </div>
    </footer>
  );
};
