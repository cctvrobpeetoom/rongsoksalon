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

-- 5. TABEL MASTER PRODUK (~1.000 PRODUK)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT 'prd-' || uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    unit TEXT DEFAULT 'Botol',
    created_at TIMESTAMPTZ DEFAULT NOW()
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

-- Staf Seminyak
INSERT INTO public.staff (id, salon_id, name, role, username, pin) VALUES
('stf-sem-1', 'seminyak', 'Budi Santoso', 'Senior Stylist', 'budi', '1234'),
('stf-sem-2', 'seminyak', 'Dewi Lestari', 'Colorist', 'dewi', '1234'),
('stf-sem-3', 'seminyak', 'Agus Pratama', 'Barber', 'agus', '1234'),
('stf-sem-4', 'seminyak', 'Siti Rahma', 'Hairspa Therapist', 'siti', '1234')
ON CONFLICT (id) DO NOTHING;

-- Staf Canggu
INSERT INTO public.staff (id, salon_id, name, role, username, pin) VALUES
('stf-cng-1', 'canggu', 'Michael Lee', 'Artistic Director', 'michael', '1234'),
('stf-cng-2', 'canggu', 'Putu Ayu', 'Stylist', 'putu', '1234'),
('stf-cng-3', 'canggu', 'Wayan Kevin', 'Barber', 'kevin', '1234')
ON CONFLICT (id) DO NOTHING;

-- Sample Katalog Produk Populer
INSERT INTO public.products (id, sku, name, category, unit) VALUES
('prd-001', 'LOR-EXT-500', 'L''Oreal Serie Expert Vitamino Color Shampoo 500ml', 'Shampoo', 'Botol'),
('prd-002', 'LOR-EXT-MAS-500', 'L''Oreal Serie Expert Vitamino Color Mask 500ml', 'Hair Mask', 'Jar'),
('prd-003', 'LOR-ABS-REP-500', 'L''Oreal Serie Expert Absolut Repair Shampoo 500ml', 'Shampoo', 'Botol'),
('prd-006', 'LOR-MYT-OIL-100', 'L''Oreal Mythic Oil Original Treatment 100ml', 'Serum & Oil', 'Botol'),
('prd-012', 'OLA-BND-01-525', 'Olaplex No. 1 Bond Multiplier 525ml', 'Bond Treatment', 'Botol'),
('prd-014', 'OLA-BND-04-1000', 'Olaplex No. 4 Bond Maintenance Shampoo 1000ml', 'Shampoo', 'Botol'),
('prd-022', 'MKR-REB-STR-500', 'Makarizo Rebonding System Step 1 Straight 500g', 'Smoothing & Perm', 'Box'),
('prd-024', 'MKR-TEX-SPA-1000', 'Makarizo Texture Experience Hair Spa Strawberry 1000g', 'Hair Spa Cream', 'Jar'),
('prd-036', 'BRB-SUV-ORG-113', 'Suavecito Original Hold Pomade 113g', 'Barber Pomade', 'Jar')
ON CONFLICT (sku) DO NOTHING;
