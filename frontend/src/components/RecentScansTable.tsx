'use client';

import React from 'react';
import { ScanResult } from '../lib/types';

interface RecentScansTableProps {
  scans: ScanResult[];
  onViewReport: (scan: ScanResult) => void;
  onDeleteScan: (id: string) => void;
}

export const RecentScansTable: React.FC<RecentScansTableProps> = ({
  scans,
  onViewReport,
  onDeleteScan,
}) => {
  return (
    <div className="bg-[#121622] border border-[#1e2538] rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
          RECENT SCANS
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          Showing {scans.length} verified operations
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[#1f273d] text-slate-400 text-[11px]">
              <th className="py-2.5 px-3 font-semibold">Scan ID</th>
              <th className="py-2.5 px-3 font-semibold">URL</th>
              <th className="py-2.5 px-3 font-semibold">Date/Time</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3 font-semibold">Risk Level</th>
              <th className="py-2.5 px-3 font-semibold">Threat Type</th>
              <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#182033]">
            {scans.map((scan, index) => {
              const isMalicious = scan.classification === 'MALICIOUS';
              const isSuspicious = scan.classification === 'SUSPICIOUS';
              const isClean = scan.classification === 'BENIGN';

              const displayStatus = isMalicious ? 'MALICIOUS' : isSuspicious ? 'SUSPICIOUS' : 'CLEAN';
              const displayRiskLevel = isMalicious
                ? 'Critical (High)'
                : isSuspicious
                ? 'Moderate'
                : 'Low (Safe)';
              const threatType = isMalicious
                ? 'Phishing'
                : isSuspicious
                ? 'Malware Suspect'
                : 'N/A';

              const scanId = scan.id.startsWith('mock')
                ? `0045${index + 1}`
                : scan.id.slice(0, 5);

              const formattedDate = new Date(scan.scannedAt)
                .toISOString()
                .replace('T', ' ')
                .slice(0, 16);

              return (
                <tr
                  key={scan.id}
                  className={`hover:bg-[#161c2c] transition-colors relative ${
                    isMalicious
                      ? 'bg-red-950/10'
                      : isSuspicious
                      ? 'bg-amber-950/10'
                      : 'bg-emerald-950/10'
                  }`}
                >
                  {/* Colored Left Accent Bar */}
                  <td className="py-3 px-3 relative">
                    <span
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        isMalicious
                          ? 'bg-red-500'
                          : isSuspicious
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                    <span className="text-slate-300 font-semibold">{scanId}</span>
                  </td>

                  {/* URL */}
                  <td className="py-3 px-3 max-w-[200px] sm:max-w-[280px] truncate text-slate-200">
                    {scan.url}
                  </td>

                  {/* Date/Time */}
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                    {formattedDate}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold uppercase text-[11px] ${
                        isMalicious
                          ? 'text-red-400'
                          : isSuspicious
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {displayStatus}
                    </span>
                  </td>

                  {/* Risk Level */}
                  <td className="py-3 px-3 text-slate-300 text-[11px]">
                    {displayRiskLevel}
                  </td>

                  {/* Threat Type */}
                  <td className="py-3 px-3 text-slate-300 text-[11px]">
                    {threatType}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right space-x-2 whitespace-nowrap text-[11px]">
                    <button
                      onClick={() => onViewReport(scan)}
                      className="text-cyan-400 hover:text-cyan-300 underline font-medium hover:brightness-125"
                    >
                      [View Report]
                    </button>
                    <button
                      onClick={() => onDeleteScan(scan.id)}
                      className="text-amber-500 hover:text-red-400 underline font-medium"
                    >
                      [Delete]
                    </button>
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
