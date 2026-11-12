# Changelog & Aturan Bisnis Proyek RongsokSalon

Dokumen ini mencatat setiap keputusan arsitektur, fase pengerjaan, skema data, dan aturan operasional aplikasi RongsokSalon.

---

## [Revisi] - Penghapusan Bantuan Login Uji Coba, Dropdown Jabatan, Placeholder Bersih & Isolasi Database Produk Per Salon
*Tanggal: 12 November 2026*

### 1. Penghapusan Bantuan Akun Uji Coba di Halaman Login (`src/components/LoginView.tsx`)
- Kotak bantuan akun uji coba lokal (*Bantuan Akun Uji Coba Lokal* beserta tombol isi cepat) dihapus sepenuhnya agar tidak tampil di versi produksi online (Vercel).

### 2. Dropdown Pilihan Jabatan Staf (`src/components/SettingsView.tsx`)
- Kolom **Jabatan / Role** pada form *Tambah Staf & Akun Login* maupun modal *Edit Staf* diubah dari input teks bebas menjadi **pilihan dropdown** (`Stylist`, `Senior Stylist`, `Colorist`, `Barber`, `Hairspa Therapist`, `Manager / Supervisor`, `Kasir / Admin`, `Assistant`).

### 3. Kolom Input Menggunakan Placeholder (Kosong Saat Siap Diketik)
- Nilai awal bawaan yang terisi otomatis (seperti username `budi` dan PIN `1234` di halaman Login, serta PIN `1234` dan kategori `Hair Care` di Pengaturan) dihapus dari state awal dan dipindahkan ke atribut `placeholder`, sehingga kolom langsung bersih saat diklik/diketik tanpa perlu menghapus teks contoh terlebih dahulu.

### 4. Isolasi Ketat Database Produk Per Cabang Salon
- Setiap produk kini terikat dengan `salonId` (`src/types/index.ts`, `src/data/initialData.ts`, `src/context/AppContext.tsx`).
- Penambahan produk manual, impor CSV Zenoti, ekspor CSV, tampilan katalog di Pengaturan (`SettingsView.tsx`), dan pencarian produk pada form input (`InputForm.tsx`) hanya membaca dan menulis data milik salon yang sedang aktif (`currentSalonProducts`), dengan kunci penyimpanan `localStorage` versi `rongsok_products_v2`.
- Skema Supabase (`supabase_schema.sql`) diperbarui dengan kolom `salon_id` pada tabel `public.products` beserta constraint `UNIQUE (salon_id, sku)` dan indeks `idx_products_salon`.

---

## [Fase 5] - Persiapan PWA Mobile, Skema Database Supabase & Panduan Deploy Vercel (Selesai)
*Tanggal: 10 November 2026*

### 1. Kemampuan Progressive Web App (PWA)
- Konfigurasi `public/manifest.json` dan ikon aplikasi `public/icon.svg`.
- Staf salon di Android (Chrome) dan iPhone (Safari) dapat menambahkan aplikasi ke Layar Utama (*Add to Home Screen*) sehingga aplikasi berjalan dengan tampilan layar penuh (*standalone/fullscreen*) tanpa bar alamat browser.
- Dukungan notch layar iPhone modern via `viewportFit: 'cover'`.

### 2. Skema Database Supabase Siap Pakai (`supabase_schema.sql`)
- Script SQL lengkap untuk Supabase PostgreSQL yang mencakup:
  - Tabel `salons`, `areas`, `staff`, `products`, `transactions`.
  - Indeks Trigram (`pg_trgm`) untuk pencarian instan nama & SKU 1.000+ produk.
  - Foreign key relasi dan constraints.
  - Data bawaan (*Seed Data*) untuk 7 cabang awal, area, staf, dan contoh produk.

### 3. Modul Adapter Supabase Client (`src/lib/supabase.ts`)
- Adapter client yang mendeteksi konfigurasi environment variable Supabase.
- Berjalan otomatis secara lokal jika belum terhubung, dan langsung tersambung ke cloud ketika kredensial Supabase dimasukkan di Vercel.

### 4. Dokumen Panduan Deploy Online Lengkap (`PANDUAN_DEPLOY_VERCEL_SUPABASE.md`)
- Panduan terperinci berbahasa Indonesia mulai dari membuat database di Supabase, menaruh kode di GitHub, menghubungkan ke Vercel, hingga panduan penggunaan operasional harian bagi staf salon (Tersedia lengkap di file `PANDUAN_LENGKAP_SUPABASE_GITHUB_VERCEL.md`).

---

## [Pembaruan] - Penyederhanaan Form Input & Pembersihan Tampilan (Clean UI)
*Tanggal: 10 November 2026*

### 1. Penghapusan Menu "Pilihan Cepat (Sering Habis)"
- Bagian tombol pintas *Pilihan Cepat (Sering Habis)* pada form input telah dihapus dari tampilan.
- Form input kini langsung fokus dari pemilihan Area Ambil & Taruh ke kolom pencarian produk (*Searchable Combobox*), sehingga tata letak di layar ponsel (*mobile*) menjadi jauh lebih ringkas, rapi (*clean*), dan tidak memakan ruang vertikal.

---

## [Pembaruan] - Penyederhanaan Menu Laporan & Arsip Modul Rekonsiliasi Otomatis Zenoti
*Tanggal: 10 November 2026*

