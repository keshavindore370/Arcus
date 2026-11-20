'use client';

import React from 'react';
import { Shield, Bell, Settings, HelpCircle, User, Minus, Square, X } from 'lucide-react';

interface AppTitleBarProps {
  studentName?: string;
  rollNo?: string;
}

export const AppTitleBar: React.FC<AppTitleBarProps> = ({
  studentName = 'Keshav Sharma',
  rollNo = '0827CS231000'
}) => {
  return (
    <div className="h-10 bg-[#0c0f17] border-b border-[#1b2130] flex items-center justify-between px-3 select-none text-xs text-slate-300">
      {/* Left: App Title */}
      <div className="flex items-center space-x-2.5">
        <div className="w-5 h-5 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Shield className="w-3.5 h-3.5" />
        </div>
        <span className="font-mono text-[11px] text-slate-400">CyScan V1.2</span>
        <span className="text-slate-600">|</span>
        <span className="font-bold text-slate-200 tracking-wide text-[11px] uppercase">
          CYBER URL SCANNER <span className="text-slate-500 font-normal">| UNIVERSITY PROJECT</span>
        </span>
      </div>

      {/* Right: User Profile & Window Controls */}
      <div className="flex items-center space-x-4">
        {/* User Pill */}
        <div className="flex items-center space-x-2 bg-[#141926] hover:bg-[#1a2133] border border-[#232b3f] px-2.5 py-1 rounded-full text-[11px] cursor-pointer transition-colors">
          <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <User className="w-3 h-3" />
          </div>
          <span className="font-medium text-slate-200">{studentName}</span>
          <span className="text-slate-500 font-mono">({rollNo})</span>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2 text-slate-400">
          <button className="p-1 hover:text-slate-200 hover:bg-[#1a2133] rounded transition-colors" title="Settings">
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-slate-200 hover:bg-[#1a2133] rounded transition-colors" title="Notifications">
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-slate-200 hover:bg-[#1a2133] rounded transition-colors" title="Help">
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Window Controls */}
        <div className="flex items-center space-x-1 pl-2 border-l border-[#1b2130] text-slate-500">
          <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-800 hover:text-slate-200 rounded">
            <Minus className="w-3 h-3" />
          </button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-800 hover:text-slate-200 rounded">
            <Square className="w-2.5 h-2.5" />
          </button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-red-600 hover:text-white rounded">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
