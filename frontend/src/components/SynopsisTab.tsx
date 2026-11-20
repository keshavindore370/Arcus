'use client';

import React, { useState } from 'react';
import { BookOpen, CheckCircle2, AlertCircle, FileText, Award, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const SynopsisTab: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: 'Why not simply use Google Safe Browsing or standard blacklists?',
      a: 'Mam, static blacklists are fundamentally reactive. When attackers launch zero-day phishing campaigns using automated domain generation (DGA) or newly registered transient domains, there is a delay of hours or days before the domain is flagged. A.R.C.U.S. inspects the intrinsic lexical characteristics in under 50ms, intercepting phishing before any blacklist is updated.'
    },
    {
      q: 'Why combine Java Spring Boot with Python instead of doing everything in Python?',
      a: 'Mam, Python is excellent for machine learning training and inference, but its Global Interpreter Lock (GIL) and runtime overhead make high-speed feature extraction slower under high concurrency. Java Spring Boot executes in-memory feature extraction with primitive arrays in under 1ms. Decoupling them into microservices allows horizontal scaling where Java handles throughput and Python handles intelligence.'
    },
    {
      q: 'How does A.R.C.U.S. prevent high False Positive Rates (FPR) on imbalanced datasets?',
      a: 'Mam, on the real web, benign URLs vastly outnumber phishing URLs (imbalanced distribution). Content-heavy models often flag benign URLs with complex tracking queries. A.R.C.U.S. uses Shannon entropy thresholds alongside multi-token validation (checking if brand names appear in subdomains versus registered second-level domains), preventing legitimate domains from being misclassified.'
    },
    {
      q: 'What are the main datasets used for training and benchmarking?',
      a: 'We evaluate against PhishTank and OpenPhish for confirmed malicious feeds, combined with benign traffic from the Tranco Top 1 Million list, ensuring the model generalizes accurately to real-world internet traffic.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & University Credentials Card */}
      <div className="bg-[#101524] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/50 px-3 py-1 rounded-full w-fit mb-3">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Medi-Caps University Official Project Synopsis Format</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          A.R.C.U.S.: An AI-Powered Phishing and Malicious URL Scanner Using Java Spring Boot and Python Microservices
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">CANDIDATE</span>
            <span className="text-slate-200 font-bold">Keshav Sharma</span>
            <span className="text-slate-400 block text-[11px]">EN23CS301509</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">PROGRAM / DURATION</span>
            <span className="text-slate-200 font-bold">B.Tech (VII Sem) Project-1</span>
            <span className="text-slate-500 block text-[11px]">August-December 2026</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">DEPARTMENT & FACULTY</span>
            <span className="text-slate-200 font-bold">Dept. of Computer Science & Eng.</span>
            <span className="text-slate-500 block text-[11px]">Faculty of Engineering</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">INSTITUTION</span>
            <span className="text-slate-200 font-bold">MEDICAPS UNIVERSITY</span>
            <span className="text-slate-500 block text-[11px]">Indore - 453331</span>
          </div>
        </div>
      </div>

      {/* Viva Defense Guide & Questions */}
      <div className="bg-[#111625] border border-blue-800/40 rounded-2xl p-6 sm:p-7">
        <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Viva Defense Guide (Direct Answers for Guide / Evaluator)</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Click on any question below to see the exact technical explanation to present during project evaluation:
        </p>

        <div className="space-y-2.5">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-[#0c101c]">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-blue-300 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-blue-400 font-mono">Q{idx + 1}:</span>
                    <span>{item.q}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem Statements */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 sm:p-7">
        <h3 className="text-base font-bold text-white mb-3">Problem Definition (Core Gaps Addressed)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
          <div className="bg-[#0b0f1b] border border-red-500/20 p-4 rounded-xl">
            <h4 className="font-bold text-red-400 mb-1">1. Zero-Day Blacklist Failures</h4>
            <p className="text-slate-300">
              Traditional security gateways rely on static blacklists, rendering them ineffective against transient zero-day domains launched within the initial hours of a phishing campaign.
            </p>
          </div>

          <div className="bg-[#0b0f1b] border border-amber-500/20 p-4 rounded-xl">
            <h4 className="font-bold text-amber-400 mb-1">2. Inference Latency Overhead</h4>
            <p className="text-slate-300">
              Content-based and DOM-crawling scanners introduce heavy network latencies (&gt;1000ms), making them unusable for inline line-rate web filtering.
            </p>
          </div>

          <div className="bg-[#0b0f1b] border border-blue-500/20 p-4 rounded-xl">
            <h4 className="font-bold text-blue-400 mb-1">3. Real-World Dataset Imbalance</h4>
            <p className="text-slate-300">
              Academic models trained on balanced 50/50 datasets suffer from intolerable False Positive Rates (FPR) when deployed against real-world traffic where benign traffic dominates.
            </p>
          </div>

          <div className="bg-[#0b0f1b] border border-indigo-500/20 p-4 rounded-xl">
            <h4 className="font-bold text-indigo-400 mb-1">4. Notebook-Only Academic Gap</h4>
            <p className="text-slate-300">
              Prior studies stop at isolated Jupyter scripts. A.R.C.U.S. delivers a production-ready, decoupled polyglot microservice blueprint with dual-mode storage resilience.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Objectives */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 sm:p-7">
        <h3 className="text-base font-bold text-white mb-3">Key Technical Objectives</h3>
        <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
          <li className="flex items-start space-x-2 bg-[#0b0f1b] p-3 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>To architect and deploy a decoupled polyglot microservice architecture integrating Next.js, Java Spring Boot, and Python FastAPI via asynchronous REST protocols.</span>
          </li>
          <li className="flex items-start space-x-2 bg-[#0b0f1b] p-3 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>To implement an in-memory Java feature extraction module processing 20+ lexical, delimiter, and Shannon entropy attributes in <strong>under 10ms</strong>.</span>
          </li>
          <li className="flex items-start space-x-2 bg-[#0b0f1b] p-3 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>To achieve a total end-to-end scanning latency of <strong>less than 50ms</strong> to support seamless real-time enterprise firewall integration.</span>
          </li>
          <li className="flex items-start space-x-2 bg-[#0b0f1b] p-3 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>To implement persistent threat intelligence logging and historical audit trails using MongoDB with fallback resilience.</span>
          </li>
        </ul>
      </div>

      {/* IEEE References Strictly Formatted */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 sm:p-7">
        <h3 className="text-base font-bold text-white mb-3">IEEE References (Strict University Formatting)</h3>
        <ol className="space-y-3 font-mono text-xs text-slate-400">
          <li className="p-3 bg-[#0b0f1b] rounded-lg border border-slate-800">
            <strong className="text-blue-400">[1]</strong> Jain A.K., Gupta B.B., “A machine learning based approach for phishing detection using URLs.”, <em>Journal of Ambient Intelligence and Humanized Computing</em>, Volume 10, pp: 3915-3939, 2019.
          </li>
          <li className="p-3 bg-[#0b0f1b] rounded-lg border border-slate-800">
            <strong className="text-blue-400">[2]</strong> Sahingoz O.K., Batur E., Bulut O., “Machine learning based phishing detection from URLs”, <em>Expert Systems with Applications</em>, Volume 117, pp: 345-357, 2019.
          </li>
          <li className="p-3 bg-[#0b0f1b] rounded-lg border border-slate-800">
            <strong className="text-blue-400">[3]</strong> Sonowal G., Kuppusamy K.S., “PhiDMA - A phishing detection model with multi-filter approach”, <em>Journal of King Saud University - Computer and Information Sciences</em>, Volume 32, pp: 99-112, 2020.
          </li>
          <li className="p-3 bg-[#0b0f1b] rounded-lg border border-slate-800">
            <strong className="text-blue-400">[4]</strong> Rao R.S., Pais A.R., “Detection of phishing websites using an enhanced feature set”, <em>IEEE International Conference on Computer Communication and Informatics</em>, pp: 1-6, 2019.
          </li>
        </ol>
      </div>
    </div>
  );
};
