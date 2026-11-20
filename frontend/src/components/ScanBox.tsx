'use client';

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface ScanBoxProps {
  onScan: (url: string) => Promise<void>;
  isLoading: boolean;
}

const PRESETS = [
  { label: 'Phishing Demo', url: 'https://paypal-verification-account-update.xyz/login' },
  { label: 'IP Attack Demo', url: 'http://192.168.1.105/admin/credential.php?token=xyz' },
  { label: 'Safe URL Demo', url: 'https://docs.github.com/en/rest' },
];

export const ScanBox: React.FC<ScanBoxProps> = ({ onScan, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onScan(url.trim());
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    onScan(presetUrl);
  };

  return (
    <div className="mb-10 text-center">
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          URL Threat Inspection
        </h1>
        <p className="text-sm text-slate-400">
          Real-time machine learning analysis for phishing, zero-day domains, and credential harvesters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste or enter URL to analyze..."
            disabled={isLoading}
            className="w-full pl-11 pr-28 py-3.5 bg-[#10131e] border border-[#1e2335] rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="absolute right-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning</span>
              </>
            ) : (
              <span>Scan URL</span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center space-x-3 mt-3 text-xs text-slate-500">
          <span>Quick test:</span>
          {PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPreset(p.url)}
              className="text-slate-400 hover:text-blue-400 underline underline-offset-2 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
