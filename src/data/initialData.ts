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
  // Salon Seminyak (Katalog Khusus Seminyak)
  { id: 'prd-sem-001', salonId: 'seminyak', sku: 'LOR-EXT-500', name: "L'Oreal Serie Expert Vitamino Color Shampoo 500ml", category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-sem-002', salonId: 'seminyak', sku: 'LOR-EXT-MAS-500', name: "L'Oreal Serie Expert Vitamino Color Mask 500ml", category: 'Hair Mask', unit: 'Jar' },
  { id: 'prd-sem-003', salonId: 'seminyak', sku: 'LOR-ABS-REP-500', name: "L'Oreal Serie Expert Absolut Repair Shampoo 500ml", category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-sem-004', salonId: 'seminyak', sku: 'LOR-MYT-OIL-100', name: "L'Oreal Mythic Oil Original Treatment 100ml", category: 'Serum & Oil', unit: 'Botol' },
  { id: 'prd-sem-005', salonId: 'seminyak', sku: 'LOR-OXI-20V-1000', name: "L'Oreal Oxydant Creme 6% (20 Volume) 1000ml", category: 'Developer', unit: 'Botol' },
  { id: 'prd-sem-006', salonId: 'seminyak', sku: 'OLA-BND-01-525', name: 'Olaplex No. 1 Bond Multiplier 525ml', category: 'Bond Treatment', unit: 'Botol' },
  { id: 'prd-sem-007', salonId: 'seminyak', sku: 'OLA-BND-02-525', name: 'Olaplex No. 2 Bond Perfector 525ml', category: 'Bond Treatment', unit: 'Botol' },
  { id: 'prd-sem-008', salonId: 'seminyak', sku: 'MKR-TEX-SPA-1000', name: 'Makarizo Texture Experience Hair Spa Strawberry 1000g', category: 'Hair Spa Cream', unit: 'Jar' },
  { id: 'prd-sem-009', salonId: 'seminyak', sku: 'BRB-SUV-ORG-113', name: 'Suavecito Original Hold Pomade 113g', category: 'Barber Pomade', unit: 'Jar' },
  { id: 'prd-sem-010', salonId: 'seminyak', sku: 'BRB-PRO-SHV-500', name: 'Proraso Shaving Cream Eucalyptus & Menthol 500ml', category: 'Shaving Cream', unit: 'Tube' },

  // Salon Canggu (Katalog Khusus Canggu - Berbeda dari Seminyak)
  { id: 'prd-cng-001', salonId: 'canggu', sku: 'KRS-BN-CHRO-1000', name: 'Kerastase Bain Chroma Respect Shampoo 1000ml', category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-cng-002', salonId: 'canggu', sku: 'KRS-MSK-CHRO-500', name: 'Kerastase Masque Chroma Filler 500ml', category: 'Hair Mask', unit: 'Jar' },
  { id: 'prd-cng-003', salonId: 'canggu', sku: 'KRS-ELX-ULT-100', name: 'Kerastase Elixir Ultime Hair Oil 100ml', category: 'Serum & Oil', unit: 'Botol' },
  { id: 'prd-cng-004', salonId: 'canggu', sku: 'SCW-OSI-DUST-10', name: 'Schwarzkopf OSiS+ Dust It Mattifying Powder 10g', category: 'Barber Styling', unit: 'Botol' },
  { id: 'prd-cng-005', salonId: 'canggu', sku: 'BRB-UPP-MAT-100', name: 'Uppercut Deluxe Matt Clay 100g', category: 'Barber Pomade', unit: 'Jar' },

  // Salon Ubud (Katalog Khusus Ubud)
  { id: 'prd-ubd-001', salonId: 'ubud', sku: 'MKR-REB-STR-500', name: 'Makarizo Rebonding System Step 1 Straight 500g', category: 'Smoothing & Perm', unit: 'Box' },
  { id: 'prd-ubd-002', salonId: 'ubud', sku: 'MKR-TEX-SPA-MNT-1000', name: 'Makarizo Texture Experience Hair Spa Mint 1000g', category: 'Hair Spa Cream', unit: 'Jar' },
  { id: 'prd-ubd-003', salonId: 'ubud', sku: 'MTX-BIO-SMP-1000', name: 'Matrix Biolage ScalpSync Anti-Dandruff Shampoo 1000ml', category: 'Shampoo', unit: 'Botol' },

  // Salon Sanur (Katalog Khusus Sanur)
  { id: 'prd-snr-001', salonId: 'sanur', sku: 'WEL-KOL-PER-60', name: 'Wella Koleston Perfect Me+ Pure Naturals 60ml', category: 'Hair Color', unit: 'Tube' },
  { id: 'prd-snr-002', salonId: 'sanur', sku: 'WEL-EIMI-SPR-500', name: 'Wella EIMI Super Set Finishing Spray 500ml', category: 'Styling Spray', unit: 'Kaleng' },

  // Salon Kuta (Katalog Khusus Kuta)
  { id: 'prd-kta-001', salonId: 'kuta', sku: 'BRB-SUV-FIR-113', name: 'Suavecito Firme (Strong) Hold Pomade 113g', category: 'Barber Pomade', unit: 'Jar' },
  { id: 'prd-kta-002', salonId: 'kuta', sku: 'BRB-PRO-AFT-400', name: 'Proraso After Shave Lotion Refreshing 400ml', category: 'After Shave', unit: 'Botol' },

  // Salon Jimbaran (Katalog Khusus Jimbaran)
  { id: 'prd-jmb-001', salonId: 'jimbaran', sku: 'MTX-WND-BRN-60', name: 'Matrix Wonder Brown Hair Dye 7.3 60ml', category: 'Hair Color', unit: 'Tube' },
  { id: 'prd-jmb-002', salonId: 'jimbaran', sku: 'MTX-OPT-SMO-400', name: 'Matrix Opti.Straight Cream Step 1 400ml', category: 'Smoothing & Perm', unit: 'Pouch' },

  // Salon Uluwatu (Katalog Khusus Uluwatu)
  { id: 'prd-ulw-001', salonId: 'uluwatu', sku: 'OLA-BND-04-1000', name: 'Olaplex No. 4 Bond Maintenance Shampoo 1000ml', category: 'Shampoo', unit: 'Botol' },
  { id: 'prd-ulw-002', salonId: 'uluwatu', sku: 'OLA-BND-05-1000', name: 'Olaplex No. 5 Bond Maintenance Conditioner 1000ml', category: 'Conditioner', unit: 'Botol' },
];

// Generate 32 sample transactions across different dates to test pagination (20 items/page) and date filter
const generateInitialTransactions = (): RongsokTransaction[] => {
  const staff = INITIAL_STAFF.filter((s) => s.salonId === 'seminyak');
  const ambil = INITIAL_AREAS.filter((a) => a.salonId === 'seminyak' && a.type === 'ambil');
  const taruh = INITIAL_AREAS.filter((a) => a.salonId === 'seminyak' && a.type === 'taruh');
  const seminyakProducts = INITIAL_PRODUCTS.filter((p) => p.salonId === 'seminyak');

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
    const prod = seminyakProducts[idx % seminyakProducts.length];
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
