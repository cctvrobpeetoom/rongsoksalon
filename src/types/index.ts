export interface Salon {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

export interface Area {
  id: string;
  salonId: string;
  name: string;
  type: 'ambil' | 'taruh'; // 'ambil' = source, 'taruh' = destination
}

export interface Staff {
  id: string;
  salonId: string;
  name: string;
  role: string; // e.g. Stylist, Colorist, Barber, Therapist, Manager
  username?: string;
  pin?: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  sku: string; // Kode unik Zenoti
  name: string;
  category: string;
  unit: string;
}

export interface RongsokTransaction {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  salonId: string;
  staffId: string;
  staffName: string;
  productId: string;
  productName: string;
  productSku: string;
  productUnit: string;
  sourceAreaId: string;
  sourceAreaName: string;
  targetAreaId: string;
  targetAreaName: string;
  qty: number;
  notes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'manager' | 'staff';
  assignedSalonId?: string; // Strictly bound salon for staff
}

export interface FilterOptions {
  startDate: string;
  endDate: string;
  searchQuery: string;
  staffId?: string;
  sourceAreaId?: string;
  targetAreaId?: string;
}
