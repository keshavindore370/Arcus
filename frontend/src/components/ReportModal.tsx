'use client';

import React from 'react';
import { X, ShieldAlert, ShieldCheck, AlertTriangle, Clock, Cpu, CheckCircle2, XCircle, FileText, Download } from 'lucide-react';
import { ScanResult } from '../lib/types';

interface ReportModalProps {
  scan: ScanResult | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ scan, onClose }) => {
  if (!scan) return null;

  const isMalicious = scan.classification === 'MALICIOUS';
  const isSuspicious = scan.classification === 'SUSPICIOUS';
  const riskPercent = Math.round(scan.riskScore * 100);
  const javaExtractionMs = (scan.extractionTimeNs / 1_000_000).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#121622] border border-[#232b3f] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-[#1f273d]">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Cyber Threat Intelligence Report
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Scan ID: {scan.id.slice(0, 8)} • Generated: {new Date(scan.scannedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Verdict Banner */}
        <div
          className={`p-4 rounded-xl border mb-5 flex items-center justify-between ${
            isMalicious
              ? 'bg-red-950/30 border-red-500/40'
              : isSuspicious
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-emerald-950/30 border-emerald-500/40'
          }`}
        >
          <div className="flex items-center space-x-3">
            {isMalicious ? (
              <ShieldAlert className="w-6 h-6 text-red-400" />
            ) : isSuspicious ? (
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            )}
            <div>
              <div
                className={`text-sm font-bold uppercase ${
                  isMalicious ? 'text-red-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {isMalicious ? 'MALICIOUS THREAT DETECTED' : isSuspicious ? 'SUSPICIOUS LINK WARNING' : 'VERIFIED CLEAN DESTINATION'}
              </div>
              <div className="text-xs text-slate-300 font-mono break-all mt-0.5">
                {scan.url}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Risk Index</div>
            <div
              className={`text-2xl font-bold ${
                isMalicious ? 'text-red-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {riskPercent}%
            </div>
          </div>
        </div>

        {/* Telemetry Row */}
        <div className="grid grid-cols-3 gap-3 font-mono text-xs mb-5">
          <div className="bg-[#0b0e16] border border-[#1d2538] p-3 rounded-lg">
            <span className="text-slate-500 text-[10px] block">CONFIDENCE</span>
            <span className="text-white font-bold">{Math.round(scan.confidence * 100)}%</span>
          </div>
          <div className="bg-[#0b0e16] border border-[#1d2538] p-3 rounded-lg">
            <span className="text-slate-500 text-[10px] block">TOTAL LATENCY</span>
            <span className="text-blue-400 font-bold">{scan.scanDurationMs} ms</span>
          </div>
          <div className="bg-[#0b0e16] border border-[#1d2538] p-3 rounded-lg">
            <span className="text-slate-500 text-[10px] block">JAVA EXTRACTION</span>
            <span className="text-emerald-400 font-bold">{javaExtractionMs} ms</span>
          </div>
        </div>

        {/* Detection Indicators */}
        <div className="mb-5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
            Identified Threat Signals:
          </h4>
          <div className="space-y-1.5">
            {scan.triggeredFlags.map((flag, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 text-xs font-mono p-2 rounded-lg bg-[#0c101a] border border-[#1e2538] text-slate-200"
              >
                {isMalicious ? (
                  <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                ) : isSuspicious ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Snapshot */}
        {scan.features && (
          <div className="mb-6">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
              Extracted Feature Snapshot (Spring Boot Module):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="bg-[#090c14] p-2 rounded border border-[#1c2336]">
                <span className="text-slate-500 text-[10px] block">Entropy</span>
                <span className="text-white font-semibold">{scan.features.urlEntropy} bits</span>
              </div>
              <div className="bg-[#090c14] p-2 rounded border border-[#1c2336]">
                <span className="text-slate-500 text-[10px] block">Length</span>
                <span className="text-white font-semibold">{scan.features.urlLength} chars</span>
              </div>
              <div className="bg-[#090c14] p-2 rounded border border-[#1c2336]">
                <span className="text-slate-500 text-[10px] block">Subdomains</span>
                <span className="text-white font-semibold">{scan.features.numSubdomains}</span>
              </div>
              <div className="bg-[#090c14] p-2 rounded border border-[#1c2336]">
                <span className="text-slate-500 text-[10px] block">IP Host</span>
                <span className="text-white font-semibold">{scan.features.hasIpAddress ? 'YES' : 'NO'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-[#1f273d]">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
