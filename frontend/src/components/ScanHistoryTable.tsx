'use client';

import React from 'react';
import { ScanResult } from '../lib/types';

interface ScanHistoryTableProps {
  history: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
}

export const ScanHistoryTable: React.FC<ScanHistoryTableProps> = ({ history, onSelectScan }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-medium">
        <span>Recent Scans</span>
        <span>{history.length} items</span>
      </div>

      <div className="border border-[#1e2335] rounded-xl overflow-hidden bg-[#10131e]">
        <table className="w-full text-left text-xs font-mono">
          <tbody className="divide-y divide-[#1b2030]">
            {history.slice(0, 8).map((item) => {
              const isMalicious = item.classification === 'MALICIOUS';
              const isSuspicious = item.classification === 'SUSPICIOUS';

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectScan(item)}
                  className="hover:bg-[#161b2b] cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3.5 w-24">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        isMalicious
                          ? 'text-red-400 bg-red-500/10'
                          : isSuspicious
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-emerald-400 bg-emerald-500/10'
                      }`}
                    >
                      {item.classification}
                    </span>
                  </td>

                  <td className="py-2.5 px-2 text-slate-300 truncate max-w-[240px] sm:max-w-[320px]">
                    {item.url}
                  </td>

                  <td className="py-2.5 px-3.5 text-right text-slate-400 shrink-0">
                    <span className="text-slate-200 font-semibold">{Math.round(item.riskScore * 100)}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
