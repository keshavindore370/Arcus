'use client';

import React from 'react';
import { X, Server, Cpu, Database, Layout, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e1424] border border-cyber-border rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              A.R.C.U.S. System Architecture
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Medi-Caps University Project-1 • Decoupled Microservice Workflow
            </p>
          </div>
        </div>

        {/* 4 Pipeline Stages */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="bg-[#090d18] border border-cyan-500/30 p-3.5 rounded-xl">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold mb-1.5">
                <Layout className="w-4 h-4" />
                <span>1. Next.js UI</span>
              </div>
              <p className="text-[11px] text-slate-300">
                User enters target URL. Initiates async REST payload request to Spring Boot gateway.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#090d18] border border-emerald-500/30 p-3.5 rounded-xl">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold mb-1.5">
                <Server className="w-4 h-4" />
                <span>2. Java Extraction</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Spring Boot extracts 20+ lexical features & Shannon entropy in memory under 10ms.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#090d18] border border-blue-500/30 p-3.5 rounded-xl">
              <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono font-bold mb-1.5">
                <Cpu className="w-4 h-4" />
                <span>3. Python ML</span>
              </div>
              <p className="text-[11px] text-slate-300">
                FastAPI microservice scores features against zero-day heuristic & ML models.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#090d18] border border-amber-500/30 p-3.5 rounded-xl">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold mb-1.5">
                <Database className="w-4 h-4" />
                <span>4. MongoDB</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Audit logs, features, and risk score are persisted; verdict rendered in Next.js HUD.
              </p>
            </div>
          </div>
        </div>

        {/* ASCII Workflow Flowchart */}
        <div className="bg-black/70 border border-slate-800 p-4 rounded-xl font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
          <pre>{`[User / Client System]
       | (URL Scan Request)
       v
[Next.js Frontend UI] (Port 3000)
       | (REST API Request)
       v
[Java Spring Boot Core Backend] (Port 8080)
       |-- 1. In-Memory Feature Extraction (<10ms)
       |      (Length, Shannon Entropy, Character Ratios, Regex Flags)
       |
       |-- 2. REST API POST (Extracted Features JSON)
       v
[Python FastAPI ML Engine] (Port 8000)
       |-- 3. ML Model Inference & Heuristic Scoring
       |-- 4. Returns Risk Score, Classification & Triggered Flags
       v
[Java Spring Boot Core Backend]
       |-- 5. Compile Final Result & Telemetry
       |-- 6. Log Scan Audit Record
       v
[MongoDB Database] (Data Persistence & Audit Logs)
       |
       v (Response sent back)
[Next.js Frontend UI] -> Displays Real-Time Threat Verdict (<50ms total)`}</pre>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono transition-colors"
          >
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