### 1. Keputusan Bisnis (Pencocokan Manual):
- Format file ekspor Excel dari aplikasi Zenoti di lapangan sering kali berubah atau mengalami error format kolom.
- Oleh karena itu, fitur pencocokan (*match*) otomatis di aplikasi **dinonaktifkan / disembunyikan dari antarmuka**, dan proses pencocokan barang keluar Zenoti dengan fisik rongsok dilakukan **secara manual** oleh manajemen melalui perbandingan laporan Excel.
- Tampilan menu Laporan kini 100% fokus pada **Summary Laporan Pemakaian Bulanan** yang bersih, cepat, dan mudah diunduh ke Excel.

### 2. [ARSIP SPESIFIKASI] Modul Rekonsiliasi Otomatis Zenoti (Untuk Masa Depan)
Jika di kemudian hari format ekspor Zenoti sudah stabil dan fitur rekonsiliasi otomatis ingin diaktifkan kembali, berikut panduan arsitektur dan spesifikasinya:
- **Tipe Data (`ReconciliationItem`)**:
  ```ts
  export interface ReconciliationItem {
    sku: string;
    productName: string;
    unit: string;
    zenotiQty: number;      // Data keluar dari sistem Zenoti
    rongsokQty: number;     // Data fisik botol kosong yang dicatat
    difference: number;     // Rumus: rongsokQty - zenotiQty
    status: 'match' | 'missing_physical' | 'missing_zenoti';
  }
  ```
- **Logika Klasifikasi Selisih**:
  1. `difference === 0` $\rightarrow$ **Status: Cocok (Match 100%)**.
  2. `difference < 0` $\rightarrow$ **Status: Kurang Fisik (Shrinkage)** (Zenoti catat 5 keluar, fisik hanya ada 3. Selisih -2 botol).
  3. `difference > 0` $\rightarrow$ **Status: Belum di Zenoti** (Fisik rongsok ada 4, tapi Zenoti hanya catat 2 keluar. Selisih +2 botol).
- **Format Pembacaan CSV Zenoti**:
  - Kolom kunci: `Kode SKU / Item Code` dan `Qty / Quantity Outgoing`.
  - Pemetaan otomatis mencocokkan `productSku.toUpperCase()`.

---

## [Fase 4] - Modul Laporan Analitik & Ekspor Excel (Selesai)
*Tanggal: 10 November 2026*

### 1. Modul Summary & Analisis Konsumsi Bulanan
- **Rentang Periode Standar**: Default otomatis tanggal 1 hingga akhir bulan berjalan (misal: *01 Nov 2026 - 30 Nov 2026*).
- **Penyaringan Fleksibel**:
  - Filter rentang tanggal bebas (Dari Tanggal s/d Sampai Tanggal).
  - Filter pencarian teks kata kunci (Nama Produk / Kode SKU).
  - Filter khusus per Petugas / Stylist.
  - Filter khusus per Area Taruh (Tujuan pemakaian).
- **Visualisasi & KPI Metrik**:
  - Total Barang Habis Fisik (Pcs).
  - Total Varian Produk Terpakai (Item Unik).
  - Total Catatan Transaksi.
  - **Top 5 Produk Paling Banyak Digunakan**: Visual progress bar berwarna emerald/teal dengan persentase pemakaian.
  - **Distribusi Pemakaian per Area Taruh**: Rekap kuantitas yang ditaruh di Barber, Hairspa 1, Hairspa 2, Salon Floor, Color Bar, dll.
  - **Distribusi Pemakaian per Petugas**: Mengetahui peringkat konsumsi produk oleh masing-masing stylist/therapist.
- **Tabel Transaksi dengan Paginasi 20 Baris**:
  - Menampilkan baris transaksi lengkap dengan paginasi agar tidak memperlambat perangkat mobile.
- **Ekspor Laporan Excel**:
  - 1-klik untuk mengunduh laporan berformat `.csv` dengan header UTF-8 BOM rapi yang langsung terbaca rapi di Microsoft Excel.

---

## [Fase 3] - Modul Transaksi Pencatatan Rongsok & Mode Batch (Selesai)
*Tanggal: 10 November 2026*

### 1. Mode Input Sekaligus (Batch / Keranjang Input)
- Memilih Tanggal, Petugas, dan Area 1 kali saja, lalu memasukkan banyak produk sekaligus ke keranjang.
### 2. Pilihan Cepat Produk Sering Habis (*Quick Tap Shortcuts*)
### 3. Validasi Area Berbeda (Area Ambil != Area Taruh)
### 4. Widget Rekap Cepat Hari Ini

---

## [Fase 2] - Master Data Management & Sinkronisasi Impor Zenoti (Selesai)
*Tanggal: 10 November 2026*

### 1. Modul Impor & Ekspor Katalog Produk Zenoti (~1.000 Items)
### 2. Modul Master Area Dinamis (Ambil & Taruh)
### 3. Modul Master Staf & Kredensial Login
### 4. Modul Master Cabang Salon (Khusus Super Admin)

---

## [Pembaruan Keamanan] - Penguncian Cabang (1 Staf = 1 Salon) & Kebijakan Akun Demo
*Tanggal: 10 November 2026*

---

## [Pembaruan] - Menu Login & Paginasi Riwayat (20 Item + Filter Tanggal)
*Tanggal: 10 November 2026*

---

## [Fase 1] - Inisialisasi Fondasi & Antarmuka Mobile-First
*Tanggal: 09 November 2026*
