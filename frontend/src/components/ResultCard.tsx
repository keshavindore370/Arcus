'use client';

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { ScanResult } from '../lib/types';

interface ResultCardProps {
  result: ScanResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [showFeatures, setShowFeatures] = useState(false);

  const isMalicious = result.classification === 'MALICIOUS';
  const isSuspicious = result.classification === 'SUSPICIOUS';
  const riskPercent = Math.round(result.riskScore * 100);

  return (
    <div className="max-w-2xl mx-auto mb-10 bg-[#10131e] border border-[#1e2335] rounded-xl p-5 shadow-lg">
      {/* Top Verdict Row */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1b2030]">
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${
              isMalicious
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : isSuspicious
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {isMalicious ? (
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
            ) : isSuspicious ? (
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            )}
            {result.classification}
          </span>

          <p className="font-mono text-xs text-slate-300 mt-2.5 break-all">
            {result.url}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[11px] text-slate-500 uppercase font-medium">Risk Score</div>
          <div
            className={`text-2xl font-bold font-mono ${
              isMalicious ? 'text-red-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {riskPercent}%
          </div>
          <div className="flex items-center justify-end space-x-1 text-[11px] text-slate-500 mt-0.5">
            <Clock className="w-3 h-3" />
            <span>{result.scanDurationMs}ms</span>
          </div>
        </div>
      </div>

      {/* Triggered Reasons */}
      <div className="pt-4">
        <div className="text-xs font-semibold text-slate-400 mb-2">Detection Signals:</div>
        <ul className="space-y-1.5">
          {result.triggeredFlags.map((flag, idx) => (
            <li key={idx} className="flex items-start text-xs text-slate-300 space-x-2">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isMalicious ? 'bg-red-400' : isSuspicious ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span>{flag}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Collapsible Technical Details */}
      {result.features && (
        <div className="mt-4 pt-3 border-t border-[#1b2030]">
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>Technical Feature Details</span>
            {showFeatures ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFeatures && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 mt-3 pt-3 border-t border-[#1b2030]/60">
              <div className="bg-[#090b12] p-2 rounded border border-[#1b2030]">
                <span className="block text-slate-500 text-[10px]">URL Length</span>
                <span className="text-slate-200 font-semibold">{result.features.urlLength}</span>
              </div>
              <div className="bg-[#090b12] p-2 rounded border border-[#1b2030]">
                <span className="block text-slate-500 text-[10px]">Entropy</span>
                <span className="text-slate-200 font-semibold">{result.features.urlEntropy}</span>
              </div>
              <div className="bg-[#090b12] p-2 rounded border border-[#1b2030]">
                <span className="block text-slate-500 text-[10px]">Subdomains</span>
                <span className="text-slate-200 font-semibold">{result.features.numSubdomains}</span>
              </div>
              <div className="bg-[#090b12] p-2 rounded border border-[#1b2030]">
                <span className="block text-slate-500 text-[10px]">IP Host</span>
                <span className="text-slate-200 font-semibold">{result.features.hasIpAddress ? 'Yes' : 'No'}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
