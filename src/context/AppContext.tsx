'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Salon, Area, Staff, Product, RongsokTransaction, User } from '@/types';
import {
  INITIAL_USERS,
  INITIAL_SALONS,
  INITIAL_AREAS,
  INITIAL_STAFF,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
} from '@/data/initialData';

interface AppContextType {
  currentUser: User | null;
  login: (username: string, pin: string, salonId: string) => { success: boolean; message?: string };
  logout: () => void;
  salons: Salon[];
  activeSalon: Salon;
  setActiveSalonId: (id: string) => void;
  addSalon: (name: string, address?: string, phone?: string) => void;
  updateSalon: (id: string, data: Partial<Omit<Salon, 'id'>>) => void;
  deleteSalon: (id: string) => void;
  verifySuperAdminPassword: (password: string) => boolean;

  areas: Area[];
  currentSalonAreas: Area[];
  addArea: (name: string, type: 'ambil' | 'taruh') => void;
  updateArea: (id: string, name: string, type: 'ambil' | 'taruh') => void;
  deleteArea: (id: string) => void;

  staffList: Staff[];
  currentSalonStaff: Staff[];
  addStaff: (name: string, role: string, username?: string, pin?: string) => void;
  updateStaff: (id: string, data: Partial<Omit<Staff, 'id' | 'salonId'>>) => void;
  deleteStaff: (id: string) => void;

  products: Product[];
  currentSalonProducts: Product[];
  addProduct: (product: Omit<Product, 'id' | 'salonId'>) => void;
  updateProduct: (id: string, data: Partial<Omit<Product, 'id' | 'salonId'>>) => void;
  deleteProduct: (id: string) => void;
  importProducts: (products: Omit<Product, 'id' | 'salonId'>[]) => { addedCount: number; updatedCount: number };

