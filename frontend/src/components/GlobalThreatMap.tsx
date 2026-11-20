'use client';

import React from 'react';
import { Globe } from 'lucide-react';

export const GlobalThreatMap: React.FC = () => {
  return (
    <div className="bg-[#121622] border border-[#1e2538] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-bold text-slate-200 tracking-wide uppercase text-[11px] flex items-center space-x-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>GLOBAL THREAT MAP</span>
        </span>
        <span className="flex items-center space-x-1 text-[10px] text-red-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
          <span>LIVE</span>
        </span>
      </div>

      {/* Styled World Map Canvas */}
      <div className="relative w-full h-32 bg-[#090c13] rounded-lg border border-[#181f2f] overflow-hidden flex items-center justify-center">
        {/* World Map SVG Silhouette */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-cover opacity-25"
          fill="#334155"
        >
          {/* North America */}
          <path d="M150,120 Q180,80 250,90 Q300,100 280,180 Q240,240 200,220 Q160,200 150,120 Z" />
          <path d="M100,80 Q130,50 180,60 Q170,100 120,110 Z" />
          {/* South America */}
          <path d="M280,260 Q340,270 330,360 Q300,440 270,420 Q240,340 280,260 Z" />
          {/* Europe */}
          <path d="M480,100 Q560,90 550,160 Q500,180 470,150 Z" />
          {/* Africa */}
          <path d="M480,200 Q570,190 560,320 Q510,380 480,300 Z" />
          {/* Asia */}
          <path d="M580,90 Q750,80 820,170 Q780,260 660,240 Q600,180 580,90 Z" />
          {/* Australia */}
          <path d="M780,320 Q860,310 850,390 Q790,410 770,360 Z" />
        </svg>

        {/* Pulsing Threat Nodes */}
        {/* North America Threat */}
        <div className="absolute top-[32%] left-[24%] flex items-center justify-center">
          <span className="absolute w-4 h-4 rounded-full bg-red-500/40 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
        </div>

        {/* Europe Threat */}
        <div className="absolute top-[28%] left-[51%] flex items-center justify-center">
          <span className="absolute w-5 h-5 rounded-full bg-red-500/30 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
        </div>

        {/* East Asia Threat */}
        <div className="absolute top-[36%] left-[74%] flex items-center justify-center">
          <span className="absolute w-4 h-4 rounded-full bg-amber-500/40 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        </div>

        {/* South America Threat */}
        <div className="absolute top-[68%] left-[30%] flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
        </div>

        {/* Southern Asia Threat */}
        <div className="absolute top-[45%] left-[64%] flex items-center justify-center">
          <span className="absolute w-4 h-4 rounded-full bg-red-500/40 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
          <span>Malicious Phishing Node</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
          <span>Suspicious</span>
        </span>
      </div>
    </div>
  );
};
