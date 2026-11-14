# Changelog & Aturan Bisnis Proyek RongsokSalon

Dokumen ini mencatat setiap keputusan arsitektur, fase pengerjaan, skema data, dan aturan operasional aplikasi RongsokSalon.

---

## [Pembaruan] - Sinkronisasi 6 Cabang Resmi & Integrasi Real-Time Cloud Database Supabase
*Tanggal: 14 November 2026*

### 1. Sinkronisasi Data Bawaan 6 Cabang Resmi (`src/data/initialData.ts`, `supabase_schema.sql`, `AppContext.tsx`)
- Memperbarui data bawaan (`INITIAL_SALONS`) dengan 6 cabang resmi (Seminyak, Canggu, Ubud, Salon Icon Sanur, Salon Surabaya, Salon Uluwatu) beserta alamat dan nomor telepon terkininya.
- Menghapus data cabang Jimbaran dari daftar bawaan awal.
- Memperbarui kunci penyimpanan lokal ke `rongsok_salons_v2` sehingga seluruh browser (Google Chrome, Safari di HP, Antigravity) langsung memuat 6 cabang resmi ini tanpa menampilkan 7 cabang lama.

### 2. Integrasi Penuh Cloud Database Supabase Real-Time (`src/lib/supabase.ts`, `src/context/AppContext.tsx`)
- Menghubungkan aplikasi ke cloud PostgreSQL Supabase secara langsung via REST API (tanpa dependensi paket eksternal agar kompatibel di semua browser dan mobile).
- Sinkronisasi otomatis dua arah:
  - Memuat data cabang, area, staf, katalog produk, dan transaksi dari database Supabase saat aplikasi dibuka.
  - Polling berkala (setiap 12 detik dan saat tab browser kembali aktif) agar transaksi yang dicatat staf di satu perangkat langsung muncul di perangkat staf / manajer lain secara real-time.
  - Setiap penambahan, pembaruan, dan penghapusan data langsung disimpan ke Supabase Cloud.
- Menambahkan indikator status koneksi database di Navbar dan Pengaturan (`Cloud Realtime` vs `Lokal Offline`) serta tombol sinkronisasi manual.

---

## [Revisi] - Pembaruan Footer Login & Verifikasi Password Penghapusan Salon
*Tanggal: 13 November 2026*

### 1. Pembaruan Footer Halaman Login (`src/components/LoginView.tsx`)
- Teks hak cipta di bagian bawah halaman login diperbarui menjadi: **"RongsokSalon by Agusta Sigit © 2026"**.

### 2. Verifikasi Password Super Admin Saat Menghapus Cabang Salon (`src/components/SettingsView.tsx`, `src/context/AppContext.tsx`)
- Menambahkan modal dialog verifikasi keamanan saat Super Admin menekan tombol hapus cabang salon.
- Super Admin wajib memasukkan password login Super Admin (`Petitenget16` atau `sigitlapar`) untuk mengonfirmasi penghapusan. Hal ini mencegah salah klik yang tidak disengaja dan menjaga keamanan database cabang salon.
- Seluruh data area, staf, katalog produk, dan transaksi terkait cabang tersebut dibersihkan secara aman saat konfirmasi berhasil.

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

### 5. Salam Sapa Staf di Halaman Awal (`src/app/page.tsx`)
- Menambahkan banner salam sapa di bagian atas halaman awal setelah login, menampilkan nama staf yang sedang login beserta cabang aktif (contoh: *"Hi Sari, kamu berada di Rongsok Salon Seminyak"*).

### 6. Penghapusan Seluruh Data Staf Bawaan & Pembaruan Kredensial Super Admin (`src/data/initialData.ts`, `src/context/AppContext.tsx`, `supabase_schema.sql`)
- Seluruh daftar staf bawaan (`INITIAL_STAFF`) dan akun login staf demo di `INITIAL_USERS` dihapus sehingga hanya menyisakan akun Super Admin.
- Kredensial Super Admin diperbarui dengan 2 akses aktif (`username: admin` dengan password `Petitenget16`, serta akun Super Admin tambahan `username: admin` dengan password `sigitlapar`), dan login Super Admin diprioritaskan agar dapat mengakses seluruh cabang.
- Kunci penyimpanan staf diperbarui ke `rongsok_staff_v2` (dan data lama `rongsok_staff` dibersihkan otomatis) agar seluruh staf mulai kosong dan dapat diinput ulang dari menu Pengaturan > Staf.

### 7. Penghapusan Form Area Tujuan — Hanya Area Sumber (`SettingsView.tsx`, `InputForm.tsx`, `HistoryList.tsx`, `ReportView.tsx`)
- Pilihan tipe dan daftar **Area Taruh (Tujuan)** dihapus dari menu **Pengaturan > Area** maupun **Form Input**, sehingga pencatatan dan master area hanya menggunakan **Area Sumber** (`type: 'ambil'`).
- Penyimpanan area di `localStorage` diperbarui ke `rongsok_areas_v2` (dengan migrasi otomatis menyaring data lama agar hanya menyisakan area sumber).
- Tampilan riwayat, filter laporan, breakdown laporan, ekspor CSV, serta seed area di `supabase_schema.sql` disesuaikan agar hanya menampilkan **Area Sumber**.

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
