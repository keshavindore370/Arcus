'use client';

import React, { useState } from 'react';
import { History, ShieldAlert, ShieldCheck, AlertTriangle, Search, Database, ArrowUpDown, Filter } from 'lucide-react';
import { ScanResult } from '../lib/types';

interface HistoryTabProps {
  history: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ history, onSelectScan }) => {
  const [filter, setFilter] = useState<'ALL' | 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.classification === filter;
    const matchesSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#101524] border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full w-fit mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>MongoDB Enterprise Audit Collection</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Threat Intelligence Scan Logs</h2>
          <p className="text-xs text-slate-400 mt-1">
            Historical audit logs with full feature vectors and latency telemetry stored for forensic analysis.
          </p>
        </div>

        <div className="text-right font-mono text-xs text-slate-400 shrink-0">
          <div>TOTAL AUDIT RECORDS: <strong className="text-white">{history.length}</strong></div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Persistence: ACTIVE (NoSQL)</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111625] border border-slate-800 p-3.5 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audited URLs..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0b0f1b] border border-slate-700/80 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'MALICIOUS', 'SUSPICIOUS', 'BENIGN'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                filter === type
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-[#0b0f1b] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111625] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                <th className="py-3 px-4 font-semibold">VERDICT</th>
                <th className="py-3 px-4 font-semibold">TARGET URL</th>
                <th className="py-3 px-4 font-semibold text-center">RISK INDEX</th>
                <th className="py-3 px-4 font-semibold text-center">CONFIDENCE</th>
                <th className="py-3 px-4 font-semibold text-right">LATENCY</th>
                <th className="py-3 px-4 font-semibold text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((item) => {
                const isMalicious = item.classification === 'MALICIOUS';
                const isSuspicious = item.classification === 'SUSPICIOUS';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectScan(item)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          isMalicious
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : isSuspicious
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {isMalicious ? (
                          <ShieldAlert className="w-3 h-3 mr-1" />
                        ) : isSuspicious ? (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        ) : (
                          <ShieldCheck className="w-3 h-3 mr-1" />
                        )}
                        {item.classification}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-300 group-hover:text-blue-300 transition-colors">
                      {item.url}
                    </td>

                    <td className="py-3 px-4 text-center font-bold">
                      <span className={isMalicious ? 'text-red-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'}>
                        {Math.round(item.riskScore * 100)}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center text-slate-400">
                      {Math.round(item.confidence * 100)}%
                    </td>

                    <td className="py-3 px-4 text-right text-slate-300">
                      <span className="text-emerald-400 font-semibold">{item.scanDurationMs}</span> ms
                    </td>

                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {new Date(item.scannedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
