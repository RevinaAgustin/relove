/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Wallet, ChevronDown, ChevronUp, Clock, User, ShieldCheck } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';

interface SellerFinanceViewProps {
  balance: number;
  onNavigate: (screen: any) => void;
  onGoBack: () => void;
}

export const SellerFinanceView: React.FC<SellerFinanceViewProps> = ({
  balance,
  onNavigate,
  onGoBack,
}) => {
  const [isEarningsExpanded, setIsEarningsExpanded] = useState(true);

  // Sold items contributing to the balance
  const soldProducts = [
    { id: 'sold-1', name: 'Kaos Band Vintage Original', price: 10700000, buyer: 'kolektor_sejati', date: '02 Jul 2026' },
    { id: 'sold-2', name: 'Sepatu Boots Kulit', price: 850000, buyer: 'sarah_j', date: '30 Jun 2026' },
    { id: 'sold-3', name: 'Jaket Denim Vintage Classic', price: 450000, buyer: 'budi_s', date: '28 Jun 2026' },
    { id: 'sold-4', name: 'Celana Cargo Corduroy', price: 220000, buyer: 'dinda_a', date: '25 Jun 2026' },
    { id: 'sold-5', name: 'Sweater Retro 80s', price: 130000, buyer: 'andi_p', date: '20 Jun 2026' },
    { id: 'sold-6', name: 'Kemeja Flanel Vintage', price: 100000, buyer: 'rian_k', date: '15 Jun 2026' },
  ];

  const breadcrumbItems = [
    { label: 'Dashboard Penjual', onClick: onGoBack },
    { label: 'Keuangan Toko' }
  ];

  return (
    <div className="flex flex-col gap-6 py-4 max-w-[800px] mx-auto w-full font-geist text-left">
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
          <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">Pendapatan Toko</h1>
        </div>
      </div>

      {/* Balance Card Container */}
      <section className="bg-white rounded-[24px] p-6 md:p-8 border border-[#f0edec] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Background gradient blur */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1a4331]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-1.5 z-10">
          <span className="text-[10px] uppercase font-bold text-[#414944] tracking-wider block">Total Saldo </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-black text-[#002d1c]">Rp {balance.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <button
          disabled={balance === 0}
          onClick={() => onNavigate('withdraw-funds')}
          className={`z-10 w-full md:w-auto px-8 py-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
            balance === 0
              ? 'bg-[#ebe7e7] text-[#414944]/40 cursor-not-allowed shadow-none'
              : 'bg-[#002d1c] text-white hover:opacity-95 active:scale-95 shadow-[#002d1c]/15 cursor-pointer'
          }`}
        >
          <Wallet size={14} />
          <span>Tarik Dana</span>
        </button>
      </section>

      {/* Collapsible Earnings History Section */}
      <section className="bg-white rounded-[24px] border border-[#f0edec] shadow-sm overflow-hidden">
        {/* Header Button Toggle */}
        <button
          onClick={() => setIsEarningsExpanded(!isEarningsExpanded)}
          className="w-full p-6 flex justify-between items-center bg-[#fcf9f8] border-b border-[#f0edec] cursor-pointer hover:bg-[#f6f3f2] transition-colors"
        >
          <div className="flex items-center gap-2 text-left">
            <span className="text-xs font-black text-[#002d1c] uppercase tracking-wider">Penghasilan Saya</span>
            <span className="px-2.5 py-0.5 bg-[#d4e5c7] text-[#002d1c] text-[9px] rounded-full font-bold uppercase">
              {soldProducts.length} Transaksi
            </span>
          </div>
          {isEarningsExpanded ? (
            <ChevronUp size={16} className="text-[#414944]" />
          ) : (
            <ChevronDown size={16} className="text-[#414944]" />
          )}
        </button>

        {isEarningsExpanded && (
          <div className="divide-y divide-[#f0edec]">
            {soldProducts.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-[#fcf9f8]/40 transition-colors"
              >
                {/* Left side details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#1c1b1b] text-sm">{item.name}</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                      Dana Dilepas
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-[#414944]/80">
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-[#414944]/60" />
                      Pembeli: <strong className="text-[#1c1b1b]">@{item.buyer}</strong>
                    </span>
                    <span className="text-neutral-300 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-[#414944]/60" />
                      Selesai: {item.date}
                    </span>
                  </div>
                </div>

                {/* Right side net amount */}
                <div className="text-right flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end gap-2 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-dashed border-[#c1c8c2]/40">
                  <span className="text-[10px] text-[#414944]/60 block sm:hidden font-medium">Pendapatan Bersih</span>
                  <div className="space-y-0.5">
                    <p className="font-black text-[#002d1c] text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                    <span className="text-[9px] block text-[#414944]/60">
                      Ongkir & Biaya platform tidak termasuk
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
