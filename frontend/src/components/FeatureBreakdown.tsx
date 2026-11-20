'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Terminal } from 'lucide-react';
import { URLFeatures } from '../lib/types';

interface FeatureBreakdownProps {
  features: URLFeatures;
}

export const FeatureBreakdown: React.FC<FeatureBreakdownProps> = ({ features }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!features) return null;

  return (
    <div className="bg-cyber-card/80 border border-cyber-border rounded-xl overflow-hidden mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Layers className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Technical Feature Vector Extraction (Java Spring Boot Module)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              20+ in-memory lexical, statistical, and structural features extracted in sub-millisecond time.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <span>{isOpen ? 'Collapse Vector' : 'Expand Vector'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-700/60 bg-black/40">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 font-mono text-xs mb-4">
            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">URL LENGTH</span>
              <span className="text-white font-bold text-sm">{features.urlLength} chars</span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">SHANNON ENTROPY</span>
              <span className={`font-bold text-sm ${features.urlEntropy > 4.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {features.urlEntropy} bits
              </span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">HOSTNAME ENTROPY</span>
              <span className="text-white font-bold text-sm">{features.hostnameEntropy} bits</span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">SUBDOMAIN DEPTH</span>
              <span className={`font-bold text-sm ${features.numSubdomains >= 3 ? 'text-red-400' : 'text-white'}`}>
                {features.numSubdomains} levels
              </span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">IP AS HOST</span>
              <span className={`font-bold text-sm ${features.hasIpAddress ? 'text-red-400' : 'text-emerald-400'}`}>
                {features.hasIpAddress ? 'TRUE (High Risk)' : 'FALSE'}
              </span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">HTTPS PROTOCOL</span>
              <span className={`font-bold text-sm ${features.hasHttps ? 'text-emerald-400' : 'text-amber-400'}`}>
                {features.hasHttps ? 'TRUE (Encrypted)' : 'FALSE (Cleartext)'}
              </span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">DOT COUNT</span>
              <span className="text-white font-bold text-sm">{features.numDots}</span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">HYPHEN COUNT</span>
              <span className="text-white font-bold text-sm">{features.numHyphens}</span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">AT (@) SYMBOLS</span>
              <span className={`font-bold text-sm ${features.numAtSymbols > 0 ? 'text-red-400' : 'text-white'}`}>
                {features.numAtSymbols}
              </span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">DIGIT RATIO</span>
              <span className="text-white font-bold text-sm">{(features.digitRatio * 100).toFixed(1)}%</span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">HEX CHARS (%)</span>
              <span className={`font-bold text-sm ${features.hasHexChars ? 'text-amber-400' : 'text-white'}`}>
                {features.hasHexChars ? 'TRUE (Obfuscated)' : 'FALSE'}
              </span>
            </div>

            <div className="p-3 bg-[#0d1322] border border-slate-800 rounded-lg">
              <span className="text-slate-500 block text-[10px]">DOUBLE SLASH IN PATH</span>
              <span className={`font-bold text-sm ${features.doubleSlashInPath ? 'text-amber-400' : 'text-white'}`}>
                {features.doubleSlashInPath ? 'TRUE' : 'FALSE'}
              </span>
            </div>
          </div>

          <div className="bg-[#090d16] p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Extracted Payload sent to Python ML microservice via JSON REST inter-service pipeline.</span>
          </div>
        </div>
      )}
    </div>
  );
};
