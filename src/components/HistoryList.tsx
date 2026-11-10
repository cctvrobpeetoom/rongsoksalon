'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  Search,
  Trash2,
  Package,
  Layers,
  User,
  ArrowRight,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';

export default function HistoryList() {
  const { currentSalonTransactions, activeSalon, deleteTransaction } = useApp();

  // Search & Date filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(''); // Empty means all dates
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Filtered transactions by both text and date
  const filteredTransactions = useMemo(() => {
    return currentSalonTransactions.filter((trx) => {
      // Date filter
      if (selectedDate && trx.date !== selectedDate) {
        return false;
      }

      // Search text filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matches =
          trx.productName.toLowerCase().includes(term) ||
          trx.productSku.toLowerCase().includes(term) ||
          trx.staffName.toLowerCase().includes(term) ||
          trx.targetAreaName.toLowerCase().includes(term) ||
          trx.sourceAreaName.toLowerCase().includes(term);
        if (!matches) return false;
      }

      return true;
    });
  }, [currentSalonTransactions, selectedDate, searchTerm]);

  // Reset to page 1 whenever search or date changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  // Pagination calculation
  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = filteredTransactions.slice(startIndex, endIndex);

  const handleDelete = (id: string, productName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus catatan untuk "${productName}"?`)) {
      deleteTransaction(id);
    }
  };

  const handleSetToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedDate(todayStr);
  };

  const handleClearDate = () => {
    setSelectedDate('');
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 sm:pb-8">
      {/* Header & Filter Card */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Riwayat Pencatatan ({activeSalon.name})
            </h2>
            <p className="text-xs text-slate-500">
              Total {currentSalonTransactions.length} transaksi tercatat di cabang ini
            </p>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            20 Item / Halaman
          </span>
        </div>

        {/* Date Filter Bar */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Filter Berdasarkan Tanggal:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSetToday}
                className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
              >
                Hari Ini
              </button>
              {selectedDate && (
                <button
                  type="button"
                  onClick={handleClearDate}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Semua Tanggal
                </button>
              )}
            </div>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
          />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari produk, kode SKU, petugas, atau area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
          />
        </div>

        {/* Info Range */}
        {totalItems > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>
              Menampilkan <span className="font-bold text-slate-800">{startIndex + 1} - {endIndex}</span> dari{' '}
              <span className="font-bold text-slate-800">{totalItems}</span> riwayat
            </span>
            <span>
              Halaman <span className="font-bold text-emerald-700">{currentPage}</span> dari{' '}
              <span className="font-bold text-slate-800">{totalPages}</span>
            </span>
          </div>
        )}
      </div>

      {/* Transaction Cards List */}
      {currentItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Tidak ada riwayat transaksi</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedDate
              ? `Tidak ada catatan pada tanggal ${selectedDate}.`
              : 'Gunakan tab "Input" untuk mencatat produk yang habis terpakai.'}
          </p>
          {selectedDate && (
            <button
              onClick={handleClearDate}
              className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              Tampilkan Semua Tanggal
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {currentItems.map((trx) => (
            <div
              key={trx.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {trx.productSku}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {trx.date}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {trx.productName}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-emerald-600">
                    {trx.qty}
                  </span>
                  <span className="text-[11px] text-slate-500 ml-1 font-medium">
                    {trx.productUnit}
                  </span>
                </div>
              </div>

              {/* Area Movement & Staff */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  <span className="text-amber-700 font-semibold">{trx.sourceAreaName}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-emerald-700 font-semibold">{trx.targetAreaName}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {trx.staffName}
                  </span>

                  <button
                    onClick={() => handleDelete(trx.id, trx.productName)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Transaksi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {trx.notes && (
                <p className="mt-2 text-[11px] text-slate-500 bg-amber-50/60 border border-amber-100 rounded-lg px-2.5 py-1 italic">
                  Note: &quot;{trx.notes}&quot;
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar (Page 1, 2, 3...) */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5 flex-wrap">
          {/* Previous Page */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Numbered Page Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                currentPage === pageNum
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Page */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
