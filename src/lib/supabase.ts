/**
 * Supabase Client Adapter & Cloud Database Service untuk RongsokSalon
 * Menggunakan standard fetch REST API (PostgREST) agar berjalan instan di semua
 * browser, HP (Android & iOS), dan Vercel tanpa kendala sertifikat library external.
 */

import { Salon, Area, Staff, Product, RongsokTransaction } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseUrl.startsWith('https://')
);

// Generic REST API Helper untuk Supabase
export async function supabaseQuery<T = any>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const cleanUrl = supabaseUrl.replace(/\/+$/, '');
    const url = `${cleanUrl}/rest/v1/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': (options.headers as any)?.Prefer || (options.method === 'POST' ? 'return=representation' : 'return=minimal'),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Supabase notice [${response.status}] on ${endpoint}:`, errorText);
      return null;
    }

    if (response.status === 204) {
      return true as any;
    }

    return await response.json();
  } catch (err) {
    console.warn(`Supabase network/fetch warning on ${endpoint}:`, err);
    return null;
  }
}

// ================= SALONS CLOUD SYNC =================
export async function fetchSalonsFromCloud(): Promise<Salon[] | null> {
  const rows = await supabaseQuery<any[]>('salons?select=*&is_active=eq.true&order=name.asc');
  if (!rows || !Array.isArray(rows)) return null;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    address: r.address || '',
    phone: r.phone || '',
    isActive: r.is_active ?? true,
  }));
}

export async function upsertSalonToCloud(salon: Salon): Promise<boolean> {
  const res = await supabaseQuery('salons', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({
      id: salon.id,
      name: salon.name,
      address: salon.address || null,
      phone: salon.phone || null,
      is_active: salon.isActive,
    }),
  });
  return Boolean(res);
}

export async function deleteSalonFromCloud(id: string): Promise<boolean> {
  const res = await supabaseQuery(`salons?id=eq.${id}`, { method: 'DELETE' });
  return Boolean(res);
}

// ================= AREAS CLOUD SYNC =================
export async function fetchAreasFromCloud(): Promise<Area[] | null> {
  const rows = await supabaseQuery<any[]>('areas?select=*&order=created_at.asc');
  if (!rows || !Array.isArray(rows)) return null;
  return rows.map((r) => ({
    id: r.id,
    salonId: r.salon_id,
    name: r.name,
    type: r.type,
  }));
}

export async function upsertAreaToCloud(area: Area): Promise<boolean> {
  const res = await supabaseQuery('areas', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({
      id: area.id,
      salon_id: area.salonId,
      name: area.name,
      type: area.type,
    }),
  });
  return Boolean(res);
}

export async function deleteAreaFromCloud(id: string): Promise<boolean> {
  const res = await supabaseQuery(`areas?id=eq.${id}`, { method: 'DELETE' });
  return Boolean(res);
}

// ================= STAFF CLOUD SYNC =================
export async function fetchStaffFromCloud(): Promise<Staff[] | null> {
  const rows = await supabaseQuery<any[]>('staff?select=*&is_active=eq.true&order=created_at.asc');
  if (!rows || !Array.isArray(rows)) return null;
  return rows.map((r) => ({
    id: r.id,
    salonId: r.salon_id,
    name: r.name,
    role: r.role,
    username: r.username || '',
    pin: r.pin || '1234',
    isActive: r.is_active ?? true,
  }));
}

export async function upsertStaffToCloud(staff: Staff): Promise<boolean> {
  const res = await supabaseQuery('staff', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({
      id: staff.id,
      salon_id: staff.salonId,
      name: staff.name,
      role: staff.role,
      username: staff.username || null,
      pin: staff.pin || '1234',
      is_active: staff.isActive,
    }),
  });
  return Boolean(res);
}

export async function deleteStaffFromCloud(id: string): Promise<boolean> {
  const res = await supabaseQuery(`staff?id=eq.${id}`, { method: 'DELETE' });
  return Boolean(res);
}

// ================= PRODUCTS CLOUD SYNC =================
export async function fetchProductsFromCloud(): Promise<Product[] | null> {
  const rows = await supabaseQuery<any[]>('products?select=*&order=name.asc');
  if (!rows || !Array.isArray(rows)) return null;
  return rows.map((r) => ({
    id: r.id,
    salonId: r.salon_id,
    sku: r.sku,
    name: r.name,
    category: r.category,
    unit: r.unit,
  }));
}

export async function upsertProductToCloud(product: Product): Promise<boolean> {
  const res = await supabaseQuery('products', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({
      id: product.id,
      salon_id: product.salonId,
      sku: product.sku,
      name: product.name,
      category: product.category,
      unit: product.unit,
    }),
  });
  return Boolean(res);
}

export async function upsertBulkProductsToCloud(products: Product[]): Promise<boolean> {
  if (!products.length) return true;
  const payload = products.map((p) => ({
    id: p.id,
    salon_id: p.salonId,
    sku: p.sku,
    name: p.name,
    category: p.category,
    unit: p.unit,
  }));

  const res = await supabaseQuery('products', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(payload),
  });
  return Boolean(res);
}

export async function deleteProductFromCloud(id: string): Promise<boolean> {
  const res = await supabaseQuery(`products?id=eq.${id}`, { method: 'DELETE' });
  return Boolean(res);
}

// ================= TRANSACTIONS CLOUD SYNC =================
export async function fetchTransactionsFromCloud(): Promise<RongsokTransaction[] | null> {
  const rows = await supabaseQuery<any[]>('transactions?select=*&order=created_at.desc');
  if (!rows || !Array.isArray(rows)) return null;
  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    salonId: r.salon_id,
    staffId: r.staff_id || '',
    staffName: r.staff_name || '',
    productId: r.product_id || '',
    productName: r.product_name,
    productSku: r.product_sku,
    productUnit: r.product_unit,
    sourceAreaId: r.source_area_id || '',
    sourceAreaName: r.source_area_name,
    targetAreaId: r.target_area_id || '',
    targetAreaName: r.target_area_name || '-',
    qty: r.qty,
    notes: r.notes || undefined,
    createdAt: r.created_at,
  }));
}

export async function insertTransactionToCloud(tx: RongsokTransaction): Promise<boolean> {
  const res = await supabaseQuery('transactions', {
    method: 'POST',
    body: JSON.stringify({
      id: tx.id,
      date: tx.date,
      salon_id: tx.salonId,
      staff_id: tx.staffId || null,
      staff_name: tx.staffName,
      product_id: tx.productId || null,
      product_name: tx.productName,
      product_sku: tx.productSku,
      product_unit: tx.productUnit,
      source_area_id: tx.sourceAreaId || null,
      source_area_name: tx.sourceAreaName,
      target_area_id: tx.targetAreaId || null,
      target_area_name: tx.targetAreaName || '-',
      qty: tx.qty,
      notes: tx.notes || null,
      created_at: tx.createdAt,
    }),
  });
  return Boolean(res);
}

export async function deleteTransactionFromCloud(id: string): Promise<boolean> {
  const res = await supabaseQuery(`transactions?id=eq.${id}`, { method: 'DELETE' });
  return Boolean(res);
}
