import { Salon, Area, Staff, Product, RongsokTransaction, User } from '@/types';

export const INITIAL_USERS: (User & { pin: string })[] = [
  { id: 'usr-admin', username: 'admin', pin: 'admin123', name: 'Super Admin Salon', role: 'superadmin' },
  { id: 'usr-budi', username: 'budi', pin: '1234', name: 'Budi Santoso', role: 'staff', assignedSalonId: 'seminyak' },
  { id: 'usr-dewi', username: 'dewi', pin: '1234', name: 'Dewi Lestari', role: 'staff', assignedSalonId: 'seminyak' },
  { id: 'usr-agus', username: 'agus', pin: '1234', name: 'Agus Pratama', role: 'staff', assignedSalonId: 'seminyak' },
  { id: 'usr-michael', username: 'michael', pin: '1234', name: 'Michael Lee', role: 'staff', assignedSalonId: 'canggu' },
  { id: 'usr-ketut', username: 'ketut', pin: '1234', name: 'Ketut Suardika', role: 'staff', assignedSalonId: 'ubud' },
  { id: 'usr-komang', username: 'komang', pin: '1234', name: 'Komang Krisna', role: 'staff', assignedSalonId: 'sanur' },
];

export const INITIAL_SALONS: Salon[] = [
  { id: 'seminyak', name: 'Salon Seminyak', address: 'Jl. Kayu Aya No. 8, Seminyak', isActive: true },
  { id: 'canggu', name: 'Salon Canggu', address: 'Jl. Pantai Batu Bolong No. 12, Canggu', isActive: true },
  { id: 'ubud', name: 'Salon Ubud', address: 'Jl. Monkey Forest No. 45, Ubud', isActive: true },
  { id: 'sanur', name: 'Salon Sanur', address: 'Jl. Danau Tamblingan No. 18, Sanur', isActive: true },
  { id: 'kuta', name: 'Salon Kuta', address: 'Jl. Raya Kuta No. 88, Kuta', isActive: true },
  { id: 'jimbaran', name: 'Salon Jimbaran', address: 'Jl. Uluwatu No. 22, Jimbaran', isActive: true },
  { id: 'uluwatu', name: 'Salon Uluwatu', address: 'Jl. Labuansait No. 5, Pecatu', isActive: true },
];

export const INITIAL_AREAS: Area[] = [
  // Seminyak
  { id: 'sem-amb-1', salonId: 'seminyak', name: 'Gudang Atas', type: 'ambil' },
  { id: 'sem-amb-2', salonId: 'seminyak', name: 'Gudang Bawah', type: 'ambil' },
  { id: 'sem-tar-1', salonId: 'seminyak', name: 'Salon Floor', type: 'taruh' },
  { id: 'sem-tar-2', salonId: 'seminyak', name: 'Barber Area', type: 'taruh' },
  { id: 'sem-tar-3', salonId: 'seminyak', name: 'Hairspa 1', type: 'taruh' },
  { id: 'sem-tar-4', salonId: 'seminyak', name: 'Hairspa 2', type: 'taruh' },
  { id: 'sem-tar-5', salonId: 'seminyak', name: 'Color Bar', type: 'taruh' },

  // Canggu
  { id: 'cng-amb-1', salonId: 'canggu', name: 'Gudang Utama Lantai 2', type: 'ambil' },
  { id: 'cng-amb-2', salonId: 'canggu', name: 'Lemari Kasir', type: 'ambil' },
  { id: 'cng-tar-1', salonId: 'canggu', name: 'Station Styling 1-4', type: 'taruh' },
  { id: 'cng-tar-2', salonId: 'canggu', name: 'Wash Basin Room', type: 'taruh' },
  { id: 'cng-tar-3', salonId: 'canggu', name: 'Barbershop VIP', type: 'taruh' },
  { id: 'cng-tar-4', salonId: 'canggu', name: 'Treatment Spa', type: 'taruh' },

  // Ubud
  { id: 'ubd-amb-1', salonId: 'ubud', name: 'Gudang Belakang', type: 'ambil' },
  { id: 'ubd-tar-1', salonId: 'ubud', name: 'Main Hall Salon', type: 'taruh' },
  { id: 'ubd-tar-2', salonId: 'ubud', name: 'Creambath Room A', type: 'taruh' },
  { id: 'ubd-tar-3', salonId: 'ubud', name: 'Creambath Room B', type: 'taruh' },

  // Sanur
  { id: 'snr-amb-1', salonId: 'sanur', name: 'Gudang Sentral', type: 'ambil' },
  { id: 'snr-tar-1', salonId: 'sanur', name: 'Area Shampo', type: 'taruh' },
  { id: 'snr-tar-2', salonId: 'sanur', name: 'Area Potong Rambut', type: 'taruh' },
  { id: 'snr-tar-3', salonId: 'sanur', name: 'Ruang Hair Spa', type: 'taruh' },

  // Kuta
  { id: 'kta-amb-1', salonId: 'kuta', name: 'Gudang Produk', type: 'ambil' },
  { id: 'kta-tar-1', salonId: 'kuta', name: 'Salon Station', type: 'taruh' },
  { id: 'kta-tar-2', salonId: 'kuta', name: 'Barber Corner', type: 'taruh' },

  // Jimbaran
  { id: 'jmb-amb-1', salonId: 'jimbaran', name: 'Gudang Stock', type: 'ambil' },
  { id: 'jmb-tar-1', salonId: 'jimbaran', name: 'Treatment Room 1', type: 'taruh' },
  { id: 'jmb-tar-2', salonId: 'jimbaran', name: 'Treatment Room 2', type: 'taruh' },

  // Uluwatu
  { id: 'ulw-amb-1', salonId: 'uluwatu', name: 'Gudang Depan', type: 'ambil' },
  { id: 'ulw-tar-1', salonId: 'uluwatu', name: 'Salon Floor', type: 'taruh' },
  { id: 'ulw-tar-2', salonId: 'uluwatu', name: 'Cliffside Spa', type: 'taruh' },
];

