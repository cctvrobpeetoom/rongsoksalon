'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  BarChart3,
  Calendar,
  Filter,
  Package,
  TrendingUp,
  Layers,
  Search,
  FileSpreadsheet,
  Building2,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ReportView() {
  const { currentSalonTransactions, activeSalon, currentSalonStaff, currentSalonAreas } = useApp();

  // Date filter: default from 1st of current month to end of month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedSourceAreaId, setSelectedSourceAreaId] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Pagination for transaction table (20 items per page)
  const [tablePage, setTablePage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Filtered transactions
  const filteredData = useMemo(() => {
    return currentSalonTransactions.filter((trx) => {
      if (trx.date < startDate || trx.date > endDate) return false;
      if (selectedStaffId && trx.staffId !== selectedStaffId) return false;
      if (selectedSourceAreaId && trx.sourceAreaId !== selectedSourceAreaId) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const match =
          trx.productName.toLowerCase().includes(query) ||
          trx.productSku.toLowerCase().includes(query) ||
          trx.staffName.toLowerCase().includes(query) ||
          trx.sourceAreaName.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [currentSalonTransactions, startDate, endDate, selectedStaffId, selectedSourceAreaId, searchQuery]);

  // Statistics & KPI
  const totalQty = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.qty, 0);
  }, [filteredData]);

  const uniqueProductsCount = useMemo(() => {
    const set = new Set(filteredData.map((d) => d.productId));
    return set.size;
  }, [filteredData]);

  // Top 5 Products ranking
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; sku: string; unit: string; totalQty: number }>();
    filteredData.forEach((trx) => {
      const existing = map.get(trx.productId);
      if (existing) {
        existing.totalQty += trx.qty;
      } else {
        map.set(trx.productId, {
          name: trx.productName,
          sku: trx.productSku,
          unit: trx.productUnit,
          totalQty: trx.qty,
        });
      }
    });

    const sorted = Array.from(map.values()).sort((a, b) => b.totalQty - a.totalQty);
    return sorted.slice(0, 5);
  }, [filteredData]);

  // Breakdown per Source Area
  const areaBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    filteredData.forEach((trx) => {
      map.set(trx.sourceAreaName, (map.get(trx.sourceAreaName) || 0) + trx.qty);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [filteredData]);

  // Breakdown per Staff
  const staffBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    filteredData.forEach((trx) => {
      map.set(trx.staffName, (map.get(trx.staffName) || 0) + trx.qty);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredData]);

  // Pagination calculation for table
  const totalTablePages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const currentTableRows = filteredData.slice(
    (tablePage - 1) * ITEMS_PER_PAGE,
    tablePage * ITEMS_PER_PAGE
  );

  // Export Summary to Excel (.xlsx / CSV with UTF-8 BOM)
  const handleExportSummaryExcel = async () => {
    try {
      setIsExporting(true);
      let csvContent = '\uFEFF';

      csvContent += `LAPORAN PENGELUARAN PRODUK HABIS (RONGSOKSALON)\n`;
      csvContent += `Cabang:,"${activeSalon.name}"\n`;
      csvContent += `Periode:,"${startDate} s/d ${endDate}"\n`;
      csvContent += `Tanggal Cetak:,"${new Date().toLocaleString('id-ID')}"\n`;
      csvContent += `Total Barang Habis:,"${totalQty} Pcs"\n\n`;

      csvContent += `No,Tanggal Zenoti/Catat,Petugas,Kode SKU Zenoti,Nama Produk,Satuan,Qty,Area Sumber,Catatan\n`;

      filteredData.forEach((row, index) => {
        const cleanNotes = (row.notes || '-').replace(/"/g, '""');
        const cleanProduct = row.productName.replace(/"/g, '""');
        csvContent += `${index + 1},"${row.date}","${row.staffName}","${row.productSku}","${cleanProduct}","${row.productUnit}",${row.qty},"${row.sourceAreaName}","${cleanNotes}"\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan_Rongsok_${activeSalon.name.replace(/\s+/g, '_')}_${startDate}_sd_${endDate}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error', err);
      alert('Gagal mendownload laporan');
    } finally {
      setIsExporting(false);
    }
  };

  const maxTopQty = topProducts.length > 0 ? topProducts[0].totalQty : 1;

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 sm:pb-8 space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-0.5">
              <Building2 className="w-4 h-4" />
              {activeSalon.name}
            </div>
            <h1 className="text-lg font-extrabold text-slate-900">
              Summary Laporan Pemakaian
            </h1>
            <p className="text-xs text-slate-500">
              Rekapitulasi fisik botol/wadah habis pakai untuk dicocokkan manual dengan laporan Zenoti
            </p>
          </div>

          {/* Export Action Button */}
          <button
            type="button"
            onClick={handleExportSummaryExcel}
            disabled={isExporting || filteredData.length === 0}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>{isExporting ? 'Memproses...' : 'Download Laporan Excel (.xlsx/csv)'}</span>
          </button>
        </div>

        {/* Global Date Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Dari Tanggal (Default: Awal Bulan)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setTablePage(1);
              }}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Sampai Tanggal (Default: Akhir Bulan)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setTablePage(1);
              }}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          Penyaringan Data Cepat
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Search text */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama produk / SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTablePage(1);
              }}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>

          {/* Staff filter */}
          <select
            value={selectedStaffId}
            onChange={(e) => {
              setSelectedStaffId(e.target.value);
              setTablePage(1);
            }}
            className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option value="">Semua Petugas</option>
            {currentSalonStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                Petugas: {staff.name}
              </option>
            ))}
          </select>

          {/* Source area filter */}
          <select
            value={selectedSourceAreaId}
            onChange={(e) => {
              setSelectedSourceAreaId(e.target.value);
              setTablePage(1);
            }}
            className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option value="">Semua Area Sumber</option>
            {currentSalonAreas.filter((a) => a.type === 'ambil').map((area) => (
              <option key={area.id} value={area.id}>
                Area: {area.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Total Barang Habis
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{totalQty}</span>
            <span className="text-xs font-medium text-slate-500">Pcs</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold mt-1.5 inline-block">
            Fisik Periode Ini
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Varian Produk
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-800">{uniqueProductsCount}</span>
            <span className="text-xs font-medium text-slate-500">Jenis</span>
          </div>
          <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-semibold mt-1.5 inline-block">
            Item Berbeda
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Total Catatan
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-800">{filteredData.length}</span>
            <span className="text-xs font-medium text-slate-500">Transaksi</span>
          </div>
          <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-semibold mt-1.5 inline-block">
            Aktivitas Input
          </span>
        </div>
      </div>

      {/* Top 5 Most Used Products */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Top 5 Produk Paling Banyak Digunakan
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Rangking Pemakaian
          </span>
        </div>

        {topProducts.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center italic">
            Tidak ada data pemakaian pada rentang tanggal ini.
          </p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((prod, idx) => {
              const percentage = Math.round((prod.totalQty / maxTopQty) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 truncate">
                        {prod.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                        [{prod.sku}]
                      </span>
                    </div>
                    <span className="font-extrabold text-emerald-600 shrink-0">
                      {prod.totalQty} {prod.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Area & Staff Breakdown (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Area Sumber Breakdown */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            Penggunaan per Area Sumber
          </h3>
          <div className="space-y-1.5">
            {areaBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-1">Belum ada data.</p>
            ) : (
              areaBreakdown.map(([areaName, count]) => (
                <div key={areaName} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-700 truncate">{areaName}</span>
                  <span className="font-extrabold text-slate-900">{count} Pcs</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Staff Breakdown */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Penggunaan per Petugas / Stylist
          </h3>
          <div className="space-y-1.5">
            {staffBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-1">Belum ada data.</p>
            ) : (
              staffBreakdown.map(([staffName, count]) => (
                <div key={staffName} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-700 truncate">{staffName}</span>
                  <span className="font-extrabold text-emerald-700">{count} Pcs</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail Transactions Table with Pagination */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Detail Transaksi Periode ({filteredData.length})
            </h3>
            <p className="text-[10px] text-slate-400">
              Menampilkan 20 baris per halaman
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Total: {totalQty} Pcs
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {currentTableRows.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Tidak ada transaksi yang sesuai dengan filter.
            </div>
          ) : (
            currentTableRows.map((trx) => (
              <div key={trx.id} className="p-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1 rounded">
                        {trx.productSku}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{trx.date}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {trx.productName}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <span className="text-amber-700 font-medium">Sumber: {trx.sourceAreaName}</span>
                      <span className="text-slate-300">•</span>
                      <span>Oleh: {trx.staffName}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-emerald-600">{trx.qty}</span>
                    <span className="text-[10px] text-slate-500 ml-1">{trx.productUnit}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalTablePages > 1 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">
              Halaman {tablePage} dari {totalTablePages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                disabled={tablePage === 1}
                className="p-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTablePage((p) => Math.min(totalTablePages, p + 1))}
                disabled={tablePage === totalTablePages}
                className="p-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