  transactions: RongsokTransaction[];
  currentSalonTransactions: RongsokTransaction[];
  addTransaction: (data: Omit<RongsokTransaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [salons, setSalons] = useState<Salon[]>(INITIAL_SALONS);
  const [activeSalonId, setActiveSalonIdState] = useState<string>('seminyak');
  const [areas, setAreas] = useState<Area[]>(INITIAL_AREAS);
  const [staffList, setStaffList] = useState<Staff[]>(INITIAL_STAFF);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<RongsokTransaction[]>(INITIAL_TRANSACTIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('rongsok_user');
      if (savedUser) {
        const parsedUser: User = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        if (parsedUser.role === 'staff' && parsedUser.assignedSalonId) {
          setActiveSalonIdState(parsedUser.assignedSalonId);
        }
      }

      const savedSalons = localStorage.getItem('rongsok_salons');
      if (savedSalons) setSalons(JSON.parse(savedSalons));

      const savedSalonId = localStorage.getItem('rongsok_active_salon');
      if (savedSalonId) setActiveSalonIdState(savedSalonId);

      const savedAreasV2 = localStorage.getItem('rongsok_areas_v2');
      const legacyAreas = localStorage.getItem('rongsok_areas');
      if (savedAreasV2) {
        setAreas((JSON.parse(savedAreasV2) as Area[]).filter((a) => a.type === 'ambil'));
      } else if (legacyAreas) {
        setAreas((JSON.parse(legacyAreas) as Area[]).filter((a) => a.type === 'ambil'));
        localStorage.removeItem('rongsok_areas');
      }

      localStorage.removeItem('rongsok_staff');
      const savedStaff = localStorage.getItem('rongsok_staff_v2');
      if (savedStaff) setStaffList(JSON.parse(savedStaff));

      const savedProducts = localStorage.getItem('rongsok_products_v2');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedTrx = localStorage.getItem('rongsok_transactions');
      if (savedTrx) setTransactions(JSON.parse(savedTrx));
    } catch (e) {
      console.error('Failed to load from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (currentUser) {
        localStorage.setItem('rongsok_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('rongsok_user');
      }
      localStorage.setItem('rongsok_salons', JSON.stringify(salons));
      localStorage.setItem('rongsok_active_salon', activeSalonId);
      localStorage.setItem('rongsok_areas_v2', JSON.stringify(areas));
      localStorage.setItem('rongsok_staff_v2', JSON.stringify(staffList));
      localStorage.setItem('rongsok_products_v2', JSON.stringify(products));
      localStorage.setItem('rongsok_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
  }, [currentUser, salons, activeSalonId, areas, staffList, products, transactions, isLoaded]);

  // Auth: Login function with STRICT SALON LOCK for Staff
  const login = (username: string, pin: string, salonId: string) => {
    const trimmedUser = username.trim().toLowerCase();

    // Check INITIAL_USERS (Superadmin & Demo)
    const foundUser = INITIAL_USERS.find(
      (u) => u.username.toLowerCase() === trimmedUser && u.pin === pin
    );

    // Also check dynamically created staff in staffList
    const foundStaff = staffList.find((s) => {
      const matchUser = (s.username && s.username.toLowerCase() === trimmedUser) ||
                        s.name.toLowerCase() === trimmedUser;
      const matchPin = s.pin ? s.pin === pin : (pin === '1234' || pin === '123');
      return matchUser && matchPin;
    });

    if (!foundUser && !foundStaff) {
      return { success: false, message: 'Username atau PIN salah. Silakan periksa kembali.' };
    }

    // Prioritize Super Admin accounts so they can always access all salons
    if (foundUser && foundUser.role === 'superadmin') {
      const targetSalonId = salonId || salons[0]?.id || 'seminyak';
      const authUser: User = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role,
        assignedSalonId: targetSalonId,
      };

      setCurrentUser(authUser);
      setActiveSalonIdState(targetSalonId);
      return { success: true };
    }

    // Determine target user data
    if (foundStaff) {
      if (foundStaff.salonId !== salonId) {
        const correctSalon = salons.find((s) => s.id === foundStaff.salonId);
        return {
          success: false,
          message: `Akses ditolak: Staf ${foundStaff.name} hanya terdaftar di ${correctSalon?.name || 'cabangnya sendiri'}. Anda tidak bisa login ke cabang lain.`,
        };
      }

      const staffUser: User = {
        id: foundStaff.id,
        username: foundStaff.username || foundStaff.name.toLowerCase().replace(/\s+/g, ''),
        name: foundStaff.name,
        role: 'staff',
        assignedSalonId: foundStaff.salonId,
      };
      setCurrentUser(staffUser);
      setActiveSalonIdState(foundStaff.salonId);
      return { success: true };
    }

    if (foundUser) {
      if (foundUser.role === 'staff' && foundUser.assignedSalonId) {
        if (salonId && salonId !== foundUser.assignedSalonId) {
          const correctSalon = salons.find((s) => s.id === foundUser.assignedSalonId);
          return {
            success: false,
            message: `Akses ditolak: Akun ${foundUser.name} hanya terdaftar di ${correctSalon?.name || 'cabangnya sendiri'}. Anda tidak bisa login ke cabang lain.`,
          };
        }
      }

      const targetSalonId = foundUser.role === 'staff' && foundUser.assignedSalonId
        ? foundUser.assignedSalonId
        : (salonId || 'seminyak');

      const authUser: User = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role,
        assignedSalonId: targetSalonId,
      };

      setCurrentUser(authUser);
      setActiveSalonIdState(targetSalonId);
      return { success: true };
    }

    return { success: false, message: 'Login gagal' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rongsok_user');
  };

  const setActiveSalonId = (id: string) => {
    if (currentUser?.role === 'staff') {
      console.warn('Staff is locked to assigned salon');
      return;
    }
    setActiveSalonIdState(id);
  };

  const activeSalon = salons.find((s) => s.id === activeSalonId) || salons[0] || {
    id: 'default',
    name: 'Salon Default',
    isActive: true,
  };

  // Salon CRUD
  const addSalon = (name: string, address?: string, phone?: string) => {
    const newSalon: Salon = {
      id: `salon-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      address,
      phone,
      isActive: true,
    };
    setSalons((prev) => [...prev, newSalon]);
  };

  const updateSalon = (id: string, data: Partial<Omit<Salon, 'id'>>) => {
    setSalons((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSalon = (id: string) => {
    if (salons.length <= 1) {
      alert('Tidak dapat menghapus cabang terakhir!');
      return;
    }
    setSalons((prev) => prev.filter((s) => s.id !== id));
    setAreas((prev) => prev.filter((a) => a.salonId !== id));
    setStaffList((prev) => prev.filter((s) => s.salonId !== id));
    setProducts((prev) => prev.filter((p) => p.salonId !== id));
    setTransactions((prev) => prev.filter((t) => t.salonId !== id));

    if (activeSalonId === id) {
      const remaining = salons.filter((s) => s.id !== id);
      if (remaining.length > 0) setActiveSalonIdState(remaining[0].id);
    }
  };

  const verifySuperAdminPassword = (password: string): boolean => {
    const trimmed = password.trim();
    if (!trimmed) return false;
    return INITIAL_USERS.some((u) => u.role === 'superadmin' && u.pin === trimmed);
  };

  // Filtered lists per current salon (Strict database isolation per salon)
  const currentSalonAreas = areas.filter((a) => a.salonId === activeSalonId && a.type === 'ambil');
  const currentSalonStaff = staffList.filter((s) => s.salonId === activeSalonId && s.isActive);
  const currentSalonProducts = products.filter((p) => p.salonId === activeSalonId);
  const currentSalonTransactions = transactions.filter((t) => t.salonId === activeSalonId);

  // Area CRUD
  const addArea = (name: string, type: 'ambil' | 'taruh') => {
    const newArea: Area = {
      id: `area-${Date.now()}`,
      salonId: activeSalonId,
      name,
      type,
    };
    setAreas((prev) => [...prev, newArea]);
  };

  const updateArea = (id: string, name: string, type: 'ambil' | 'taruh') => {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, name, type } : a)));
  };

  const deleteArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  // Staff CRUD
  const addStaff = (name: string, role: string, username?: string, pin?: string) => {
    const newStaff: Staff = {
      id: `stf-${Date.now()}`,
      salonId: activeSalonId,
      name,
      role: role || 'Staff',
      username: username?.trim().toLowerCase() || name.toLowerCase().replace(/\s+/g, ''),
      pin: pin?.trim() || '1234',
      isActive: true,
    };
    setStaffList((prev) => [...prev, newStaff]);
  };

  const updateStaff = (id: string, data: Partial<Omit<Staff, 'id' | 'salonId'>>) => {
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  // Product CRUD & Bulk Import (Strict salonId isolation & SKU deduplication per salon)
  const addProduct = (productData: Omit<Product, 'id' | 'salonId'>) => {
    const cleanSku = productData.sku.trim().toUpperCase();
    const existingIndex = products.findIndex(
      (p) => p.salonId === activeSalonId && p.sku.toUpperCase() === cleanSku
    );

    if (existingIndex >= 0) {
      // Update existing inside the same salon
      setProducts((prev) =>
        prev.map((p, idx) =>
          idx === existingIndex ? { ...p, ...productData, sku: cleanSku, salonId: activeSalonId } : p
        )
      );
    } else {
      const newProduct: Product = {
        ...productData,
        salonId: activeSalonId,
        sku: cleanSku,
        id: `prd-${activeSalonId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  const updateProduct = (id: string, data: Partial<Omit<Product, 'id' | 'salonId'>>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, sku: data.sku ? data.sku.toUpperCase() : p.sku } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const importProducts = (newProducts: Omit<Product, 'id' | 'salonId'>[]) => {
    let addedCount = 0;
    let updatedCount = 0;

    setProducts((prev) => {
      const map = new Map<string, Product>();
      prev.forEach((p) => map.set(`${p.salonId}::${p.sku.toUpperCase()}`, p));

      newProducts.forEach((np, idx) => {
        const cleanSku = np.sku.trim().toUpperCase();
        if (!cleanSku || !np.name) return;

        const key = `${activeSalonId}::${cleanSku}`;
        if (map.has(key)) {
          const existing = map.get(key)!;
          map.set(key, {
            ...existing,
            name: np.name.trim(),
            category: np.category.trim() || existing.category,
            unit: np.unit.trim() || existing.unit,
          });
          updatedCount++;
        } else {
          map.set(key, {
            id: `prd-${activeSalonId}-imp-${Date.now()}-${idx}`,
            salonId: activeSalonId,
            sku: cleanSku,
            name: np.name.trim(),
            category: np.category.trim() || 'General',
            unit: np.unit.trim() || 'Pcs',
          });
          addedCount++;
        }
      });

      return Array.from(map.values());
    });

    return { addedCount, updatedCount };
  };

  // Transaction CRUD
  const addTransaction = (data: Omit<RongsokTransaction, 'id' | 'createdAt'>) => {
    const newTrx: RongsokTransaction = {
      ...data,
      id: `trx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTrx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        salons,
        activeSalon,
        setActiveSalonId,
        addSalon,
        updateSalon,
        deleteSalon,
        verifySuperAdminPassword,
        areas,
        currentSalonAreas,
        addArea,
        updateArea,
        deleteArea,
        staffList,
        currentSalonStaff,
        addStaff,
        updateStaff,
        deleteStaff,
        products,
        currentSalonProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        importProducts,
        transactions,
        currentSalonTransactions,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
