'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import InputForm from '@/components/InputForm';
import HistoryList from '@/components/HistoryList';
import ReportView from '@/components/ReportView';
import SettingsView from '@/components/SettingsView';
import LoginView from '@/components/LoginView';
import { PlusCircle, Clock, BarChart3, Settings } from 'lucide-react';

export default function Home() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'input' | 'riwayat' | 'laporan' | 'pengaturan'>('input');

  // If user is not logged in, show the login view
  if (!currentUser) {
    return <LoginView />;
  }

  const navItems = [
    { id: 'input' as const, label: 'Form Input', icon: PlusCircle },
    { id: 'riwayat' as const, label: 'Riwayat Catatan', icon: Clock },
    { id: 'laporan' as const, label: 'Summary Laporan & Excel', icon: BarChart3 },
    { id: 'pengaturan' as const, label: 'Master Data & Area', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <Navbar />

      {/* Desktop Tab Selector (Hidden on Mobile) */}
      <div className="hidden sm:block border-b border-slate-200 bg-white sticky top-[57px] z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 flex space-x-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'input' && <InputForm />}
        {activeTab === 'riwayat' && <HistoryList />}
        {activeTab === 'laporan' && <ReportView />}
        {activeTab === 'pengaturan' && <SettingsView />}
      </main>

      {/* Mobile Bottom Navigation (Visible only on phone screens) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
