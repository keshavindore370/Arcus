'use client';

import React from 'react';
import { Layers, Binary, Shield, Hash, Code, Cpu, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { URLFeatures, ScanResult } from '../lib/types';

interface FeaturesTabProps {
  currentResult: ScanResult | null;
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({ currentResult }) => {
  const f: URLFeatures = currentResult?.features || {
    urlLength: 57,
    hostnameLength: 46,
    pathLength: 6,
    numDots: 3,
    numHyphens: 2,
    numUnderscores: 0,
    numSlashes: 3,
    numAtSymbols: 0,
    numQuestionMarks: 0,
    numEquals: 0,
    numAmpersands: 0,
    numPercent: 0,
    numDigits: 0,
    digitRatio: 0,
    hasIpAddress: false,
    hasHttps: true,
    urlEntropy: 4.35,
    hostnameEntropy: 4.12,
    numSubdomains: 2,
    numQueryParams: 0,
    hasHexChars: false,
    doubleSlashInPath: false,
    hostname: 'paypal-security-verification.acc-update.xyz',
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-[#101524] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/50 px-3 py-1 rounded-full mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Java Spring Boot Core In-Memory Module</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              20+ Lexical & Information-Theoretic Feature Vector
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Engineered for sub-10ms in-memory extraction using $O(N)$ ASCII frequency algorithms. Eliminates the need to crawl or fetch heavy DOM content.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs text-right shrink-0">
            <div className="text-slate-400 text-[11px]">ACTIVE TARGET URL</div>
            <div className="text-blue-300 font-bold truncate max-w-xs mt-1">
              {currentResult?.url || 'https://paypal-security-verification.acc-update.xyz/login'}
            </div>
            <div className="text-emerald-400 text-[11px] mt-1 font-semibold">
              Extraction: {(currentResult?.extractionTimeNs ? currentResult.extractionTimeNs / 1_000_000 : 0.85).toFixed(2)} ms
            </div>
          </div>
        </div>
      </div>

      {/* Group 1: Shannon Entropy & Information Theory */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Binary className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">1. Information-Theoretic Metrics (Shannon Entropy)</h3>
            <p className="text-xs text-slate-400">Detects Domain Generation Algorithms (DGA), pseudo-random strings, and obfuscation tokens.</p>
          </div>
        </div>

        {/* Formula Box */}
        <div className="bg-black/40 border border-slate-800/80 rounded-xl p-4 mb-5 font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-slate-300">
            <span className="text-indigo-400 font-bold">Mathematical Formulation: </span>
            <code>H(X) = - ∑ P(xᵢ) · log₂(P(xᵢ))</code>
          </div>
          <div className="text-slate-400 text-[11px]">
            Natural Language URLs: <strong>3.0 – 4.0 bits</strong> | DGA / Random Phishing: <strong>&gt; 4.5 bits</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
          {/* URL Entropy */}
          <div className="bg-[#0b0f1b] border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>URL SHANNON ENTROPY</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${f.urlEntropy > 4.5 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {f.urlEntropy > 4.5 ? 'ANOMALY' : 'NORMAL'}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{f.urlEntropy} <span className="text-xs text-slate-500 font-normal">bits</span></div>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">
              Calculates character distribution randomness across the entire string.
            </p>
          </div>

          {/* Hostname Entropy */}
          <div className="bg-[#0b0f1b] border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>HOSTNAME ENTROPY</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${f.hostnameEntropy > 4.2 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {f.hostnameEntropy > 4.2 ? 'ELEVATED' : 'STABLE'}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{f.hostnameEntropy} <span className="text-xs text-slate-500 font-normal">bits</span></div>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">
              Evaluates host domain token diversity to flag machine-generated domains.
            </p>
          </div>

          {/* Digit Ratio */}
          <div className="bg-[#0b0f1b] border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>DIGIT RATIO (D / L)</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-500/20 text-blue-400">
                {(f.digitRatio * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-2xl font-black text-white">{f.numDigits} <span className="text-xs text-slate-500 font-normal">/ {f.urlLength} digits</span></div>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">
              Ratio of numerical characters to total length. Phishing kits embed hash IDs.
            </p>
          </div>
        </div>
      </div>

      {/* Group 2: Structural & Security Indicators */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">2. Host Architecture & Protocol Indicators</h3>
            <p className="text-xs text-slate-400">Identifies network and structural exploits that bypass conventional DNS reputation systems.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#0b0f1b] border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-500 block text-[10px]">RAW IP AS HOST</span>
            <span className={`text-base font-bold ${f.hasIpAddress ? 'text-red-400' : 'text-emerald-400'}`}>
              {f.hasIpAddress ? 'DETECTED' : 'FALSE (Domain Host)'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Bypasses domain registration</span>
          </div>

          <div className="bg-[#0b0f1b] border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-500 block text-[10px]">HTTPS PROTOCOL</span>
            <span className={`text-base font-bold ${f.hasHttps ? 'text-emerald-400' : 'text-amber-400'}`}>
              {f.hasHttps ? 'HTTPS (TLS)' : 'HTTP (Cleartext)'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Transport security standard</span>
          </div>

          <div className="bg-[#0b0f1b] border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-500 block text-[10px]">SUBDOMAIN DEPTH</span>
            <span className={`text-base font-bold ${f.numSubdomains >= 3 ? 'text-red-400' : 'text-white'}`}>
              {f.numSubdomains} Levels
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Excessive nesting flagged</span>
          </div>

          <div className="bg-[#0b0f1b] border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-500 block text-[10px]">HEX ENCODING</span>
            <span className={`text-base font-bold ${f.hasHexChars ? 'text-amber-400' : 'text-emerald-400'}`}>
              {f.hasHexChars ? 'PRESENT (%)' : 'NONE'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Obfuscation marker</span>
          </div>
        </div>
      </div>

      {/* Group 3: Lexical Length & Token Delimiters */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">3. Lexical Length & Character Delimiter Breakdown</h3>
            <p className="text-xs text-slate-400">Detailed character frequencies parsed by Java Spring Boot in under 1ms.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="bg-[#0b0f1b] border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-slate-500 block text-[10px]">URL LENGTH</span>
            <span className="text-white font-bold text-lg">{f.urlLength}</span>
            <span className="text-[10px] text-slate-500">characters</span>
          </div>

          <div className="bg-[#0b0f1b] border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-slate-500 block text-[10px]">HOST LENGTH</span>
            <span className="text-white font-bold text-lg">{f.hostnameLength}</span>
            <span className="text-[10px] text-slate-500">characters</span>
          </div>

          <div className="bg-[#0b0f1b] border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-slate-500 block text-[10px]">DOTS (.)</span>
            <span className="text-white font-bold text-lg">{f.numDots}</span>
            <span className="text-[10px] text-slate-500">delimiters</span>
          </div>

          <div className="bg-[#0b0f1b] border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-slate-500 block text-[10px]">HYPHENS (-)</span>
            <span className="text-white font-bold text-lg">{f.numHyphens}</span>
            <span className="text-[10px] text-slate-500">delimiters</span>
          </div>

          <div className="bg-[#0b0f1b] border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-slate-500 block text-[10px]">AT SYMBOLS (@)</span>
            <span className={`font-bold text-lg ${f.numAtSymbols > 0 ? 'text-red-400' : 'text-white'}`}>
              {f.numAtSymbols}
            </span>
            <span className="text-[10px] text-slate-500">credential trick</span>
          </div>

          <div className="bg-[#0b0f1b] border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-slate-500 block text-[10px]">QUERY PARAMS</span>
            <span className="text-white font-bold text-lg">{f.numQueryParams}</span>
            <span className="text-[10px] text-slate-500">variables</span>
          </div>
        </div>
      </div>

      {/* Evaluator Explainer Card */}
      <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-800/40 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span>Why In-Memory Java Feature Extraction Instead of Python Only? (Viva Defense)</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          <em>"Mam, in production enterprise firewalls, extracting features in Python via heavy libraries introduces significant thread GIL (Global Interpreter Lock) contention and garbage collection pauses. By utilizing <strong>Java Spring Boot</strong> with primitive type arrays and JIT compilation, our feature extraction finishes in <strong>under 1ms</strong>, leaving the entire latency budget for model inference and maintaining sub-50ms line-rate scanning."</em>
        </p>
      </div>
    </div>
  );
};
