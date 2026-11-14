'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Settings,
  Building2,
  Layers,
  Users,
  Package,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Database,
  Upload,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  FileSpreadsheet,
  AlertCircle,
  Key,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Phone,
  Home,
  RefreshCw
} from 'lucide-react';
import { Area, Staff, Product, Salon } from '@/types';

export default function SettingsView() {
  const {
    salons,
    activeSalon,
    setActiveSalonId,
    addSalon,
    updateSalon,
    deleteSalon,
    verifySuperAdminPassword,
    currentSalonAreas,
    addArea,
    updateArea,
    deleteArea,
    currentSalonStaff,
    addStaff,
    updateStaff,
    deleteStaff,
    currentSalonProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    importProducts,
    currentUser,
    isCloudConnected,
    lastSyncedTime,
    syncWithCloud,
  } = useApp();

  const STAFF_ROLES = [
    'Stylist',
    'Senior Stylist',
    'Colorist',
    'Barber',
    'Hairspa Therapist',
    'Manager / Supervisor',
    'Kasir / Admin',
    'Assistant',
  ];

  const isSuperAdmin = currentUser?.role === 'superadmin';

  // Sub-tabs in Settings
  const [activeSubTab, setActiveSubTab] = useState<'area' | 'staff' | 'produk' | 'salon'>('area');

  // Success / Info Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- AREA MANAGEMENT STATES ---
  const [newAreaName, setNewAreaName] = useState('');
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  // --- STAFF MANAGEMENT STATES ---
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Stylist');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // --- PRODUCT MANAGEMENT STATES ---
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('Botol');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Semua');
  const [productPage, setProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 20;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- SALON MANAGEMENT STATES ---
  const [newSalonName, setNewSalonName] = useState('');
  const [newSalonAddress, setNewSalonAddress] = useState('');
  const [newSalonPhone, setNewSalonPhone] = useState('');
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [deletingSalon, setDeletingSalon] = useState<Salon | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ================= AREA HANDLERS =================
  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    addArea(newAreaName.trim(), 'ambil');
    showToast(`Berhasil menambah area sumber: "${newAreaName.trim()}"`);
    setNewAreaName('');
  };

  const handleSaveEditArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArea) return;
    updateArea(editingArea.id, editingArea.name.trim(), 'ambil');
    showToast(`Area sumber berhasil diubah menjadi: "${editingArea.name}"`);
    setEditingArea(null);
  };

  // ================= STAFF HANDLERS =================
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    addStaff(newStaffName.trim(), newStaffRole.trim(), newStaffUsername.trim(), newStaffPin.trim() || '1234');
    showToast(`Staf "${newStaffName.trim()}" berhasil didaftarkan untuk ${activeSalon.name}`);
    setNewStaffName('');
    setNewStaffUsername('');
    setNewStaffPin('');
  };

  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    updateStaff(editingStaff.id, {
      name: editingStaff.name.trim(),
      role: editingStaff.role.trim(),
      username: editingStaff.username?.trim().toLowerCase(),
      pin: editingStaff.pin?.trim(),
    });
    showToast(`Data staf "${editingStaff.name}" berhasil diperbarui`);
    setEditingStaff(null);
  };

  // ================= PRODUCT HANDLERS =================
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdSku.trim()) return;
    addProduct({
      name: newProdName.trim(),
      sku: newProdSku.trim().toUpperCase(),
      category: newProdCategory.trim() || 'General',
      unit: newProdUnit.trim(),
    });
    showToast(`Produk "${newProdName.trim()}" [${newProdSku.toUpperCase()}] berhasil ditambahkan ke ${activeSalon.name}`);
    setNewProdName('');
    setNewProdSku('');
    setNewProdCategory('');
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name.trim(),
      sku: editingProduct.sku.trim().toUpperCase(),
      category: editingProduct.category.trim(),
      unit: editingProduct.unit.trim(),
    });
    showToast(`Produk "${editingProduct.name}" berhasil diperbarui`);
    setEditingProduct(null);
  };

  // CSV Import Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        // Split by lines
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          alert('File CSV kosong atau hanya berisi judul kolom!');
          return;
        }

        // Detect column positions from header (SKU, Name, Category, Unit)
        const header = lines[0].toLowerCase().split(',').map((h) => h.replace(/"/g, '').trim());
        let skuIdx = header.findIndex((h) => h.includes('sku') || h.includes('kode') || h.includes('code'));
        let nameIdx = header.findIndex((h) => h.includes('nama') || h.includes('name') || h.includes('produk') || h.includes('item'));
        let catIdx = header.findIndex((h) => h.includes('kategori') || h.includes('category'));
        let unitIdx = header.findIndex((h) => h.includes('satuan') || h.includes('unit'));

        // Defaults if headers aren't standard
        if (skuIdx === -1) skuIdx = 0;
        if (nameIdx === -1) nameIdx = 1;
        if (catIdx === -1) catIdx = 2;
        if (unitIdx === -1) unitIdx = 3;

        const importedList: Omit<Product, 'id' | 'salonId'>[] = [];
        for (let i = 1; i < lines.length; i++) {
          // Simple CSV splitter handling quotes
          const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) => v.replace(/^"|"$/g, '').trim());
          if (row.length < 2) continue;

          const sku = row[skuIdx] || `SKU-${Date.now()}-${i}`;
          const name = row[nameIdx];
          const category = row[catIdx] || 'General';
          const unit = row[unitIdx] || 'Pcs';

          if (name) {
            importedList.push({ sku, name, category, unit });
          }
        }

        if (importedList.length === 0) {
          alert('Tidak ada baris produk valid yang dapat dibaca dari file CSV.');
          return;
        }

        const { addedCount, updatedCount } = importProducts(importedList);
        showToast(`Impor Sukses: +${addedCount} produk baru, ${updatedCount} produk diperbarui!`);
      } catch (err) {
        console.error('Import error', err);
        alert('Gagal membaca file CSV. Pastikan format file sesuai panduan.');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Download CSV Template
  const handleDownloadTemplate = () => {
    let content = '\uFEFF';
    content += 'Kode SKU Zenoti,Nama Produk,Kategori,Satuan\n';
    content += 'LOR-EXT-500,"L\'Oreal Serie Expert Shampoo 500ml",Shampoo,Botol\n';
    content += 'OLA-BND-01-525,"Olaplex No. 1 Bond Multiplier 525ml",Treatment,Botol\n';
    content += 'MKR-REB-STR-500,"Makarizo Rebonding Straight Step 1 500g",Smoothing,Box\n';
    content += 'BRB-SUV-ORG-113,"Suavecito Original Hold Pomade 113g",Barber,Jar\n';

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Format_Import_Katalog_Produk_RongsokSalon.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export current catalog to CSV
  const handleExportCatalog = () => {
    let content = '\uFEFF';
    content += 'Kode SKU Zenoti,Nama Produk,Kategori,Satuan\n';
    currentSalonProducts.forEach((p) => {
      content += `"${p.sku}","${p.name.replace(/"/g, '""')}","${p.category}","${p.unit}"\n`;
    });

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Katalog_Produk_${activeSalon.name.replace(/\s+/g, '_')}_${currentSalonProducts.length}_Items.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered & Paginated Products in Catalog
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    currentSalonProducts.forEach((p) => set.add(p.category));
    return ['Semua', ...Array.from(set)];
  }, [currentSalonProducts]);

  const filteredCatalog = useMemo(() => {
    return currentSalonProducts.filter((p) => {
      if (productCategoryFilter !== 'Semua' && p.category !== productCategoryFilter) {
        return false;
      }
      if (productSearch.trim()) {
        const query = productSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [currentSalonProducts, productCategoryFilter, productSearch]);

  const totalCatalogPages = Math.max(1, Math.ceil(filteredCatalog.length / PRODUCTS_PER_PAGE));
  const currentCatalogItems = filteredCatalog.slice(
    (productPage - 1) * PRODUCTS_PER_PAGE,
    productPage * PRODUCTS_PER_PAGE
  );

  // ================= SALON HANDLERS =================
  const handleAddSalon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalonName.trim()) return;
    addSalon(newSalonName.trim(), newSalonAddress.trim(), newSalonPhone.trim());
    showToast(`Cabang "${newSalonName.trim()}" berhasil dibuat`);
    setNewSalonName('');
    setNewSalonAddress('');
    setNewSalonPhone('');
  };

  const handleSaveEditSalon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSalon) return;
    updateSalon(editingSalon.id, {
      name: editingSalon.name.trim(),
      address: editingSalon.address?.trim(),
      phone: editingSalon.phone?.trim(),
    });
    showToast(`Cabang "${editingSalon.name}" berhasil diperbarui`);
    setEditingSalon(null);
  };

  const handleConfirmDeleteSalon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingSalon) return;

    if (!deletePassword) {
      setDeleteError('Silakan masukkan password Super Admin!');
      return;
    }

    const isValid = verifySuperAdminPassword(deletePassword);
    if (!isValid) {
      setDeleteError('Password salah! Penghapusan cabang dibatalkan demi keamanan.');
      return;
    }

    const targetName = deletingSalon.name;
    const targetId = deletingSalon.id;
    deleteSalon(targetId);
    showToast(`Cabang "${targetName}" dan seluruh data terkait berhasil dihapus.`);
    setDeletingSalon(null);
    setDeletePassword('');
    setDeleteError(null);
  };

  const ambilAreas = currentSalonAreas.filter((a) => a.type === 'ambil');

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 sm:pb-8 space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Sub-Tab Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-600" />
              Pengaturan Master Data
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cabang Aktif: <span className="font-bold text-emerald-700">{activeSalon.name}</span>
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {isSuperAdmin ? 'Mode Super Admin' : 'Mode Staf Cabang'}
          </span>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex rounded-xl bg-slate-100 p-1 mt-3 gap-1">
          <button
            onClick={() => setActiveSubTab('area')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'area'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Area ({currentSalonAreas.length})
          </button>
          <button
            onClick={() => setActiveSubTab('staff')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'staff'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Staf ({currentSalonStaff.length})
          </button>
          <button
            onClick={() => setActiveSubTab('produk')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'produk'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Produk ({currentSalonProducts.length})
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveSubTab('salon')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSubTab === 'salon'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Salon ({salons.length})
            </button>
          )}
        </div>

        {/* Supabase Cloud Sync Status Banner */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700">Database:</span>
            {isCloudConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cloud Supabase Terhubung (Realtime Multi-Perangkat)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200" title="Masukkan NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY di Vercel">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Mode Lokal (Supabase Belum Diisi di Vercel)
              </span>
            )}
          </div>
          {isCloudConnected && (
            <button
              type="button"
              onClick={async () => {
                await syncWithCloud();
                showToast('Sinkronisasi data Supabase berhasil!');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-[11px] font-semibold transition-all border border-slate-200 flex items-center justify-center gap-1 self-start sm:self-auto"
            >
              <RefreshCw className="w-3 h-3 text-emerald-600" />
              <span>Sinkronkan Sekarang</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. SUBTAB: AREA SUMBER SALON (CRUD)                            */}
      {/* ============================================================== */}
      {activeSubTab === 'area' && (
        <div className="space-y-4">
          {/* Add Area Form (Hanya Sumber) */}
          <form onSubmit={handleAddArea} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              Tambah Area Sumber Baru di {activeSalon.name}
            </h2>
            <div>
              <input
                type="text"
                placeholder="Nama Area Sumber (e.g. Gudang Atas, Lemari Kasir)"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Simpan Area Sumber
            </button>
          </form>

          {/* Area Sumber List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-xs font-bold text-amber-800 mb-2.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              Area Sumber (Pengambilan Barang) ({ambilAreas.length})
            </h3>
            <div className="space-y-1.5">
              {ambilAreas.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">Belum ada area sumber.</p>
              ) : (
                ambilAreas.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-amber-50/50 border border-amber-100/60">
                    <span className="font-semibold text-slate-800 truncate">{a.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingArea(a)}
                        className="text-slate-400 hover:text-amber-700 p-1"
                        title="Edit Area"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus area "${a.name}"?`)) deleteArea(a.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Hapus Area"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Edit Area Modal */}
          {editingArea && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3">
                <h3 className="text-xs font-bold text-slate-800">Edit Nama Area Sumber</h3>
                <form onSubmit={handleSaveEditArea} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nama area sumber"
                    value={editingArea.name}
                    onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingArea(null)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SUBTAB: STAF SALON & USER LOGIN (CRUD)                      */}
      {/* ============================================================== */}
      {activeSubTab === 'staff' && (
        <div className="space-y-4">
          {/* Add Staff Form */}
          <form onSubmit={handleAddStaff} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              Tambah Staf & Akun Login ({activeSalon.name})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Siti Rahma"
                  value={newStaffName}
                  onChange={(e) => {
                    setNewStaffName(e.target.value);
                    if (!newStaffUsername) {
                      setNewStaffUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                    }
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Jabatan / Role</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                  required
                >
                  {STAFF_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Username Login</label>
                <input
                  type="text"
                  placeholder="Contoh: siti"
                  value={newStaffUsername}
                  onChange={(e) => setNewStaffUsername(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">PIN Login (Kosongkan = Default 1234)</label>
                <input
                  type="text"
                  placeholder="Contoh: 1234"
                  value={newStaffPin}
                  onChange={(e) => setNewStaffPin(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Simpan & Daftarkan Staf
            </button>
          </form>

          {/* Staff List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center justify-between">
              <span>Daftar Staf di {activeSalon.name} ({currentSalonStaff.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Terkunci ke cabang ini</span>
            </h3>
            <div className="divide-y divide-slate-100">
              {currentSalonStaff.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  Belum ada staf terdaftar di {activeSalon.name}. Silakan input staf baru melalui form di atas.
                </p>
              ) : (
                currentSalonStaff.map((staff) => (
                  <div key={staff.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{staff.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {staff.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <Key className="w-3 h-3 text-emerald-600" />
                        User: <span className="font-mono text-slate-600">{staff.username || staff.name.toLowerCase().replace(/\s+/g, '')}</span>
                        <span>•</span>
                        PIN: <span className="font-mono text-slate-600">{staff.pin || '1234'}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingStaff(staff)}
                        className="text-slate-400 hover:text-emerald-700 p-1"
                        title="Edit Staf"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus staf "${staff.name}" dari sistem?`)) deleteStaff(staff.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Hapus Staf"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Edit Staff Modal */}
          {editingStaff && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3">
                <h3 className="text-xs font-bold text-slate-800">Edit Data & Akses Staf</h3>
                <form onSubmit={handleSaveEditStaff} className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Nama</label>
                    <input
                      type="text"
                      value={editingStaff.name}
                      onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Jabatan</label>
                    <select
                      value={editingStaff.role}
                      onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                      required
                    >
                      {!STAFF_ROLES.includes(editingStaff.role) && (
                        <option value={editingStaff.role}>{editingStaff.role}</option>
                      )}
                      {STAFF_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Username</label>
                    <input
                      type="text"
                      placeholder="Username login staf"
                      value={editingStaff.username || ''}
                      onChange={(e) => setEditingStaff({ ...editingStaff, username: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">PIN Login</label>
                    <input
                      type="text"
                      placeholder="Contoh: 1234"
                      value={editingStaff.pin || ''}
                      onChange={(e) => setEditingStaff({ ...editingStaff, pin: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingStaff(null)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SUBTAB: PRODUK KATALOG (~1000 ITEMS) + IMPORT / EXPORT CSV  */}
      {/* ============================================================== */}
      {activeSubTab === 'produk' && (
        <div className="space-y-4">
          {/* Zenoti CSV Import / Export Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                  Sinkronisasi & Impor Produk — {activeSalon.name}
                </h3>
                <p className="text-[11px] text-emerald-100">
                  Database produk terisolasi khusus untuk {activeSalon.name} (tidak tercampur dengan salon lain)
                </p>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                {currentSalonProducts.length} Produk
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Import Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                Upload CSV Produk Zenoti
              </button>

              {/* Template Button */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3 py-2 bg-emerald-700/80 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl border border-emerald-500/50 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                Download Format Template
              </button>

              {/* Export Catalog */}
              <button
                type="button"
                onClick={handleExportCatalog}
                className="px-3 py-2 bg-emerald-700/80 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl border border-emerald-500/50 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                Ekspor Semua Produk
              </button>
            </div>
          </div>

          {/* Add Product Manual Form */}
          <form onSubmit={handleAddProduct} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              Tambah Produk Manual Baru
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nama Produk (e.g. L'Oreal Vitamino Color)"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                required
              />
              <input
                type="text"
                placeholder="Kode SKU Zenoti (e.g. LOR-SMP-500)"
                value={newProdSku}
                onChange={(e) => setNewProdSku(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium uppercase font-mono"
                required
              />
              <input
                type="text"
                placeholder="Kategori (Shampoo, Color, Treatment)"
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
              <select
                value={newProdUnit}
                onChange={(e) => setNewProdUnit(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="Botol">Satuan: Botol</option>
                <option value="Tube">Satuan: Tube</option>
                <option value="Jar">Satuan: Jar</option>
                <option value="Kaleng">Satuan: Kaleng</option>
                <option value="Box">Satuan: Box</option>
                <option value="Pouch">Satuan: Pouch</option>
                <option value="Pcs">Satuan: Pcs</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Simpan Produk ke Katalog
            </button>
          </form>

          {/* Catalog Browser with Search & Pagination */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-800">
                Katalog {activeSalon.name} ({filteredCatalog.length} dari {currentSalonProducts.length} produk)
              </h3>
              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
                {categoriesList.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setProductCategoryFilter(cat);
                      setProductPage(1);
                    }}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                      productCategoryFilter === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama produk, SKU, atau kategori..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductPage(1);
                }}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
              />
            </div>

            {/* Product Table List */}
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {currentCatalogItems.map((prod) => (
                <div key={prod.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-1 rounded">
                        {prod.sku}
                      </span>
                      <span className="text-[10px] text-slate-400">{prod.category}</span>
                    </div>
                    <p className="font-bold text-slate-800 truncate">{prod.name}</p>
                    <p className="text-[10px] text-slate-400">Satuan: <span className="text-emerald-700 font-semibold">{prod.unit}</span></p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(prod)}
                      className="p-1 text-slate-400 hover:text-emerald-700"
                      title="Edit Produk"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus produk "${prod.name}"?`)) deleteProduct(prod.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Pagination */}
            {totalCatalogPages > 1 && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Halaman {productPage} dari {totalCatalogPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                    disabled={productPage === 1}
                    className="p-1 rounded-lg border border-slate-200 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductPage((p) => Math.min(totalCatalogPages, p + 1))}
                    disabled={productPage === totalCatalogPages}
                    className="p-1 rounded-lg border border-slate-200 disabled:opacity-30"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3">
                <h3 className="text-xs font-bold text-slate-800">Edit Data Produk</h3>
                <form onSubmit={handleSaveEditProduct} className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Nama Produk</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Kode SKU Zenoti</label>
                    <input
                      type="text"
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-mono uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Kategori</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Satuan</label>
                    <select
                      value={editingProduct.unit}
                      onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <option value="Botol">Botol</option>
                      <option value="Tube">Tube</option>
                      <option value="Jar">Jar</option>
                      <option value="Kaleng">Kaleng</option>
                      <option value="Box">Box</option>
                      <option value="Pouch">Pouch</option>
                      <option value="Pcs">Pcs</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. SUBTAB: SALON CABANG (SUPER ADMIN ONLY) (CRUD)              */}
      {/* ============================================================== */}
      {isSuperAdmin && activeSubTab === 'salon' && (
        <div className="space-y-4">
          {/* Add Salon Form */}
          <form onSubmit={handleAddSalon} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              Tambah Cabang Salon Baru
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Nama Cabang (e.g. Salon Nusa Dua)"
                value={newSalonName}
                onChange={(e) => setNewSalonName(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                required
              />
              <input
                type="text"
                placeholder="Alamat Lengkap"
                value={newSalonAddress}
                onChange={(e) => setNewSalonAddress(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
              <input
                type="text"
                placeholder="No. Telepon / WA"
                value={newSalonPhone}
                onChange={(e) => setNewSalonPhone(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Simpan Cabang Salon
            </button>
          </form>

          {/* Salon Branch List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="text-xs font-bold text-slate-800 mb-2">
              Daftar Cabang Salon ({salons.length} Cabang)
            </h3>
            {salons.map((salon) => (
              <div
                key={salon.id}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  salon.id === activeSalon.id
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className="cursor-pointer flex-1 min-w-0"
                  onClick={() => setActiveSalonId(salon.id)}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900">{salon.name}</p>
                    {salon.id === activeSalon.id && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.2 rounded-full">
                        Aktif Sekarang
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{salon.address || 'Alamat belum diatur'}</p>
                  {salon.phone && <p className="text-[10px] text-slate-400">Telp: {salon.phone}</p>}
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => setEditingSalon(salon)}
                    className="p-1 text-slate-400 hover:text-emerald-700"
                    title="Edit Cabang"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (salons.length <= 1) {
                        alert('Tidak dapat menghapus cabang terakhir!');
                        return;
                      }
                      setDeletingSalon(salon);
                      setDeletePassword('');
                      setDeleteError(null);
                    }}
                    className="p-1 text-slate-400 hover:text-red-500"
                    title="Hapus Cabang"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Salon Modal */}
          {editingSalon && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3">
                <h3 className="text-xs font-bold text-slate-800">Edit Data Cabang Salon</h3>
                <form onSubmit={handleSaveEditSalon} className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Nama Cabang</label>
                    <input
                      type="text"
                      value={editingSalon.name}
                      onChange={(e) => setEditingSalon({ ...editingSalon, name: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Alamat</label>
                    <input
                      type="text"
                      value={editingSalon.address || ''}
                      onChange={(e) => setEditingSalon({ ...editingSalon, address: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">No. Telepon / WA</label>
                    <input
                      type="text"
                      value={editingSalon.phone || ''}
                      onChange={(e) => setEditingSalon({ ...editingSalon, phone: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingSalon(null)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Verifikasi Hapus Cabang Salon */}
          {deletingSalon && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-red-100 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Verifikasi Keamanan: Hapus Cabang
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tindakan ini permanen. Masukkan password Super Admin untuk konfirmasi.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-2xl text-xs text-red-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    Cabang yang akan dihapus: {deletingSalon.name}
                  </p>
                  <p className="text-[11px] text-red-700/90 leading-relaxed">
                    Seluruh data area, staf, katalog produk, dan riwayat transaksi pada cabang ini akan dihapus dari sistem.
                  </p>
                </div>

                {deleteError && (
                  <div className="p-3 bg-red-100/90 border border-red-300 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{deleteError}</span>
                  </div>
                )}

                <form onSubmit={handleConfirmDeleteSalon} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      Password Login Super Admin
                    </label>
                    <input
                      type="password"
                      placeholder="Masukkan password login Super Admin"
                      value={deletePassword}
                      onChange={(e) => {
                        setDeletePassword(e.target.value);
                        if (deleteError) setDeleteError(null);
                      }}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-800"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingSalon(null);
                        setDeletePassword('');
                        setDeleteError(null);
                      }}
                      className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Konfirmasi Hapus
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
