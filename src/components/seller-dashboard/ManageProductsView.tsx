/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Edit2, Trash2, Archive, ArchiveRestore, PlusCircle } from 'lucide-react';
import { Product } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

interface ManageProductsViewProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onGoBack: () => void;
  onAddNewListing: () => void;
  onEditProduct: (product: Product) => void;
  userProfile?: { name: string; shopName: string; email: string; phone: string; avatar: string };
}

export const ManageProductsView: React.FC<ManageProductsViewProps> = ({
  products,
  onUpdateProduct,
  onDeleteProduct,
  onGoBack,
  onAddNewListing,
  onEditProduct,
  userProfile,
}) => {
  const sellerName = userProfile?.shopName || 'UrbanArchive Vintage';
  const sellerProducts = products.filter(p => p.sellerName === sellerName);


  const handleToggleDraft = (prod: Product) => {
    const updated: Product = {
      ...prod,
      isDraft: !prod.isDraft
    };
    onUpdateProduct(updated);
  };

  const handleDeleteClick = (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen dari listing Anda?')) {
      onDeleteProduct(productId);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard Penjual', onClick: onGoBack },
    { label: 'Kelola Produk' }
  ];

  return (
    <div className="flex flex-col gap-6 py-4 max-w-[1000px] mx-auto w-full font-geist text-left">
      {/* Navigation Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#f0edec] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoBack}
            className="p-2 hover:bg-[#f0edec] rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} className="text-[#002d1c]" />
          </button>
          <div>
            <h1 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">Kelola Produk Anda</h1>
            <p className="text-xs text-[#414944] mt-0.5">Edit, draft, atau hapus koleksi barang jualan preloved Anda.</p>
          </div>
        </div>

        <button
          onClick={onAddNewListing}
          className="flex items-center gap-2 bg-[#002d1c] text-white px-6 py-3 rounded-full text-xs font-black hover:opacity-95 active:scale-95 shadow-md shadow-[#002d1c]/15 transition-all cursor-pointer"
        >
          <PlusCircle size={14} />
          <span>Tambah Listing Baru</span>
        </button>
      </div>

      {/* Inventory Listings Grid */}
      {sellerProducts.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#f0edec] p-12 text-center flex flex-col items-center gap-4">
          <Archive size={48} className="text-[#414944]/40" />
          <div>
            <h3 className="font-display font-bold text-base text-[#1c1b1b]">Belum ada produk terdaftar</h3>
            <p className="text-xs text-[#414944] mt-1 max-w-[320px] leading-relaxed">Mulailah petualangan mode sirkular Anda dengan membuat listing pakaian preloved berkualitas pertama Anda.</p>
          </div>
          <button
            onClick={onAddNewListing}
            className="px-6 py-3.5 bg-[#002d1c] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Mulai Jual Barang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellerProducts.map((prod) => (
            <div
              key={prod.id}
              className={`bg-white rounded-[24px] border transition-all overflow-hidden flex flex-col justify-between shadow-sm relative ${
                prod.isDraft ? 'border-dashed border-neutral-300 opacity-80' : 'border-[#f0edec] hover:shadow'
              }`}
            >
              {/* Product Cover and status */}
              <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                <img
                  src={prod.imagePrimary}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Draft Badge Overlay */}
                {prod.isDraft && (
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-neutral-800 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-neutral-600 shadow-md">
                      Draft
                    </span>
                  </div>
                )}

                {/* Condition Badge */}
                <div className="absolute top-3 left-3 bg-[#002d1c] text-[#c0edd3] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                  {prod.condition}
                </div>
              </div>

              {/* Product Content Details */}
              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#414944]/80 tracking-wider font-mono">
                    {prod.brand} • Size {prod.size}
                  </span>
                  <h3 className="font-bold text-sm text-[#1c1b1b] line-clamp-1 leading-snug">{prod.name}</h3>
                  <p className="font-display font-black text-[#002d1c] text-base mt-1.5">
                    Rp {prod.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-[#414944] line-clamp-2 leading-relaxed mt-1">
                    {prod.description}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-2 border-t border-[#f0edec]/70 pt-4 mt-2">
                  <button
                    onClick={() => onEditProduct(prod)}
                    className="flex items-center justify-center gap-1.5 border border-[#c1c8c2] hover:bg-[#fcf9f8] text-[#414944] text-[10px] font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                    title="Edit Detail Produk"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleToggleDraft(prod)}
                    className={`flex items-center justify-center gap-1.5 border text-[10px] font-bold py-2.5 rounded-xl transition-all cursor-pointer ${
                      prod.isDraft 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                        : 'border-[#c1c8c2] hover:bg-[#fcf9f8] text-[#414944]'
                    }`}
                    title={prod.isDraft ? 'Aktifkan Produk' : 'Tandai sebagai Draft'}
                  >
                    {prod.isDraft ? <ArchiveRestore size={12} /> : <Archive size={12} />}
                    <span>{prod.isDraft ? 'Aktif' : 'Draft'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteClick(prod.id)}
                    className="flex items-center justify-center gap-1.5 border border-red-200 hover:bg-red-50 text-red-600 text-[10px] font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                    title="Hapus Listing"
                  >
                    <Trash2 size={12} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
