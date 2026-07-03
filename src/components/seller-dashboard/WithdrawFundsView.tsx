/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Check, Landmark, CreditCard, ShieldCheck, Plus, Trash2, CheckCircle2, AlertCircle, Star } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface WithdrawFundsViewProps {
  balance: number;
  onWithdrawSuccess: () => void;
  onGoBack: () => void;
}

export const WithdrawFundsView: React.FC<WithdrawFundsViewProps> = ({
  balance,
  onWithdrawSuccess,
  onGoBack,
}) => {
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('re_love_seller_bank_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          let hasDefault = false;
          const sanitized = parsed.map((a) => {
            if (a.isDefault) {
              if (hasDefault) {
                return { ...a, isDefault: false };
              }
              hasDefault = true;
            }
            return a;
          });
          if (!hasDefault && sanitized.length > 0) {
            sanitized[0].isDefault = true;
          }
          return sanitized;
        }
      } catch (e) {
        // Fallback to empty
      }
    }
    return [];
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBankName, setNewBankName] = useState('Bank BCA');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newAccountName, setNewAccountName] = useState('');


  // Tracks the currently selected account for the pending withdrawal action
  const [selectedAccountId, setSelectedAccountId] = useState<string>(() => {
    const defaultAcc = accounts.find(a => a.isDefault);
    if (defaultAcc) return defaultAcc.id;
    return accounts.length > 0 ? accounts[0].id : '';
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const bankOptions = [
    'Bank BCA',
    'Bank Mandiri',
    'Bank BNI',
    'Bank BRI',
    'GoPay (E-Wallet)',
    'DANA (E-Wallet)',
    'OVO (E-Wallet)',
    'ShopeePay (E-Wallet)'
  ];

  const saveAccounts = (newAccs: BankAccount[]) => {
    setAccounts(newAccs);
    localStorage.setItem('re_love_seller_bank_accounts', JSON.stringify(newAccs));
    
    // Automatically select the default if it exists
    const def = newAccs.find(a => a.isDefault);
    if (def) {
      setSelectedAccountId(def.id);
    } else if (newAccs.length > 0 && !newAccs.some(a => a.id === selectedAccountId)) {
      setSelectedAccountId(newAccs[0].id);
    }
  };

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountNumber.trim() || !newAccountName.trim()) {
      alert('Harap isi semua kolom rekening!');
      return;
    }

    // Check duplicate account (same bank name and account/phone number)
    const isDuplicate = accounts.some(
      (a) =>
        a.bankName.toLowerCase().trim() === newBankName.toLowerCase().trim() &&
        a.accountNumber.trim() === newAccountNumber.trim()
    );

    if (isDuplicate) {
      alert('Rekening dengan nomor dan nama bank/e-wallet yang sama sudah terdaftar!');
      return;
    }

    const newAcc: BankAccount = {
      id: `acc-${Date.now()}`,
      bankName: newBankName,
      accountNumber: newAccountNumber,
      accountName: newAccountName,
      isDefault: accounts.length === 0
    };

    let updated = [...accounts];
    updated.push(newAcc);
    
    saveAccounts(updated);
    
    // Reset Form
    setNewAccountNumber('');
    setNewAccountName('');

    setIsAddingNew(false);
  };

  const handleSetDefault = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = accounts.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    saveAccounts(updated);
  };

  const handleDeleteAccount = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = accounts.find(a => a.id === id);
    let updated = accounts.filter(a => a.id !== id);
    
    if (target?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    
    saveAccounts(updated);
    if (selectedAccountId === id) {
      setSelectedAccountId(updated.length > 0 ? updated[0].id : '');
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId) {
      alert('Silakan tambahkan atau pilih rekening penarikan terlebih dahulu!');
      return;
    }
    setIsSuccess(true);
  };

  const activeAccount = accounts.find(a => a.id === selectedAccountId);

  const breadcrumbItems = [
    { label: 'Keuangan Toko', onClick: onGoBack },
    { label: 'Tarik Dana' }
  ];

  if (isSuccess && activeAccount) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 font-geist max-w-[500px] mx-auto w-full text-left">
        <div className="w-20 h-20 bg-[#c0edd3] text-[#002d1c] rounded-full flex items-center justify-center shadow-lg mb-8">
          <Check size={40} className="stroke-[3]" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-[#002d1c] tracking-tight mb-2">Penarikan Diajukan!</h1>
        <p className="text-xs text-[#414944] leading-relaxed mb-6">
          Dana sebesar <strong className="text-[#1c1b1b]">Rp {balance.toLocaleString('id-ID')}</strong> sedang diproses menuju rekening <strong className="text-[#1c1b1b]">{activeAccount.bankName} ({activeAccount.accountNumber})</strong> atas nama <strong className="text-[#1c1b1b]">{activeAccount.accountName}</strong>.
        </p>

        <div className="w-full bg-[#fcf9f8] p-4 border border-[#f0edec] rounded-2xl flex gap-3 text-xs leading-relaxed text-[#414944] mb-8">
          <ShieldCheck size={18} className="text-[#002d1c] flex-shrink-0 mt-0.5" />
          <p>Verifikasi sirkular RE-LOVE sedang memproses pengiriman dana. Estimasi waktu masuk 1x24 jam kerja.</p>
        </div>

        <button
          onClick={onWithdrawSuccess}
          className="w-full bg-[#002d1c] text-white hover:opacity-95 text-xs py-4 rounded-[16px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer text-center"
        >
          Kembali ke Keuangan Toko
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-[550px] mx-auto w-full font-geist text-left">
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
          <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">Tarik Dana</h1>
          <p className="text-xs text-[#414944] mt-0.5">Tarik saldo pendapatan Anda ke rekening bank atau e-wallet pilihan Anda.</p>
        </div>
      </div>

      {/* Balance Summary Display */}
      <div className="bg-[#1a4331]/5 rounded-[24px] p-6 border border-[#002d1c]/10 text-xs flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#414944] tracking-wider block mb-1">Jumlah Yang Akan Ditarik</span>
          <h2 className="text-2xl font-display font-black text-[#002d1c]">Rp {balance.toLocaleString('id-ID')}</h2>
        </div>
        <div className="bg-[#002d1c] text-[#c0edd3] px-3.5 py-1.5 rounded-xl font-bold font-mono text-[10px] uppercase tracking-wide">
          Dana Bersih
        </div>
      </div>

      {/* Sub-form to Add Account */}
      {isAddingNew ? (
        <form onSubmit={handleAddAccountSubmit} className="bg-white rounded-[24px] p-6 border border-[#002d1c] shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#f0edec]">
            <h3 className="font-display font-black text-xs text-[#002d1c] uppercase tracking-wider">Tambah Rekening Pribadi</h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs font-bold text-[#414944] hover:text-[#ba1a1a] cursor-pointer"
            >
              Batal
            </button>
          </div>

          {/* Choose Bank / E-Wallet */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#414944] uppercase tracking-wider flex items-center gap-1.5">
              <Landmark size={14} className="text-[#002d1c]" />
              <span>Rekening / E-Wallet *</span>
            </label>
            <select
              value={newBankName}
              onChange={(e) => setNewBankName(e.target.value)}
              className="bg-[#fcf9f8] p-3.5 rounded-[12px] border border-[#c1c8c2]/55 focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none text-xs text-[#1c1b1b] font-medium cursor-pointer"
            >
              {bankOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#414944] uppercase tracking-wider flex items-center gap-1.5" htmlFor="new-account-num">
              <CreditCard size={14} className="text-[#002d1c]" />
              <span>Nomor Rekening / No. HP E-Wallet *</span>
            </label>
            <input
              id="new-account-num"
              required
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={newAccountNumber}
              onChange={(e) => setNewAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="cth. 5048293819 atau 08129876543"
              className="bg-[#fcf9f8] p-3.5 rounded-[12px] border border-[#c1c8c2]/55 focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none text-xs text-[#1c1b1b] font-medium"
            />
          </div>

          {/* Account Holder Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#414944] uppercase tracking-wider" htmlFor="new-account-name">
              Nama Lengkap Pemilik Rekening *
            </label>
            <input
              id="new-account-name"
              required
              type="text"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              placeholder="cth. Sarah Jones"
              className="bg-[#fcf9f8] p-3.5 rounded-[12px] border border-[#c1c8c2]/55 focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] outline-none text-xs text-[#1c1b1b] font-medium"
            />
          </div>



          <button
            type="submit"
            className="w-full bg-[#002d1c] text-white hover:opacity-95 text-xs py-3.5 rounded-[12px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer text-center"
          >
            Simpan Rekening
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Main Account selection card block */}
          <div className="bg-white rounded-[24px] p-6 border border-[#f0edec] shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#f0edec] pb-3">
              <h3 className="font-display font-black text-xs text-[#002d1c] uppercase tracking-wider">Rekening Tujuan Penarikan</h3>
              
              <button
                onClick={() => setIsAddingNew(true)}
                className="text-[11px] font-black text-[#002d1c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Rekening</span>
              </button>
            </div>

            {accounts.length === 0 ? (
              // Empty State (Seller must add an account first)
              <div className="py-8 px-4 flex flex-col items-center text-center gap-3">
                <AlertCircle size={36} className="text-amber-600 animate-pulse" />
                <div>
                  <h4 className="font-bold text-xs text-[#1c1b1b]">Belum Ada Rekening Terdaftar</h4>
                  <p className="text-[11px] text-[#414944] mt-1 max-w-[320px] leading-relaxed">
                    Anda wajib menambahkan minimal satu rekening pribadi atau e-wallet terlebih dahulu untuk mencairkan saldo penarikan.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="mt-2 px-6 py-3 bg-[#002d1c] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:opacity-95 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Tambahkan Rekening Pribadi</span>
                </button>
              </div>
            ) : (
              // Account list to select/edit
              <div className="space-y-3">
                {[...accounts]
                  .sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1))
                  .map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`p-4 rounded-xl border-2 text-xs flex justify-between items-center gap-3 transition-all cursor-pointer select-none ${
                      selectedAccountId === acc.id
                        ? 'border-[#002d1c] bg-[#1a4331]/5'
                        : 'border-[#c1c8c2]/20 hover:border-[#c1c8c2]/50 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {selectedAccountId === acc.id ? (
                          <CheckCircle2 size={16} className="text-[#002d1c] fill-[#c0edd3]/60" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-[#c1c8c2] bg-white"></div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-[#1c1b1b]">{acc.bankName}</strong>
                          {acc.isDefault && (
                            <span className="text-[8px] bg-[#002d1c] text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                              DEAFULT
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#414944] font-mono leading-none">{acc.accountNumber}</p>
                        <p className="text-[10px] text-[#414944]/80">a/n: <strong className="text-[#1c1b1b]">{acc.accountName}</strong></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {acc.isDefault ? (
                        <div 
                          className="p-1.5 text-amber-500 flex items-center justify-center" 
                          title="Rekening Utama (Default)"
                        >
                          <Star size={16} className="fill-current text-amber-500" />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleSetDefault(acc.id, e)}
                          className="p-1.5 hover:bg-amber-50 rounded-lg text-neutral-400 hover:text-amber-500 transition-colors cursor-pointer flex items-center justify-center"
                          title="Jadikan Rekening Utama (Default)"
                        >
                          <Star size={16} />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteAccount(acc.id, e)}
                        className="p-1.5 text-[#414944]/60 hover:text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Rekening"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Final Withdrawal Button */}
          <button
            onClick={handleWithdrawSubmit}
            disabled={accounts.length === 0 || balance === 0}
            className={`w-full text-xs py-4 rounded-[16px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
              accounts.length === 0 || balance === 0
                ? 'bg-[#ebe7e7] text-[#414944]/40 cursor-not-allowed shadow-none'
                : 'bg-[#002d1c] text-white hover:opacity-95 cursor-pointer'
            }`}
          >
            <Check size={14} />
            <span>Tarik Dana Sekarang</span>
          </button>
        </div>
      )}
    </div>
  );
};
