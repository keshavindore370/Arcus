'use client';

import React from 'react';

interface DailyOverviewProps {
  cleanPercent?: number;
  suspiciousPercent?: number;
  maliciousPercent?: number;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({
  cleanPercent = 74,
  suspiciousPercent = 18,
  maliciousPercent = 8
}) => {
  const renderCircle = (percentage: number, strokeColor: string) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
          {/* Background Ring */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke="#1b2234"
            strokeWidth="4"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke={strokeColor}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span className="absolute text-[10px] font-mono font-bold text-slate-200">
          {percentage}%
        </span>
      </div>
    );
  };

  return (
    <div className="bg-[#121622] border border-[#1e2538] rounded-xl p-4">
      <div className="text-[11px] font-bold text-slate-200 tracking-wide uppercase mb-3">
        DAILY OVERVIEW
      </div>

      <div className="space-y-3">
        {/* Clean */}
        <div className="flex items-center space-x-3 bg-[#0d1017] p-2 rounded-lg border border-[#181f2f]">
          {renderCircle(cleanPercent, '#3b82f6')}
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Clean: {cleanPercent}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Safe legitimate destinations
            </div>
          </div>
        </div>

        {/* Suspicious */}
        <div className="flex items-center space-x-3 bg-[#0d1017] p-2 rounded-lg border border-[#181f2f]">
          {renderCircle(suspiciousPercent, '#f59e0b')}
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Suspicious: {suspiciousPercent}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Anomalous token patterns
            </div>
          </div>
        </div>

        {/* Malicious */}
        <div className="flex items-center space-x-3 bg-[#0d1017] p-2 rounded-lg border border-[#181f2f]">
          {renderCircle(maliciousPercent, '#ef4444')}
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Malicious: {maliciousPercent}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Confirmed phishing attacks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
