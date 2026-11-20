'use client';

import React from 'react';
import { ShieldCheck, AlertOctagon, AlertTriangle, Zap, Activity } from 'lucide-react';
import { SystemStats } from '../lib/types';

interface StatsCardsProps {
  stats: SystemStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-8">
      {/* Total Scans */}
      <div className="bg-cyber-card/70 border border-cyber-border rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
          <span>TOTAL SCANS</span>
          <Activity className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
        </div>
        <div className="text-2xl font-black font-mono text-white tracking-wider">
          {stats.totalScans.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-500 font-mono mt-1">Global audit count</div>
      </div>

      {/* Malicious */}
      <div className="bg-cyber-card/70 border border-red-500/20 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-red-500/50 transition-all">
        <div className="flex items-center justify-between text-red-400 text-xs font-mono mb-1">
          <span>MALICIOUS</span>
          <AlertOctagon className="w-4 h-4 text-red-400" />
        </div>
        <div className="text-2xl font-black font-mono text-red-400 tracking-wider">
          {stats.malicious.toLocaleString()}
        </div>
        <div className="text-[11px] text-red-500/80 font-mono mt-1">Zero-day threats blocked</div>
      </div>

      {/* Suspicious */}
      <div className="bg-cyber-card/70 border border-amber-500/20 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-amber-500/50 transition-all">
        <div className="flex items-center justify-between text-amber-400 text-xs font-mono mb-1">
          <span>SUSPICIOUS</span>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-black font-mono text-amber-400 tracking-wider">
          {stats.suspicious.toLocaleString()}
        </div>
        <div className="text-[11px] text-amber-500/80 font-mono mt-1">Elevated risk markers</div>
      </div>

      {/* Benign */}
      <div className="bg-cyber-card/70 border border-emerald-500/20 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between text-emerald-400 text-xs font-mono mb-1">
          <span>BENIGN</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-black font-mono text-emerald-400 tracking-wider">
          {stats.benign.toLocaleString()}
        </div>
        <div className="text-[11px] text-emerald-500/80 font-mono mt-1">Clean web destinations</div>
      </div>

      {/* Latency */}
      <div className="col-span-2 md:col-span-1 bg-cyber-card/70 border border-cyan-500/20 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between text-cyan-400 text-xs font-mono mb-1">
          <span>AVG LATENCY</span>
          <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
        </div>
        <div className="text-2xl font-black font-mono text-cyan-300 tracking-wider flex items-baseline space-x-1">
          <span>{stats.avgLatencyMs.toFixed(1)}</span>
          <span className="text-xs text-slate-400 font-normal">ms</span>
        </div>
        <div className="text-[11px] text-cyan-400/80 font-mono mt-1">Target: &lt; 50ms verified</div>
      </div>
    </div>
  );
};
