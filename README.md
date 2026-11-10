# RongsokSalon - Web App Pencatatan Produk Habis Salon

Aplikasi web responsif (Mobile & Desktop) untuk mencatat fisik botol/produk habis pakai (*waste/rongsok*) di 7 cabang salon untuk dicocokkan (*cross-match*) dengan pengeluaran inventaris aplikasi Zenoti.

---

## 🌟 Fitur Utama Aplikasi

1. **Responsif & Mobile-First (PWA)**:
   - Dapat dipasang (*Add to Home Screen*) di layar utama HP Android & iPhone layaknya aplikasi asli.
   - Mode Input Satuan Cepat & Mode Input Sekaligus (Batch).
2. **Multi-Tenant (7 Cabang Salon)**:
   - Data terisolasi aman per cabang salon (Seminyak, Canggu, Ubud, Sanur, Kuta, Jimbaran, Uluwatu).
   - **Aturan Keamanan**: 1 Staf terkunci khusus pada 1 cabang salon tempatnya bertugas.
3. **Master Area Dinamis**:
   - Area Ambil (Sumber Barang) vs Area Taruh (Tujuan Pemakaian) disesuaikan dinamis per salon.
4. **Pencarian Cepat 1.000+ Produk**:
   - Autocomplete instan berdasarkan Nama Produk atau Kode SKU Zenoti.
   - Fitur Impor Massal ribuan produk via file CSV dari Zenoti.
5. **Summary Laporan & Ekspor Excel**:
   - Default filter tanggal 1 s/d akhir bulan berjalan.
   - Peringkat Top 5 Produk paling banyak digunakan.
   - Distribusi pemakaian per area taruh & per staf.
   - 1-klik unduh rekap laporan ke format Excel (.xlsx/csv).

---

## 🚀 Cara Menjalankan Secara Lokal (Laptop)

```bash
# 1. Masuk ke folder proyek
cd "c:\Users\Agusta Sigit\OneDrive\Documents\Aplikasi Salon Rosok Antigravity"

# 2. Jalankan aplikasi
npm run dev
```
Buka browser di laptop: **`http://localhost:3000`**

---

## 🌐 Cara Online-kan ke Supabase & Vercel

Panduan lengkap langkah-demi-langkah tersedia di:
👉 **[PANDUAN_DEPLOY_VERCEL_SUPABASE.md](file:///c:/Users/Agusta%20Sigit/OneDrive/Documents/Aplikasi%20Salon%20Rosok%20Antigravity/PANDUAN_DEPLOY_VERCEL_SUPABASE.md)**

File pendukung yang telah disiapkan:
- **[supabase_schema.sql](file:///c:/Users/Agusta%20Sigit/OneDrive/Documents/Aplikasi%20Salon%20Rosok%20Antigravity/supabase_schema.sql)**: Script SQL untuk membuat seluruh tabel & index di Supabase Studio.
- **[.env.example](file:///c:/Users/Agusta%20Sigit/OneDrive/Documents/Aplikasi%20Salon%20Rosok%20Antigravity/.env.example)**: Contoh konfigurasi kunci API Supabase.
- **[CHANGELOG.md](file:///c:/Users/Agusta%20Sigit/OneDrive/Documents/Aplikasi%20Salon%20Rosok%20Antigravity/CHANGELOG.md)**: Rekam jejak seluruh keputusan arsitektur dan aturan bisnis.
