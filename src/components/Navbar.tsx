'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Scissors, MapPin, ChevronDown, Building2, LogOut, Lock } from 'lucide-react';

export default function Navbar() {
  const { salons, activeSalon, setActiveSalonId, currentUser, logout, isCloudConnected } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Is user a Super Admin? (Only Super Admin can switch salons)
  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Scissors className="w-4 h-4 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                RongsokSalon
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Audit
              </span>
              {isCloudConnected ? (
                <span
                  className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                  title="Database Cloud Supabase Terhubung (Sinkronisasi Realtime)"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cloud Realtime
                </span>
              ) : (
                <span
                  className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                  title="Supabase belum aktif di Vercel, data tersimpan di memori perangkat ini"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Lokal (Offline)
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Pencatatan Produk Habis & Sinkronisasi Zenoti
            </p>
          </div>
        </div>

        {/* User Info & Salon Branch Indicator */}
        <div className="flex items-center gap-2">
          {/* If Superadmin: Show Dropdown Switcher. If Staff: Show Locked Static Badge */}
          {isSuperAdmin ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 active:scale-95 transition-all text-xs font-bold text-emerald-800 border border-emerald-200"
                aria-label="Ganti Cabang Salon"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="max-w-[120px] sm:max-w-none truncate">{activeSalon.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-emerald-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" />
                      Pilih Cabang (Mode Admin)
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {salons.map((salon) => (
                        <button
                          key={salon.id}
                          onClick={() => {
                            setActiveSalonId(salon.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                            salon.id === activeSalon.id
                              ? 'bg-emerald-50 text-emerald-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{salon.name}</span>
                          {salon.id === activeSalon.id && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Staff Mode: Terkunci (1 Staff = 1 Salon) */
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200/80">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="max-w-[130px] sm:max-w-none truncate">{activeSalon.name}</span>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-semibold uppercase hidden sm:inline">
                Terkunci
              </span>
            </div>
          )}

          {/* User Badge & Logout */}
          {currentUser && (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase">
                  {currentUser.role === 'superadmin' ? 'Owner / Admin' : 'Staff Salon'}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors"
                title="Keluar / Ganti Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
