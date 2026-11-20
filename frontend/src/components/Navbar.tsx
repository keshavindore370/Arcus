'use client';

import React from 'react';
import { ShieldCheck, Cpu, Database, Server, Award, BookOpen, Layers, History, ShieldAlert } from 'lucide-react';

export type ActiveTab = 'scanner' | 'features' | 'architecture' | 'synopsis' | 'history';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  systemStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus }) => {
  const tabs = [
    { id: 'scanner' as ActiveTab, label: 'Threat Scanner', icon: ShieldAlert },
    { id: 'features' as ActiveTab, label: 'Feature Vector (20+)', icon: Layers },
    { id: 'architecture' as ActiveTab, label: 'System Architecture', icon: Server },
    { id: 'synopsis' as ActiveTab, label: 'Project Synopsis & Viva', icon: BookOpen },
    { id: 'history' as ActiveTab, label: 'Audit History', icon: History },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-40">
      {/* University & Academic Header Bar */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-200">MEDICAPS UNIVERSITY, INDORE</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Department of Computer Science & Engineering</span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-400 font-mono">B.Tech (VII Sem) Project-1</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
            <span>System: <strong className="text-slate-200">Production Mode</strong></span>
            <span className="text-slate-600">|</span>
            <span>Architecture: <strong className="text-slate-200">Decoupled Microservices</strong></span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">A.R.C.U.S.</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">
                  Production Grade
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Automated Risk & Cyber URL Scanner • Microservices AI Architecture
              </p>
            </div>
          </div>

          {/* Microservice Health Indicators */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <span className="flex items-center text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              Next.js UI (3000)
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center text-blue-400">
              <Server className="w-3 h-3 mr-1" /> Spring Boot (8080)
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center text-indigo-400">
              <Cpu className="w-3 h-3 mr-1" /> FastAPI ML (8000)
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center text-amber-400">
              <Database className="w-3 h-3 mr-1" /> MongoDB
            </span>
          </div>

          {/* SLA Badge */}
          <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 px-2.5 py-1 rounded-md text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>&lt; 50ms SLA Active</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto border-t border-slate-800/60 py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
