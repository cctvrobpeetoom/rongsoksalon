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
-- 8. DATA AWAL (SEED DATA: 7 SALON, AREA, & STAF AWAL)
-- ==============================================================
INSERT INTO public.salons (id, name, address, is_active) VALUES
('seminyak', 'Salon Seminyak', 'Jl. Kayu Aya No. 8, Seminyak', true),
('canggu', 'Salon Canggu', 'Jl. Pantai Batu Bolong No. 12, Canggu', true),
('ubud', 'Salon Ubud', 'Jl. Monkey Forest No. 45, Ubud', true),
('sanur', 'Salon Sanur', 'Jl. Danau Tamblingan No. 18, Sanur', true),
('kuta', 'Salon Kuta', 'Jl. Raya Kuta No. 88, Kuta', true),
('jimbaran', 'Salon Jimbaran', 'Jl. Uluwatu No. 22, Jimbaran', true),
('uluwatu', 'Salon Uluwatu', 'Jl. Labuansait No. 5, Pecatu', true)
ON CONFLICT (id) DO NOTHING;

-- Area Seminyak
INSERT INTO public.areas (id, salon_id, name, type) VALUES
('sem-amb-1', 'seminyak', 'Gudang Atas', 'ambil'),
('sem-amb-2', 'seminyak', 'Gudang Bawah', 'ambil'),
('sem-tar-1', 'seminyak', 'Salon Floor', 'taruh'),
('sem-tar-2', 'seminyak', 'Barber Area', 'taruh'),
('sem-tar-3', 'seminyak', 'Hairspa 1', 'taruh'),
('sem-tar-4', 'seminyak', 'Hairspa 2', 'taruh'),
('sem-tar-5', 'seminyak', 'Color Bar', 'taruh')
ON CONFLICT (id) DO NOTHING;

-- Area Canggu
INSERT INTO public.areas (id, salon_id, name, type) VALUES
('cng-amb-1', 'canggu', 'Gudang Utama Lantai 2', 'ambil'),
('cng-amb-2', 'canggu', 'Lemari Kasir', 'ambil'),
('cng-tar-1', 'canggu', 'Station Styling 1-4', 'taruh'),
('cng-tar-2', 'canggu', 'Wash Basin Room', 'taruh'),
('cng-tar-3', 'canggu', 'Barbershop VIP', 'taruh'),
('cng-tar-4', 'canggu', 'Treatment Spa', 'taruh')
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
