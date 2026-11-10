'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  User,
  Search,
  Package,
  Layers,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  ChevronDown,
  X,
  FileText,
  ShoppingCart,
  Trash2,
  Clock,
  Zap,
  ListPlus
} from 'lucide-react';
import { Product } from '@/types';

interface BatchItem {
  product: Product;
  qty: number;
  notes?: string;
}

export default function InputForm() {
  const {
    activeSalon,
    currentSalonStaff,
    currentSalonAreas,
    currentSalonTransactions,
    products,
    addTransaction,
    currentUser,
  } = useApp();

  // Mode: Single Input vs Batch (Sekaligus) Input
  const [inputMode, setInputMode] = useState<'single' | 'batch'>('single');

  // Filter take & place areas
  const ambilAreas = useMemo(() => currentSalonAreas.filter((a) => a.type === 'ambil'), [currentSalonAreas]);
  const taruhAreas = useMemo(() => currentSalonAreas.filter((a) => a.type === 'taruh'), [currentSalonAreas]);

  // Form base states
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [staffId, setStaffId] = useState('');
  const [sourceAreaId, setSourceAreaId] = useState('');
  const [targetAreaId, setTargetAreaId] = useState('');

  // Single mode states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [notes, setNotes] = useState('');

  // Batch mode states (Multiple items in 1 submission)
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);

  // Search combobox states for 1,000+ products
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Success / Error banners
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-set staff if currentUser is a staff member
  useEffect(() => {
    if (currentUser?.role === 'staff') {
      const matchStaff = currentSalonStaff.find(
        (s) => s.name.toLowerCase() === currentUser.name.toLowerCase() ||
               (s.username && s.username.toLowerCase() === currentUser.username.toLowerCase())
      );
      if (matchStaff) {
        setStaffId(matchStaff.id);
      } else if (currentSalonStaff.length > 0) {
        setStaffId(currentSalonStaff[0].id);
      }
    } else if (currentSalonStaff.length > 0 && !staffId) {
      setStaffId(currentSalonStaff[0].id);
    }

    if (ambilAreas.length > 0 && !sourceAreaId) {
      setSourceAreaId(ambilAreas[0].id);
    }
    if (taruhAreas.length > 0 && !targetAreaId) {
      setTargetAreaId(taruhAreas[0].id);
    }
  }, [activeSalon.id, currentSalonStaff, ambilAreas, taruhAreas, currentUser]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered products (instant search matching name or SKU)
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products.slice(0, 15);
    const query = searchQuery.toLowerCase().trim();
    return products
      .filter((p) => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
      .slice(0, 25);
  }, [products, searchQuery]);


  // Today's count recorded in this salon
  const todayTransactions = useMemo(() => {
    return currentSalonTransactions.filter((t) => t.date === todayStr);
  }, [currentSalonTransactions, todayStr]);

  const handleSelectProduct = (prod: Product) => {
    if (inputMode === 'single') {
      setSelectedProduct(prod);
      setSearchQuery('');
      setIsSearchOpen(false);
    } else {
      // In batch mode: add to batch list directly
      const existingIdx = batchItems.findIndex((item) => item.product.id === prod.id);
      if (existingIdx >= 0) {
        setBatchItems((prev) =>
          prev.map((item, idx) => (idx === existingIdx ? { ...item, qty: item.qty + 1 } : item))
        );
      } else {
        setBatchItems((prev) => [...prev, { product: prod, qty: 1 }]);
      }
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleBatchQtyChange = (index: number, delta: number) => {
    setBatchItems((prev) =>
      prev
        .map((item, idx) => (idx === index ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const handleRemoveBatchItem = (index: number) => {
    setBatchItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Single Transaction
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedProduct) {
      setErrorMessage('Silakan pilih produk yang habis terlebih dahulu!');
      return;
    }
    if (!staffId) {
      setErrorMessage('Silakan pilih nama petugas!');
      return;
    }
    if (!sourceAreaId || !targetAreaId) {
      setErrorMessage('Silakan tentukan Area Ambil dan Area Taruh produk!');
      return;
    }
    // Business Rule: Area Ambil & Taruh should be logically distinct
    if (sourceAreaId === targetAreaId) {
      setErrorMessage('Perhatian: Area Ambil (sumber) dan Area Taruh (tujuan) tidak boleh area yang sama!');
      return;
    }

    const currentStaff = currentSalonStaff.find((s) => s.id === staffId);
    const sourceArea = ambilAreas.find((a) => a.id === sourceAreaId);
    const targetArea = taruhAreas.find((a) => a.id === targetAreaId);

    addTransaction({
      date,
      salonId: activeSalon.id,
      staffId,
      staffName: currentStaff ? currentStaff.name : (currentUser?.name || 'Petugas'),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productSku: selectedProduct.sku,
      productUnit: selectedProduct.unit,
      sourceAreaId,
      sourceAreaName: sourceArea ? sourceArea.name : 'Gudang',
      targetAreaId,
      targetAreaName: targetArea ? targetArea.name : 'Salon',
      qty,
      notes: notes.trim() || undefined,
    });

    setSuccessMessage(`Berhasil dicatat: ${qty} ${selectedProduct.unit} ${selectedProduct.name}`);
    setTimeout(() => setSuccessMessage(null), 4000);

    // Reset product & qty for quick next entry
    setSelectedProduct(null);
    setQty(1);
    setNotes('');
  };

  // Submit Batch Transactions
  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (batchItems.length === 0) {
      setErrorMessage('Daftar barang masih kosong! Tambahkan minimal 1 produk ke keranjang.');
      return;
    }
    if (!staffId) {
      setErrorMessage('Silakan pilih nama petugas!');
      return;
    }
    if (!sourceAreaId || !targetAreaId) {
      setErrorMessage('Silakan tentukan Area Ambil dan Area Taruh!');
      return;
    }
    if (sourceAreaId === targetAreaId) {
      setErrorMessage('Perhatian: Area Ambil dan Area Taruh tidak boleh sama!');
      return;
    }

    const currentStaff = currentSalonStaff.find((s) => s.id === staffId);
    const sourceArea = ambilAreas.find((a) => a.id === sourceAreaId);
    const targetArea = taruhAreas.find((a) => a.id === targetAreaId);

    const totalBatchPcs = batchItems.reduce((acc, curr) => acc + curr.qty, 0);

    // Insert all batch items
    batchItems.forEach((item) => {
      addTransaction({
        date,
        salonId: activeSalon.id,
        staffId,
        staffName: currentStaff ? currentStaff.name : (currentUser?.name || 'Petugas'),
        productId: item.product.id,
        productName: item.product.name,
        productSku: item.product.sku,
        productUnit: item.product.unit,
        sourceAreaId,
        sourceAreaName: sourceArea ? sourceArea.name : 'Gudang',
        targetAreaId,
        targetAreaName: targetArea ? targetArea.name : 'Salon',
        qty: item.qty,
        notes: item.notes?.trim() || undefined,
      });
    });

    setSuccessMessage(`Berhasil mencatat ${batchItems.length} jenis produk (${totalBatchPcs} Pcs) sekaligus!`);
    setTimeout(() => setSuccessMessage(null), 4000);

    // Clear batch
    setBatchItems([]);
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 sm:pb-8 space-y-3.5">
      {/* Branch Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
            Form Pencatatan Fisik Rongsok
          </span>
          <h2 className="text-base font-bold flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4 text-emerald-200" />
            {activeSalon.name}
          </h2>
        </div>
        <div className="text-right text-emerald-100 text-xs">
          <p className="font-semibold text-white">{todayTransactions.length} Catatan Hari Ini</p>
          <p className="text-[10px] text-emerald-200">
            {todayTransactions.reduce((acc, c) => acc + c.qty, 0)} Pcs Keluar
          </p>
        </div>
      </div>

      {/* Mode Selector Toggle: Single vs Batch */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs flex gap-1">
        <button
          type="button"
          onClick={() => setInputMode('single')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            inputMode === 'single'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Input Satuan Cepat</span>
        </button>

        <button
          type="button"
          onClick={() => setInputMode('batch')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            inputMode === 'batch'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Input Sekaligus (Batch)</span>
          {batchItems.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-400 text-slate-900 font-extrabold">
              {batchItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Feedback Alerts */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="flex-1">{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2.5 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* FORM UTAMA (BERLAKU UNTUK SINGLE & BATCH)                      */}
      {/* ============================================================== */}
      <form onSubmit={inputMode === 'single' ? handleSingleSubmit : handleBatchSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
        
        {/* Row 1: Tanggal & Petugas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tanggal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Tanggal Keluar Zenoti / Rongsok
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
              required
            />
          </div>

          {/* Petugas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Petugas / Yang Mengeluarkan
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
              required
            >
              <option value="" disabled>-- Pilih Petugas --</option>
              {currentSalonStaff.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} ({staff.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Area Ambil & Area Taruh (2 Kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
          {/* Area Ambil */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              Sumber: Area Ambil Barang
            </label>
            <select
              value={sourceAreaId}
              onChange={(e) => setSourceAreaId(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
              required
            >
              <option value="" disabled>-- Pilih Area Ambil --</option>
              {ambilAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          {/* Area Taruh */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              Tujuan: Area Taruh Produk
            </label>
            <select
              value={targetAreaId}
              onChange={(e) => setTargetAreaId(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
              required
            >
              <option value="" disabled>-- Pilih Area Taruh --</option>
              {taruhAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Searchable Combobox for 1,000+ Products */}
        <div className="relative pt-1" ref={searchDropdownRef}>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-slate-500" />
              {inputMode === 'single' ? 'Pilih Produk Habis Pakai' : 'Tambah Produk ke Keranjang Batch'}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              {products.length} Produk Siap Dicari
            </span>
          </label>

          {/* In Single Mode: Selected Card or Search Input */}
          {inputMode === 'single' && selectedProduct ? (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-mono text-[10px] font-bold">
                    SKU: {selectedProduct.sku}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    {selectedProduct.category}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {selectedProduct.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  Satuan: <span className="font-semibold text-emerald-700">{selectedProduct.unit}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Ganti produk"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik nama produk atau kode SKU Zenoti..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-800"
              />
            </div>
          )}

          {/* Autocomplete Dropdown List */}
          {isSearchOpen && (!selectedProduct || inputMode === 'batch') && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Tidak ditemukan produk dengan kata kunci &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProduct(p)}
                    className="w-full text-left p-2.5 hover:bg-emerald-50/60 transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 rounded">
                          {p.sku}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {p.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                      {inputMode === 'batch' ? '+ Masukkan' : p.unit}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SINGLE MODE SPECIFIC: QTY STEPPER & NOTES                      */}
        {/* ============================================================== */}
        {inputMode === 'single' && (
          <div className="space-y-3 pt-1">
            {/* Quantity Stepper */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jumlah Barang Habis (Qty {selectedProduct ? `in ${selectedProduct.unit}` : ''})
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/60 p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 active:scale-95 transition-all hover:bg-slate-50"
                    aria-label="Kurangi 1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center text-sm font-bold bg-transparent text-slate-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQty((prev) => prev + 1)}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 active:scale-95 transition-all hover:bg-slate-50"
                    aria-label="Tambah 1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Botol / Wadah Habis Terpakai
                </span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Catatan Tambahan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Sisa treatment tamu VIP, botol retak, dll."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
              />
            </div>

            {/* Submit Button Single */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Pencatatan Rongsok
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* BATCH MODE SPECIFIC: KERANJANG DAFTAR PRODUK                   */}
        {/* ============================================================== */}
        {inputMode === 'batch' && (
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                Daftar Barang yang Dikeluarkan ({batchItems.length} Produk)
              </h3>
              {batchItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBatchItems([])}
                  className="text-[10px] text-red-500 hover:text-red-700 font-semibold"
                >
                  Kosongkan Keranjang
                </button>
              )}
            </div>

            {batchItems.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-600">Keranjang Masih Kosong</p>
                <p className="text-[10px] text-slate-400">
                  Ketik nama produk pada kolom pencarian di atas untuk memasukkan barang.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {batchItems.map((item, idx) => (
                  <div
                    key={item.product.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {item.product.sku} • Satuan: {item.product.unit}
                      </p>
                    </div>

                    {/* Stepper in Batch */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleBatchQtyChange(idx, -1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-95"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-bold text-emerald-700 text-xs">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleBatchQtyChange(idx, 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveBatchItem(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 ml-1"
                        title="Hapus baris ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button Batch */}
            <button
              type="submit"
              disabled={batchItems.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-40 disabled:pointer-events-none"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Semua ({batchItems.length} Produk • {batchItems.reduce((acc, c) => acc + c.qty, 0)} Pcs)</span>
            </button>
          </div>
        )}
      </form>

      {/* ============================================================== */}
      {/* QUICK INLINE AUDIT: CATATAN FISIK HARI INI                     */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            Catatan Keluar Hari Ini ({todayStr})
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            {todayTransactions.length} Transaksi
          </span>
        </div>

        {todayTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-2 text-center italic">
            Belum ada produk yang dicatat keluar hari ini.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
            {todayTransactions.slice(0, 5).map((trx) => (
              <div key={trx.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 truncate">{trx.productName}</p>
                  <p className="text-[10px] text-slate-400">
                    {trx.sourceAreaName} $\rightarrow$ {trx.targetAreaName} • Oleh: {trx.staffName}
                  </p>
                </div>
                <span className="font-extrabold text-emerald-600 text-xs shrink-0">
                  +{trx.qty} {trx.productUnit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