export const INITIAL_STAFF: Staff[] = [
  // Seminyak
  { id: 'stf-sem-1', salonId: 'seminyak', name: 'Budi Santoso', role: 'Senior Stylist', isActive: true },
  { id: 'stf-sem-2', salonId: 'seminyak', name: 'Dewi Lestari', role: 'Colorist', isActive: true },
  { id: 'stf-sem-3', salonId: 'seminyak', name: 'Agus Pratama', role: 'Barber', isActive: true },
  { id: 'stf-sem-4', salonId: 'seminyak', name: 'Siti Rahma', role: 'Hairspa Therapist', isActive: true },

  // Canggu
  { id: 'stf-cng-1', salonId: 'canggu', name: 'Michael Lee', role: 'Artistic Director', isActive: true },
  { id: 'stf-cng-2', salonId: 'canggu', name: 'Putu Ayu', role: 'Stylist', isActive: true },
  { id: 'stf-cng-3', salonId: 'canggu', name: 'Wayan Kevin', role: 'Barber', isActive: true },

  // Ubud
  { id: 'stf-ubd-1', salonId: 'ubud', name: 'Ketut Suardika', role: 'Senior Therapist', isActive: true },
  { id: 'stf-ubd-2', salonId: 'ubud', name: 'Made Wardani', role: 'Stylist', isActive: true },

  // Sanur
  { id: 'stf-snr-1', salonId: 'sanur', name: 'Komang Krisna', role: 'Stylist', isActive: true },
  { id: 'stf-snr-2', salonId: 'sanur', name: 'Ni Luh Sari', role: 'Color Specialist', isActive: true },

  // Kuta
  { id: 'stf-kta-1', salonId: 'kuta', name: 'Doni Firmansyah', role: 'Barber & Stylist', isActive: true },

  // Jimbaran
  { id: 'stf-jmb-1', salonId: 'jimbaran', name: 'Ilham Jaya', role: 'Hair Therapist', isActive: true },

  // Uluwatu
  { id: 'stf-ulw-1', salonId: 'uluwatu', name: 'Rendra Wijaya', role: 'Senior Stylist', isActive: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  // L'Oreal Professionnel
  { id: 'prd-001', sku: 'LOR-EXT-500', name: "L'Oreal Serie Expert Vitamino Color Shampoo 500ml", category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-002', sku: 'LOR-EXT-MAS-500', name: "L'Oreal Serie Expert Vitamino Color Mask 500ml", category: 'Hair Mask', unit: 'Jar' },
  { id: 'prd-003', sku: 'LOR-ABS-REP-500', name: "L'Oreal Serie Expert Absolut Repair Shampoo 500ml", category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-004', sku: 'LOR-ABS-REP-MAS-500', name: "L'Oreal Serie Expert Absolut Repair Mask 500ml", category: 'Hair Mask', unit: 'Jar' },
  { id: 'prd-005', sku: 'LOR-SIL-500', name: "L'Oreal Serie Expert Silver Shampoo Anti-Kuning 500ml", category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-006', sku: 'LOR-MYT-OIL-100', name: "L'Oreal Mythic Oil Original Treatment 100ml", category: 'Serum & Oil', unit: 'Botol' },
  { id: 'prd-007', sku: 'LOR-MAJ-COL-1', name: "L'Oreal Majirel Permanent Color No. 1 Hitam Alami 50ml", category: 'Hair Color', unit: 'Tube' },
  { id: 'prd-008', sku: 'LOR-MAJ-COL-5', name: "L'Oreal Majirel Permanent Color No. 5 Light Brown 50ml", category: 'Hair Color', unit: 'Tube' },
  { id: 'prd-009', sku: 'LOR-MAJ-COL-7', name: "L'Oreal Majirel Permanent Color No. 7.1 Blonde Ash 50ml", category: 'Hair Color', unit: 'Tube' },
  { id: 'prd-010', sku: 'LOR-OXI-20V-1000', name: "L'Oreal Oxydant Creme 6% (20 Volume) 1000ml", category: 'Developer', unit: 'Botol' },
  { id: 'prd-011', sku: 'LOR-OXI-30V-1000', name: "L'Oreal Oxydant Creme 9% (30 Volume) 1000ml", category: 'Developer', unit: 'Botol' },

  // Olaplex
  { id: 'prd-012', sku: 'OLA-BND-01-525', name: 'Olaplex No. 1 Bond Multiplier 525ml', category: 'Bond Treatment', unit: 'Botol' },
  { id: 'prd-013', sku: 'OLA-BND-02-525', name: 'Olaplex No. 2 Bond Perfector 525ml', category: 'Bond Treatment', unit: 'Botol' },
  { id: 'prd-014', sku: 'OLA-BND-04-1000', name: 'Olaplex No. 4 Bond Maintenance Shampoo 1000ml', category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-015', sku: 'OLA-BND-05-1000', name: 'Olaplex No. 5 Bond Maintenance Conditioner 1000ml', category: 'Conditioner', unit: 'Botol' },
  { id: 'prd-016', sku: 'OLA-BND-07-30', name: 'Olaplex No. 7 Bonding Oil 30ml', category: 'Serum & Oil', unit: 'Botol' },

  // Kerastase
  { id: 'prd-017', sku: 'KRS-BN-CHRO-1000', name: 'Kerastase Bain Chroma Respect Shampoo 1000ml', category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-018', sku: 'KRS-BN-DIV-1000', name: 'Kerastase Bain Densifique Shampoo 1000ml', category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-019', sku: 'KRS-MSK-CHRO-500', name: 'Kerastase Masque Chroma Filler 500ml', category: 'Hair Mask', unit: 'Jar' },
  { id: 'prd-020', sku: 'KRS-ELX-ULT-100', name: 'Kerastase Elixir Ultime L’Huile Original Hair Oil 100ml', category: 'Serum & Oil', unit: 'Botol' },
  { id: 'prd-021', sku: 'KRS-FUS-AMP-12', name: 'Kerastase Fusio-Dose Concentre Booster 12ml', category: 'Treatment Ampoule', unit: 'Ampul' },

  // Makarizo Professional
  { id: 'prd-022', sku: 'MKR-REB-STR-500', name: 'Makarizo Rebonding System Step 1 Straight 500g', category: 'Smoothing & Perm', unit: 'Box' },
  { id: 'prd-023', sku: 'MKR-REB-NTL-500', name: 'Makarizo Rebonding Neutralizer Step 2 500g', category: 'Smoothing & Perm', unit: 'Box' },
  { id: 'prd-024', sku: 'MKR-TEX-SPA-1000', name: 'Makarizo Texture Experience Hair Spa Strawberry 1000g', category: 'Hair Spa Cream', unit: 'Jar' },
  { id: 'prd-025', sku: 'MKR-TEX-SPA-MNT-1000', name: 'Makarizo Texture Experience Hair Spa Mint 1000g', category: 'Hair Spa Cream', unit: 'Jar' },
  { id: 'prd-026', sku: 'MKR-ENR-NUT-100', name: 'Makarizo Hair Energy Scentsations Ocean Breeze 100ml', category: 'Hair Perfume', unit: 'Botol' },

  // Matrix Professional
  { id: 'prd-027', sku: 'MTX-WND-BRN-60', name: 'Matrix Wonder Brown Hair Dye 7.3 Dark Golden Brown 60ml', category: 'Hair Color', unit: 'Tube' },
  { id: 'prd-028', sku: 'MTX-OPT-SMO-400', name: 'Matrix Opti.Straight Resistant Cream Step 1 400ml', category: 'Smoothing & Perm', unit: 'Pouch' },
  { id: 'prd-029', sku: 'MTX-OPT-NTL-400', name: 'Matrix Opti.Straight Conditioning Neutralizer 400ml', category: 'Smoothing & Perm', unit: 'Pouch' },
  { id: 'prd-030', sku: 'MTX-BIO-SMP-1000', name: 'Matrix Biolage ScalpSync Anti-Dandruff Shampoo 1000ml', category: 'Shampoo', unit: 'Botol' },

  // Wella & Schwarzkopf
  { id: 'prd-031', sku: 'WEL-KOL-PER-60', name: 'Wella Koleston Perfect Me+ Pure Naturals 60ml', category: 'Hair Color', unit: 'Tube' },
  { id: 'prd-032', sku: 'WEL-EIMI-SPR-500', name: 'Wella EIMI Super Set Extra Strong Finishing Spray 500ml', category: 'Styling Spray', unit: 'Kaleng' },
  { id: 'prd-033', sku: 'SCW-OSI-DUST-10', name: 'Schwarzkopf OSiS+ Dust It Mattifying Powder 10g', category: 'Barber Styling', unit: 'Botol' },
  { id: 'prd-034', sku: 'SCW-BLD-ME-450', name: 'Schwarzkopf BLONDME Premium Lightener 9+ 450g', category: 'Bleaching Powder', unit: 'Jar' },
  { id: 'prd-035', sku: 'SCW-SIL-SMP-1000', name: 'Schwarzkopf Goodbye Yellow Neutralizing Wash 1000ml', category: 'Shampoo', unit: 'Botol' },

  // Barber Products
  { id: 'prd-036', sku: 'BRB-SUV-ORG-113', name: 'Suavecito Original Hold Pomade 113g', category: 'Barber Pomade', unit: 'Jar' },
  { id: 'prd-037', sku: 'BRB-SUV-FIR-113', name: 'Suavecito Firme (Strong) Hold Pomade 113g', category: 'Barber Pomade', unit: 'Jar' },
  { id: 'prd-038', sku: 'BRB-UPP-MAT-100', name: 'Uppercut Deluxe Matt Clay 100g', category: 'Barber Pomade', unit: 'Jar' },
  { id: 'prd-039', sku: 'BRB-PRO-SHV-500', name: 'Proraso Shaving Cream Eucalyptus & Menthol 500ml', category: 'Shaving Cream', unit: 'Tube' },
  { id: 'prd-040', sku: 'BRB-PRO-AFT-400', name: 'Proraso After Shave Lotion Refreshing 400ml', category: 'After Shave', unit: 'Botol' },
];

// Generate 32 sample transactions across different dates to test pagination (20 items/page) and date filter
const generateInitialTransactions = (): RongsokTransaction[] => {
  const staff = INITIAL_STAFF.filter((s) => s.salonId === 'seminyak');
  const ambil = INITIAL_AREAS.filter((a) => a.salonId === 'seminyak' && a.type === 'ambil');
  const taruh = INITIAL_AREAS.filter((a) => a.salonId === 'seminyak' && a.type === 'taruh');

  const dates = [
    '2026-11-10', '2026-11-10', '2026-11-09', '2026-11-09', '2026-11-09',
    '2026-11-08', '2026-11-08', '2026-11-07', '2026-11-07', '2026-11-06',
    '2026-11-06', '2026-11-05', '2026-11-05', '2026-11-04', '2026-11-04',
    '2026-11-03', '2026-11-03', '2026-11-02', '2026-11-02', '2026-11-01',
    '2026-11-01', '2026-10-31', '2026-10-30', '2026-10-29', '2026-10-28',
    '2026-10-27', '2026-10-26', '2026-10-25', '2026-10-24', '2026-10-23',
    '2026-10-22', '2026-10-21'
  ];

  return dates.map((date, idx) => {
    const prod = INITIAL_PRODUCTS[idx % INITIAL_PRODUCTS.length];
    const stf = staff[idx % staff.length];
    const src = ambil[idx % ambil.length];
    const trg = taruh[(idx * 2) % taruh.length];
    const qty = (idx % 3) + 1;

    return {
      id: `trx-demo-${100 + idx}`,
      date,
      salonId: 'seminyak',
      staffId: stf.id,
      staffName: stf.name,
      productId: prod.id,
      productName: prod.name,
      productSku: prod.sku,
      productUnit: prod.unit,
      sourceAreaId: src.id,
      sourceAreaName: src.name,
      targetAreaId: trg.id,
      targetAreaName: trg.name,
      qty,
      notes: idx % 4 === 0 ? 'Habis pemakaian reguler treatment' : undefined,
      createdAt: `${date}T${String(9 + (idx % 8)).padStart(2, '0')}:30:00Z`,
    };
  });
};

export const INITIAL_TRANSACTIONS: RongsokTransaction[] = generateInitialTransactions();
