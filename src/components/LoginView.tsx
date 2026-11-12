'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Scissors, Lock, User, Building2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginView() {
  const { salons, login } = useApp();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [selectedSalonId, setSelectedSalonId] = useState(salons[0]?.id || 'seminyak');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = login(username, pin, selectedSalonId);
    if (!result.success) {
      setErrorMsg(result.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100">
      <div className="w-full max-w-md">
        {/* Logo & Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 mb-3">
            <Scissors className="w-7 h-7 rotate-45" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            RongsokSalon
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pencatatan Produk Habis & Audit Inventaris Zenoti
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8">
          <div className="mb-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
              <ShieldCheck className="w-4 h-4" />
              Autentikasi Terproteksi
            </div>
            <h2 className="text-base font-bold text-slate-800">
              Masuk Staf Salon
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap staf terkunci khusus pada 1 cabang salon
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Salon Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  Cabang Salon Tempat Anda Bekerja
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (1 Staf = 1 Salon)
                </span>
              </label>
              <select
                value={selectedSalonId}
                onChange={(e) => setSelectedSalonId(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
                required
              >
                {salons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Username / Nama Petugas
              </label>
              <input
                type="text"
                placeholder="Masukkan username atau nama"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
                required
              />
            </div>

            {/* PIN / Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                PIN / Password
              </label>
              <input
                type="password"
                placeholder="Masukkan PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Masuk ke RongsokSalon</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          RongsokSalon Multi-Tenant © 2026 • 7 Cabang Salon
        </p>
      </div>
    </div>
  );
}
