-- ==============================================================
-- SKEMA DATABASE SUPABASE UNTUK APLIKASI RONGSOKSALON
-- Salin dan jalankan script ini di: Supabase Dashboard -> SQL Editor
-- ==============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Untuk pencarian cepat nama & SKU produk

-- 2. TABEL SALON (7 CABANG)
CREATE TABLE IF NOT EXISTS public.salons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL AREA DINAMIS PER SALON (AMBIL vs TARUH)
CREATE TABLE IF NOT EXISTS public.areas (
    id TEXT PRIMARY KEY DEFAULT 'area-' || uuid_generate_v4(),
    salon_id TEXT NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ambil', 'taruh')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL STAF & USER LOGIN
CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY DEFAULT 'stf-' || uuid_generate_v4(),
    salon_id TEXT NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Stylist',
    username TEXT,
    pin TEXT DEFAULT '1234',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL MASTER PRODUK TERISOLASI PER SALON (~1.000 PRODUK)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT 'prd-' || uuid_generate_v4(),
    salon_id TEXT NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    unit TEXT DEFAULT 'Botol',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (salon_id, sku)
);

-- 6. TABEL TRANSAKSI RONGSOK FISIK
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY DEFAULT 'trx-' || uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    salon_id TEXT NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    staff_id TEXT REFERENCES public.staff(id) ON DELETE SET NULL,
    staff_name TEXT NOT NULL,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    product_unit TEXT NOT NULL DEFAULT 'Botol',
    source_area_id TEXT,
    source_area_name TEXT NOT NULL,
    target_area_id TEXT,
    target_area_name TEXT NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INDEX UNTUK PERFORMA TINGGI (1.000+ PRODUK & FILTER LAPORAN CEPAT)
CREATE INDEX IF NOT EXISTS idx_products_salon ON public.products(salon_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_transactions_salon_date ON public.transactions(salon_id, date);
CREATE INDEX IF NOT EXISTS idx_areas_salon ON public.areas(salon_id);
CREATE INDEX IF NOT EXISTS idx_staff_salon ON public.staff(salon_id);

-- ==============================================================
-- 8. DATA AWAL (SEED DATA: 6 SALON RESMI, AREA SUMBER, & STAF)
-- ==============================================================
INSERT INTO public.salons (id, name, address, phone, is_active) VALUES
('seminyak', 'Salon Seminyak', 'Petitenget St No.16, Seminyak, Kuta Utara, Badung Regency, Bali 80631', '08113875688', true),
('canggu', 'Salon Canggu', 'Jl. Canggu Padang Linjong No.101, Canggu, Kec. Kuta Utara, Kabupaten Badung, Bali 80361', '082342494890', true),
('ubud', 'Salon Ubud', 'Jl. Raya Sanggingan No.88, Kedewatan, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571', '08113875699', true),
('sanur', 'Salon Icon Sanur', 'Jl. Danau Tamblingan No.27, Sanur, Denpasar Selatan, Kota Denpasar, Bali 80228', '081138777654', true),
('kuta', 'Salon Surabaya', 'Surabaya', NULL, true),
('uluwatu', 'Salon Uluwatu', 'Uluwatu', NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone;

-- Area Seminyak (Sumber saja)
INSERT INTO public.areas (id, salon_id, name, type) VALUES
('sem-amb-1', 'seminyak', 'Gudang Atas', 'ambil'),
('sem-amb-2', 'seminyak', 'Gudang Bawah', 'ambil')
ON CONFLICT (id) DO NOTHING;

-- Area Canggu (Sumber saja)
INSERT INTO public.areas (id, salon_id, name, type) VALUES
('cng-amb-1', 'canggu', 'Gudang Utama Lantai 2', 'ambil'),
('cng-amb-2', 'canggu', 'Lemari Kasir', 'ambil')
ON CONFLICT (id) DO NOTHING;

-- Data awal staf dikosongkan agar admin menginput ulang seluruh staf langsung dari aplikasi.

-- Sample Katalog Produk Populer (Terisolasi per Cabang Salon)
INSERT INTO public.products (id, salon_id, sku, name, category, unit) VALUES
('prd-sem-001', 'seminyak', 'LOR-EXT-500', 'L''Oreal Serie Expert Vitamino Color Shampoo 500ml', 'Shampoo', 'Botol'),
('prd-sem-002', 'seminyak', 'LOR-EXT-MAS-500', 'L''Oreal Serie Expert Vitamino Color Mask 500ml', 'Hair Mask', 'Jar'),
('prd-sem-003', 'seminyak', 'LOR-ABS-REP-500', 'L''Oreal Serie Expert Absolut Repair Shampoo 500ml', 'Shampoo', 'Botol'),
('prd-sem-004', 'seminyak', 'LOR-MYT-OIL-100', 'L''Oreal Mythic Oil Original Treatment 100ml', 'Serum & Oil', 'Botol'),
('prd-sem-005', 'seminyak', 'OLA-BND-01-525', 'Olaplex No. 1 Bond Multiplier 525ml', 'Bond Treatment', 'Botol'),
('prd-cng-001', 'canggu', 'OLA-BND-04-1000', 'Olaplex No. 4 Bond Maintenance Shampoo 1000ml', 'Shampoo', 'Botol'),
('prd-cng-002', 'canggu', 'MKR-REB-STR-500', 'Makarizo Rebonding System Step 1 Straight 500g', 'Smoothing & Perm', 'Box'),
('prd-cng-003', 'canggu', 'MKR-TEX-SPA-1000', 'Makarizo Texture Experience Hair Spa Strawberry 1000g', 'Hair Spa Cream', 'Jar'),
('prd-cng-004', 'canggu', 'BRB-SUV-ORG-113', 'Suavecito Original Hold Pomade 113g', 'Barber Pomade', 'Jar')
ON CONFLICT (salon_id, sku) DO NOTHING;

-- ==============================================================
-- 9. IZIN AKSES (ROW LEVEL SECURITY / RLS)
-- Jalankan bagian ini agar aplikasi web dapat membaca & menulis
-- data tanpa terhalang error "violates row-level security policy"
-- ==============================================================
ALTER TABLE public.salons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

