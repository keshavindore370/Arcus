'use client';

import React from 'react';
import { Shield, Link2, Clock, FileText, Settings, Info } from 'lucide-react';

export type SidebarTab = 'dashboard' | 'analysis' | 'history' | 'reports' | 'settings' | 'about';

interface AppSidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard' as SidebarTab, label: 'Dashboard', sublabel: 'Active', icon: Shield },
    { id: 'analysis' as SidebarTab, label: 'URL Analysis', icon: Link2 },
    { id: 'history' as SidebarTab, label: 'History', icon: Clock },
    { id: 'reports' as SidebarTab, label: 'Reports', icon: FileText },
    { id: 'settings' as SidebarTab, label: 'Settings', icon: Settings },
    { id: 'about' as SidebarTab, label: 'About', icon: Info },
  ];

  return (
    <aside className="w-52 bg-[#0d1017] border-r border-[#1b2130] p-3 flex flex-col justify-between shrink-0 select-none">
      <div className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                isActive
                  ? 'bg-[#1b64e5] text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141824]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="flex flex-col leading-tight">
                <span>{item.label}</span>
                {item.sublabel && isActive && (
                  <span className="text-[10px] text-blue-200 font-normal">{item.sublabel}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Service Indicator */}
      <div className="bg-[#121622] border border-[#1d2436] rounded-xl p-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Engine Online</span>
        </div>
        <div className="text-[10px] text-slate-500">FastAPI & Spring Boot</div>
      </div>
    </aside>
  );
};
