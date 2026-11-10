'use client';

import React from 'react';
import { PlusCircle, Clock, BarChart3, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'input' | 'riwayat' | 'laporan' | 'pengaturan';
  setActiveTab: (tab: 'input' | 'riwayat' | 'laporan' | 'pengaturan') => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'input' as const, label: 'Input', icon: PlusCircle },
    { id: 'riwayat' as const, label: 'Riwayat', icon: Clock },
    { id: 'laporan' as const, label: 'Laporan', icon: BarChart3 },
    { id: 'pengaturan' as const, label: 'Pengaturan', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:hidden">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-emerald-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
