# Panduan Deploy Online: Supabase & Vercel
## Aplikasi Web: RongsokSalon (7 Cabang Salon)

Dokumen ini berisi panduan langkah-demi-langkah praktis untuk membuat aplikasi **RongsokSalon** dapat diakses secara online oleh seluruh staf di 7 cabang salon menggunakan HP masing-masing melalui internet.

---

## TAHAP 1: Menyiapkan Database di Supabase (Gratis)

Supabase bertindak sebagai database PostgreSQL di cloud yang akan menyimpan seluruh data cabang, area, staf, katalog 1.000 produk, dan riwayat transaksi rongsok.

1. Buka situs [https://supabase.com](https://supabase.com).
2. Klik **Start your project** dan masuk (*Sign In*) menggunakan akun **Google** atau **GitHub**.
3. Di dashboard Supabase, klik tombol **New Project**:
   - **Name**: `rongsoksalon-db`
   - **Database Password**: Buat password yang kuat (dan simpan di catatan rahasia Anda).
   - **Region**: Pilih **Singapore (Southeast Asia)** agar akses dari Bali/Indonesia super cepat.
   - **Pricing Plan**: Pilih **Free Tier**.
   - Klik **Create new project** (tunggu sekitar 1–2 menit hingga database selesai dibuat).
4. **Jalankan Script Skema Tabel**:
   - Di menu sebelah kiri dashboard Supabase, klik ikon **SQL Editor** (ikon tanda kurung siku `>_`).
   - Buka file [supabase_schema.sql](file:///c:/Users/Agusta%20Sigit/OneDrive/Documents/Aplikasi%20Salon%20Rosok%20Antigravity/supabase_schema.sql) di laptop Anda, lalu **salin (copy) seluruh isinya**.
   - Tempelkan (*paste*) ke dalam SQL Editor Supabase, lalu klik tombol **Run** (warna hijau di pojok kanan bawah).
   - Semua tabel (`salons`, `areas`, `staff`, `products`, `transactions`), indeks pencarian 1.000 produk, dan data awal otomatis selesai terpasang!
5. **Ambil Kunci API Supabase**:
   - Klik menu **Project Settings** (ikon gerigi di kiri bawah) $\rightarrow$ pilih **API**.
   - Salin dua data berikut:
     1. **Project URL**: (contoh: `https://xyzabc123.supabase.co`)
     2. **Project API keys (anon / public)**: (karakter acak panjang)

---

## TAHAP 2: Menaruh Kode ke GitHub (Gratis)

1. Buka [https://github.com](https://github.com) dan login ke akun GitHub Anda.
2. Klik tombol **New Repository**:
   - **Repository name**: `rongsoksalon`
   - Pilih **Private** (agar data & kode Anda aman hanya untuk internal salon Anda).
   - Klik **Create repository**.
3. Di laptop Anda, buka terminal di folder proyek ini lalu jalankan:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - RongsokSalon App"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/rongsoksalon.git
   git push -u origin main
   ```

---

## TAHAP 3: Menghubungkan & Online-kan di Vercel (Gratis)

Vercel akan meng-hosting aplikasi web Anda secara gratis lengkap dengan domain aman HTTPS (`https://...`).

1. Buka situs [https://vercel.com](https://vercel.com) dan login menggunakan akun **GitHub** Anda.
2. Di dashboard Vercel, klik tombol **Add New...** $\rightarrow$ pilih **Project**.
3. Cari repository **`rongsoksalon`** dari daftar GitHub Anda, lalu klik **Import**.
4. Di bagian **Configure Project**:
   - Buka accordion **Environment Variables**.
   - Tambahkan 2 variabel dari Supabase tadi:
     - **Key**: `NEXT_PUBLIC_SUPABASE_URL` | **Value**: *(Project URL Supabase Anda)*
     - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Value**: *(Anon Key Supabase Anda)*
5. Klik tombol **Deploy**!
6. Tunggu sekitar 1 menit. Aplikasi Anda sekarang **SUDAH RESMI ONLINE** dan memiliki link publik, misalnya:
   ```
   https://rongsoksalon.vercel.app
   ```
   *(Anda juga bisa menghubungkan nama domain sendiri seperti `rongsok.namasalonanda.com` di menu Settings Vercel).*

---

## TAHAP 4: Cara Memasang Aplikasi di Layar Utama HP Staf (PWA)

Aplikasi ini sudah berteknologi **Progressive Web App (PWA)**, sehingga staf tidak perlu mengunduh apapun dari Play Store / App Store:

### A. Untuk HP Android (Google Chrome):
1. Buka browser Chrome di HP staf, ketik link Vercel Anda (misal: `https://rongsoksalon.vercel.app`).
2. Ketuk ikon **Titik Tiga (⋮)** di pojok kanan atas Chrome.
3. Pilih menu **"Tambahkan ke Layar Utama"** (*Add to Home screen*) atau **"Pasang Aplikasi"** (*Install App*).
4. Ikon aplikasi **RongsokSalon** berwarna hijau akan langsung muncul di layar utama HP layaknya aplikasi Android asli!

### B. Untuk iPhone / iPad (Safari):
1. Buka browser Safari di iPhone staf, ketik link aplikasi Vercel Anda.
2. Ketuk tombol **Share / Bagikan** (ikon kotak dengan panah ke atas di bagian bawah Safari).
3. Gulir ke bawah dan pilih **"Tambah ke Layar Utama"** (*Add to Home Screen*).
4. Ketuk **Tambah** di pojok kanan atas. Ikon RongsokSalon akan langsung terpasang di layar iPhone.

---

## TAHAP 5: Alur Kerja Operasional Harian Staf & Manajemen

1. **Staf Datang ke Salon**:
   - Staf membuka aplikasi dari layar utama HP.
   - Staf login menggunakan nama/username dan PIN (misal: `budi` / `1234`).
   - Sistem **otomatis mengunci** salon tempat staf bertugas (staf Seminyak tidak akan bisa melihat salon Canggu atau Ubud).
2. **Saat Produk Habis Digunakan**:
   - Staf memilih **Area Ambil** (misal: *Gudang Atas*) dan **Area Taruh** (misal: *Hairspa 1*).
   - Staf mencari nama produk atau kode SKU Zenoti di kolom pencarian.
   - Jika membawa banyak botol kosong sekaligus, staf cukup beralih ke tombol **"Input Sekaligus (Batch)"** untuk memasukkan 5–10 produk ke keranjang dan menyimpan semuanya sekaligus dalam 1 kali klik.
3. **Pencocokan Akhir Bulan oleh Manager / Owner**:
   - Manager atau Owner login menggunakan akun admin di laptop.
   - Buka menu **Summary Laporan & Excel**.
   - Klik tombol **Download Laporan Excel (.xlsx/csv)**.
   - Laporan fisik ini langsung dibandingkan dengan laporan ekspor *outgoing* dari aplikasi Zenoti untuk mengaudit apakah ada botol yang hilang (*shrinkage*) atau tidak tercatat.
