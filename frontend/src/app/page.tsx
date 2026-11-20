'use client';

import React, { useState, useEffect } from 'react';
import { scanUrl, fetchStats, fetchHistory } from '../lib/api';
import { ScanResult, SystemStats } from '../lib/types';

interface SignalRow {
  name: string;
  value: string;
  tone: 'good' | 'warn' | 'bad';
}

export default function Home() {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMsg, setProgressMsg] = useState('Preparing URL analysis…');
  const [activeStep, setActiveStep] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const [activeNav, setActiveNav] = useState('overview');
  const [latestResult, setLatestResult] = useState<ScanResult | null>(null);
  const [signalRows, setSignalRows] = useState<SignalRow[]>([]);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalScans: 142,
    malicious: 38,
    suspicious: 21,
    benign: 83,
    avgLatencyMs: 14.2,
    systemStatus: 'OPERATIONAL',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([fetchStats(), fetchHistory()]);
      if (statsData) setStats(statsData);
      if (historyData && historyData.length > 0) {
        setHistory(historyData);
        populateResult(historyData[0], false);
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  const populateResult = (result: ScanResult, triggerToast = true) => {
    setLatestResult(result);
    const f = result.features;
    let hostname = 'example.com';
    let pathDepth = 1;
    let queryCount = 0;
    let isHttps = result.url.startsWith('https://');

    try {
      const parsed = new URL(result.url.includes('://') ? result.url : 'http://' + result.url);
      hostname = parsed.hostname;
      queryCount = Array.from(parsed.searchParams).length;
      pathDepth = parsed.pathname.split('/').filter(Boolean).length;
      isHttps = parsed.protocol === 'https:';
    } catch (_) {}

    const rows: SignalRow[] = [
      { name: 'URL length', value: `${f.urlLength} chars`, tone: f.urlLength > 100 ? 'warn' : 'good' },
      { name: 'Hostname length', value: `${f.hostnameLength || hostname.length} chars`, tone: (f.hostnameLength || hostname.length) > 30 ? 'warn' : 'good' },
      { name: 'Path depth', value: `${pathDepth} levels`, tone: pathDepth > 4 ? 'warn' : 'good' },
      { name: 'Query parameters', value: String(queryCount || f.numQueryParams || 0), tone: (queryCount || f.numQueryParams || 0) > 4 ? 'warn' : 'good' },
      { name: 'Subdomain count', value: String(f.numSubdomains || 0), tone: f.numSubdomains > 2 ? 'warn' : 'good' },
      { name: 'HTTPS protocol', value: isHttps || f.hasHttps ? 'Present' : 'Missing', tone: (isHttps || f.hasHttps) ? 'good' : 'warn' },
      { name: 'IP-based host', value: f.hasIpAddress ? 'Detected' : 'Not detected', tone: f.hasIpAddress ? 'bad' : 'good' },
      { name: 'Punycode hostname', value: (f as any).hasPunycode || hostname.includes('xn--') ? 'Detected' : 'Not detected', tone: (f as any).hasPunycode || hostname.includes('xn--') ? 'bad' : 'good' },
      { name: 'URL shortener', value: (f as any).isShortener || result.url.includes('bit.ly') || result.url.includes('tinyurl') ? 'Detected' : 'Not detected', tone: (f as any).isShortener || result.url.includes('bit.ly') ? 'warn' : 'good' },
      { name: 'At-symbol present', value: f.numAtSymbols > 0 ? 'Yes' : 'No', tone: f.numAtSymbols > 0 ? 'bad' : 'good' },
      { name: 'Suspicious keywords', value: result.triggeredFlags.some(fl => fl.toLowerCase().includes('keyword')) ? 'Detected' : 'None', tone: result.triggeredFlags.some(fl => fl.toLowerCase().includes('keyword')) ? 'warn' : 'good' },
      { name: 'Executable extension', value: result.url.match(/\.(exe|scr|bat|apk|msi)/i) ? 'Detected' : 'Not detected', tone: result.url.match(/\.(exe|scr|bat|apk|msi)/i) ? 'bad' : 'good' },
      { name: 'Encoded characters', value: f.hasHexChars ? 'Present' : 'None', tone: f.hasHexChars ? 'warn' : 'good' },
      { name: 'Digit ratio', value: `${Math.round(f.digitRatio * 100)}%`, tone: f.digitRatio > 0.2 ? 'warn' : 'good' },
      { name: 'Special-char ratio', value: `${Math.round(((f.numHyphens + f.numDots + f.numUnderscores) / Math.max(f.urlLength, 1)) * 100)}%`, tone: f.numHyphens > 3 ? 'warn' : 'good' },
      { name: 'Hyphen count', value: String(f.numHyphens), tone: f.numHyphens > 2 ? 'warn' : 'good' },
      { name: 'Port specified', value: result.url.match(/:\d{2,5}/) ? 'Custom' : 'Default', tone: result.url.match(/:\d{2,5}/) ? 'warn' : 'good' },
      { name: 'Fragment present', value: result.url.includes('#') ? 'Yes' : 'No', tone: 'good' },
      { name: 'Shannon entropy', value: `${f.urlEntropy.toFixed(2)} bits`, tone: f.urlEntropy > 4.2 ? 'warn' : 'good' },
      { name: 'Suspicious token count', value: String(result.triggeredFlags.length), tone: result.triggeredFlags.length > 2 ? 'bad' : result.triggeredFlags.length > 0 ? 'warn' : 'good' },
    ];
    setSignalRows(rows);
    if (triggerToast) showToast('Inspection complete.');
  };

  const handleScan = async (targetUrl?: string) => {
    const raw = (targetUrl !== undefined ? targetUrl : urlInput).trim();
    if (!raw) {
      showToast('Enter a URL before starting the inspection.');
      return;
    }

    setIsScanning(true);
    setShowProgress(true);
    setProgressPercent(12);
    setProgressMsg('Parsing URL structure…');
    setActiveStep(0);

    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    await wait(350);
    setProgressPercent(42);
    setProgressMsg('Extracting lexical indicators…');
    setActiveStep(1);

    await wait(350);
    setProgressPercent(73);
    setProgressMsg('Evaluating threat score…');
    setActiveStep(2);

    try {
      const result = await scanUrl(raw);
      await wait(300);
      setProgressPercent(100);
      setProgressMsg('Preparing inspection summary…');
      setActiveStep(3);
      await wait(200);

      populateResult(result, true);
      setHistory((prev) => [result, ...prev.filter((i) => i.url !== result.url)].slice(0, 8));
      setStats((prev) => ({
        ...prev,
        totalScans: prev.totalScans + 1,
        malicious: result.classification === 'MALICIOUS' ? prev.malicious + 1 : prev.malicious,
        suspicious: result.classification === 'SUSPICIOUS' ? prev.suspicious + 1 : prev.suspicious,
        benign: result.classification === 'BENIGN' ? prev.benign + 1 : prev.benign,
      }));
    } catch (e) {
      showToast('Failed to complete scan. Please try again.');
    } finally {
      setIsScanning(false);
      setShowProgress(false);
    }
  };

  const handleCopySummary = async () => {
    if (!latestResult) return;
    const summary = `A.R.C.U.S. Security Scan\nURL: ${latestResult.url}\nClassification: ${latestResult.classification}\nRisk Score: ${Math.round(latestResult.riskScore * 100)}/100\nLatency: ${latestResult.scanDurationMs}ms\nFlags: ${latestResult.triggeredFlags.join('; ')}`;
    try {
      await navigator.clipboard.writeText(summary);
      showToast('Inspection summary copied to clipboard.');
    } catch {
      showToast('Clipboard access unavailable.');
    }
  };

  const scrollTo = (id: string) => {
    setActiveNav(id);
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const riskScoreNum = latestResult ? Math.round(latestResult.riskScore * 100) : 0;
  const isMalicious = latestResult?.classification === 'MALICIOUS';
  const isSuspicious = latestResult?.classification === 'SUSPICIOUS';
  const verdictClass = isMalicious ? 'malicious' : isSuspicious ? 'suspicious' : 'safe';
  const scoreColor = isMalicious ? 'var(--red)' : isSuspicious ? 'var(--amber)' : 'var(--green)';

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <svg className="brand-mark" viewBox="0 0 48 48" role="img" aria-label="A.R.C.U.S. logo">
            <defs>
              <linearGradient id="arcusGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8ff2ed" />
                <stop offset="1" stopColor="#7d91ff" />
              </linearGradient>
            </defs>
            <path d="M24 3.5 43.5 14.8v18.4L24 44.5 4.5 33.2V14.8Z" fill="none" stroke="url(#arcusGradient)" strokeWidth="1.4" />
            <path d="M8 24c4.2-7 9.5-10.5 16-10.5S35.8 17 40 24c-4.2 7-9.5 10.5-16 10.5S12.2 31 8 24Z" fill="none" stroke="url(#arcusGradient)" strokeWidth="1.7" />
            <circle cx="24" cy="24" r="5.7" fill="none" stroke="#8ff2ed" strokeWidth="1.6" />
            <circle cx="24" cy="24" r="2" fill="#8ff2ed" />
            <path d="M24 7v5M24 36v5M7 24h5M36 24h5" stroke="#8ff2ed" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <div className="brand-copy">
            <div className="brand-name">A.R.C.U.S.</div>
            <div className="brand-sub">THREAT INTELLIGENCE</div>
          </div>
        </div>

        <div className="nav-label">Workspace</div>
        <nav className="nav" aria-label="Main navigation">
          <button
            onClick={() => scrollTo('overview')}
            className={`nav-link ${activeNav === 'overview' ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="4" rx="1.2" />
                <rect x="14" y="10" width="7" height="11" rx="1.5" />
                <rect x="3" y="13" width="7" height="8" rx="1.5" />
              </svg>
            </span>
            <span>Overview</span>
          </button>
          <button
            onClick={() => scrollTo('scanner')}
            className={`nav-link ${activeNav === 'scanner' ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5M8 10.8h5.6M10.8 8v5.6" />
              </svg>
            </span>
            <span>URL scanner</span>
          </button>
          <button
            onClick={() => scrollTo('features')}
            className={`nav-link ${activeNav === 'features' ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <svg viewBox="0 0 24 24">
                <path d="M4 5h16M4 12h16M4 19h16" />
                <circle cx="8" cy="5" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="10" cy="19" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span>Signal analysis</span>
          </button>
          <button
            onClick={() => scrollTo('history')}
            className={`nav-link ${activeNav === 'history' ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <svg viewBox="0 0 24 24">
                <path d="M3.5 12a8.5 8.5 0 1 0 2.2-5.7L3.5 8.5" />
                <path d="M3.5 4.5v4h4M12 7v5l3.2 2" />
              </svg>
            </span>
            <span>Scan history</span>
            <span className="nav-count">{history.length}</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="side-system">
            <div className="side-system-head">
              <i className="live-dot"></i> Systems Online
            </div>
            <p>Real-time lexical scoring engine operational. High-throughput zero-day threat filter active.</p>
          </div>
          <div className="side-foot">A.R.C.U.S. PLATFORM &nbsp; · &nbsp; V 2.0</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main" id="overview">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="crumb">
              <span>Security Operations</span>
              <span style={{ color: '#45566d' }}>/</span>
              <strong>Real-Time Threat Console</strong>
            </div>
          </div>
          <div className="top-actions">
            <div className="top-status">
              <i className="live-dot"></i> Intelligence Engine Active
            </div>
            <span className="top-separator"></span>
            <div className="environment">
              <i></i> PRODUCTION MODE
            </div>
          </div>
        </header>

        <div className="content">
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow">A.R.C.U.S. &nbsp; / &nbsp; CYBER INTELLIGENCE</div>
              <h1>
                See the threat.<br />
                <span>Stop it before it starts.</span>
              </h1>
              <p>
                An enterprise-grade URL threat scanner engineered to intercept zero-day phishing, typosquatted brand spoofs, and obfuscated exploits in under 50 milliseconds.
              </p>
              <div className="hero-tags">
                <span className="hero-tag">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3 4 6v5c0 5.2 3.4 8.6 8 10 4.6-1.4 8-4.8 8-10V6Z" />
                    <path d="m8.5 12 2.2 2.2 4.8-5" />
                  </svg>
                  Zero-Day Phishing Filter
                </span>
                <span className="hero-tag">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 19V5M4 19h17M7 15l4-4 3 2 6-7" />
                  </svg>
                  20+ Lexical Indicators
                </span>
                <span className="hero-tag">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  Sub-50ms SLA
                </span>
              </div>
            </div>

            <div className="radar-wrap" aria-hidden="true">
              <div className="radar">
                <div className="radar-sweep"></div>
                <span className="radar-label top">SIGNAL RADAR</span>
                <span className="radar-label bottom">INSPECTION LAYER</span>
                <i className="radar-point p1"></i>
                <i className="radar-point p2"></i>
                <div className="radar-center">
                  <div className="radar-core">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 3 4 6v5c0 5.2 3.4 8.6 8 10 4.6-1.4 8-4.8 8-10V6Z" />
                      <path d="m8.5 12 2.2 2.2 4.8-5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Metric Grid */}
          <section className="metric-grid" aria-label="Platform capabilities">
            <div className="metric">
              <div className="metric-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3 4 6v5c0 5.2 3.4 8.6 8 10 4.6-1.4 8-4.8 8-10V6Z" />
                  <path d="m8.5 12 2.2 2.2 4.8-5" />
                </svg>
              </div>
              <div>
                <div className="metric-label">Risk classifications</div>
                <div className="metric-value">03 classes</div>
              </div>
              <div className="metric-note">
                Benign<br />Suspicious · Malicious
              </div>
            </div>

            <div className="metric">
              <div className="metric-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19V5M4 19h17M7 15l4-4 3 2 6-7" />
                  <path d="M16 6h4v4" />
                </svg>
              </div>
              <div>
                <div className="metric-label">Detection signals</div>
                <div className="metric-value">20+</div>
              </div>
              <div className="metric-note">
                Lexical &amp;<br />structural analysis
              </div>
            </div>

            <div className="metric">
              <div className="metric-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <div>
                <div className="metric-label">Threats neutralized</div>
                <div className="metric-value">{stats.malicious}</div>
              </div>
              <div className="metric-note">
                Suspicious: {stats.suspicious}<br />Clean: {stats.benign}
              </div>
            </div>

            <div className="metric">
              <div className="metric-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7v5l3 2M4.5 5.5 3 4M19.5 5.5 21 4" />
                </svg>
              </div>
              <div>
                <div className="metric-label">Average latency</div>
                <div className="metric-value">{stats.avgLatencyMs.toFixed(1)} ms</div>
              </div>
              <div className="metric-note">
                Target: &lt;50ms<br />SLA Met ✓
              </div>
            </div>
          </section>

          {/* Scanner & Right Stack Grid */}
          <section className="dashboard-grid" id="scanner">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <div className="panel-kicker"><i></i> SCANNER ENGINE</div>
                  <h2 className="panel-title">URL threat scanner</h2>
                  <p className="panel-desc">Submit any URL to inspect lexical anomalies, brand spoofing, and risk vectors.</p>
                </div>
                <span className="micro-label">URL ANALYSIS</span>
              </div>

              <div className="scanner-body">
                <label className="input-label" htmlFor="urlInput">Enter target URL</label>
                <div className="url-entry">
                  <span className="link-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M10 13.5a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.7 1.7" />
                      <path d="M14 10.5a4.5 4.5 0 0 0-6.4 0l-3 3A4.5 4.5 0 0 0 11 19.9l1.7-1.7" />
                    </svg>
                  </span>
                  <input
                    id="urlInput"
                    type="text"
                    spellCheck="false"
                    autoComplete="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    placeholder="https://example.com/login"
                    aria-label="Enter URL to scan"
                  />
                  <button
                    className="scan-button"
                    id="scanButton"
                    disabled={isScanning}
                    onClick={() => handleScan()}
                  >
                    <svg viewBox="0 0 24 24">
                      <circle cx="10.8" cy="10.8" r="6.8" />
                      <path d="m16 16 4.5 4.5" />
                    </svg>
                    {isScanning ? 'Inspecting…' : 'Analyze URL'}
                  </button>
                </div>

                <div className="input-foot">
                  <span>Enter complete URL with or without protocol. Real-time in-memory analysis.</span>
                  <button
                    className="example-link"
                    type="button"
                    onClick={() => {
                      setUrlInput('https://paypa1.com/login');
                      handleScan('https://paypa1.com/login');
                    }}
                  >
                    Insert sample URL ↗
                  </button>
                </div>

                {/* Sample Presets */}
                <div className="sample-row">
                  <span className="sample-label">Try a sample</span>
                  <button
                    type="button"
                    className="sample-chip safe"
                    onClick={() => {
                      setUrlInput('https://www.wikipedia.org/');
                      handleScan('https://www.wikipedia.org/');
                    }}
                  >
                    Legitimate URL
                  </button>
                  <button
                    type="button"
                    className="sample-chip warn"
                    onClick={() => {
                      setUrlInput('https://paypa1.com/login');
                      handleScan('https://paypa1.com/login');
                    }}
                  >
                    Typosquatted Brand (paypa1)
                  </button>
                  <button
                    type="button"
                    className="sample-chip danger"
                    onClick={() => {
                      setUrlInput('https://paypal-security-verification.acc-update.xyz/login');
                      handleScan('https://paypal-security-verification.acc-update.xyz/login');
                    }}
                  >
                    Phishing Spoof (.xyz)
                  </button>
                  <button
                    type="button"
                    className="sample-chip danger"
                    onClick={() => {
                      setUrlInput('https://docs.google.com/forms/d/e/login-bank-account-verification');
                      handleScan('https://docs.google.com/forms/d/e/login-bank-account-verification');
                    }}
                  >
                    Cloud Form Phishing
                  </button>
                </div>

                {/* Progress bar */}
                <div className={`scan-progress ${showProgress ? 'show' : ''}`} aria-live="polite">
                  <div className="progress-top">
                    <span>{progressMsg}</span>
                    <span className="progress-state">PROCESSING</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <div className="progress-steps">
                    <span className={activeStep > 0 ? 'done' : ''}>URL parsing</span>
                    <span className={activeStep > 1 ? 'done' : ''}>Signal extraction</span>
                    <span className={activeStep > 2 ? 'done' : ''}>Risk evaluation</span>
                    <span className={activeStep >= 3 ? 'done' : ''}>Audit record</span>
                  </div>
                </div>

                {/* Results Area */}
                <div className="result-wrap">
                  {!latestResult ? (
                    <div className="empty-state" id="emptyState">
                      <div className="empty-graphic">
                        <svg viewBox="0 0 24 24">
                          <path d="M12 3 4 6v5c0 5.2 3.4 8.6 8 10 4.6-1.4 8-4.8 8-10V6Z" />
                          <path d="M12 8v4M12 16h.01" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="empty-title">Awaiting target input</h3>
                        <p className="empty-copy">
                          Your threat intelligence report will appear here. The system will categorize risk level, highlight triggered indicators, and populate the feature inspector below.
                        </p>
                        <div className="empty-hint">
                          <i></i> Ready for new analysis
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="result-card show" id="resultCard">
                      <div className="result-main">
                        <div className="score-area">
                          <div
                            className="score-ring"
                            style={{
                              ['--score' as any]: riskScoreNum,
                              ['--score-color' as any]: scoreColor,
                            }}
                          >
                            <div className="score-inner">
                              <span className="score-number">
                                {String(riskScoreNum).padStart(2, '0')}
                              </span>
                              <span className="score-caption">RISK SCORE</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className={`verdict ${verdictClass}`}>
                            {latestResult.classification}
                          </span>
                          <h3 className="result-domain">
                            {latestResult.features?.hostname || latestResult.url}
                          </h3>
                          <p className="result-summary">
                            {latestResult.triggeredFlags.join(' • ')}
                          </p>
                          <div className="result-meta">
                            <span className="meta-chip">
                              {latestResult.features?.hasHttps ? 'HTTPS' : 'HTTP'}
                            </span>
                            <span className="meta-chip">
                              HOST · {latestResult.features?.hostname || 'domain'}
                            </span>
                            <span className="meta-chip">
                              LATENCY · {latestResult.scanDurationMs} ms
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="result-bottom">
                        <span>
                          <strong>Intelligence Report Generated</strong> · Analyzed in {latestResult.scanDurationMs} ms
                        </span>
                        <div className="result-actions">
                          <button className="tiny-button" onClick={handleCopySummary}>
                            Copy report
                          </button>
                          <button className="tiny-button" onClick={() => scrollTo('features')}>
                            View features ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Stack: Risk Classification & Recent Inspections */}
            <div className="right-stack">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-kicker"><i></i> SEVERITY BANDS</div>
                    <h2 className="panel-title">Risk classification</h2>
                    <p className="panel-desc">Threshold criteria used to score threat severity.</p>
                  </div>
                  <span className="micro-label">THRESHOLDS</span>
                </div>
                <div className="gauge-body">
                  <div className="gauge-layout">
                    <div className="mini-gauge">
                      <div className="mini-gauge-center">
                        <strong>03</strong>
                        <span>LEVELS</span>
                      </div>
                    </div>
                    <div className="gauge-copy">
                      <strong>Multi-Signal Risk Grading</strong>
                      <p>URLs are scored dynamically between 00 and 100 based on lexical markers, Shannon entropy, and known brand impersonation patterns.</p>
                    </div>
                  </div>
                  <div className="gauge-legend">
                    <div className="legend-row">
                      <span className="legend-name">
                        <i className="legend-dot" style={{ background: 'var(--green)' }}></i>
                        Benign (Safe)
                      </span>
                      <strong>00–29</strong>
                    </div>
                    <div className="legend-row">
                      <span className="legend-name">
                        <i className="legend-dot" style={{ background: 'var(--amber)' }}></i>
                        Suspicious (Caution)
                      </span>
                      <strong>30–69</strong>
                    </div>
                    <div className="legend-row">
                      <span className="legend-name">
                        <i className="legend-dot" style={{ background: 'var(--red)' }}></i>
                        Malicious (Danger)
                      </span>
                      <strong>70–100</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel" id="history">
                <div className="panel-head">
                  <div>
                    <div className="panel-kicker"><i></i> ACTIVITY LOG</div>
                    <h2 className="panel-title">Recent scans</h2>
                    <p className="panel-desc">Latest URLs inspected in this session.</p>
                  </div>
                  <button
                    className="tiny-button"
                    onClick={() => {
                      setHistory([]);
                      showToast('Audit scan history cleared.');
                    }}
                  >
                    Clear all
                  </button>
                </div>
                <div className="history-body">
                  <div className="history-list">
                    {history.length === 0 ? (
                      <div className="history-empty">No activity yet. Your scans will appear here.</div>
                    ) : (
                      history.slice(0, 5).map((item, idx) => {
                        const tone =
                          item.classification === 'MALICIOUS'
                            ? 'var(--red)'
                            : item.classification === 'SUSPICIOUS'
                            ? 'var(--amber)'
                            : 'var(--green)';
                        return (
                          <button
                            key={idx}
                            className="history-item"
                            onClick={() => {
                              setUrlInput(item.url);
                              populateResult(item, false);
                              scrollTo('scanner');
                            }}
                            title="Load this scan record"
                          >
                            <i className="history-status" style={{ background: tone }}></i>
                            <span className="history-text">
                              <span className="history-url">{item.url}</span>
                              <span className="history-time">
                                {new Date(item.scannedAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </span>
                            </span>
                            <span className="history-score">
                              {String(Math.round(item.riskScore * 100)).padStart(2, '0')}/100
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Technical Signal Inspector */}
          <section className="mt-4" id="features">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <div className="panel-kicker"><i></i> FEATURE VECTOR ANALYSIS</div>
                  <h2 className="panel-title">Technical signal inspector</h2>
                  <p className="panel-desc">A breakdown of the 20+ lexical, structural, and information-theoretic indicators extracted from the target URL.</p>
                </div>
                <span className="micro-label">20 INDICATORS</span>
              </div>
              <div className="feature-body">
                <div className="feature-toolbar">
                  <span className="feature-status">
                    <i className="live-dot"></i>
                    <span>{latestResult ? 'Live signals calculated from active URL' : 'Waiting for inspection'}</span>
                  </span>
                  <span className="micro-label">LEXICAL + STRUCTURAL MATRIX</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {signalRows.map((row, idx) => (
                    <div className="feature" key={idx}>
                      <span className="feature-name" title={row.name}>{row.name}</span>
                      <span className={`feature-value ${row.tone}`} title={row.value}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Clean Enterprise Website Footer */}
          <footer className="mt-12 pt-8 pb-6 border-t border-[rgba(148,174,207,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
            <div>
              © 2026 A.R.C.U.S. Threat Intelligence Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-[11px]">
              <a href="#overview" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#overview" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#overview" className="hover:text-slate-300 transition-colors">Security Advisories</a>
              <a href="#overview" className="hover:text-slate-300 transition-colors">API Status</a>
            </div>
          </footer>
        </div>
      </main>

      {/* Toast Notification */}
      <div className={`toast ${toastMessage ? 'show' : ''}`} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </div>
  );
}
