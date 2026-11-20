export interface URLFeatures {
  urlLength: number;
  hostnameLength: number;
  pathLength: number;
  numDots: number;
  numHyphens: number;
  numUnderscores: number;
  numSlashes: number;
  numAtSymbols: number;
  numQuestionMarks: number;
  numEquals: number;
  numAmpersands: number;
  numPercent: number;
  numDigits: number;
  digitRatio: number;
  hasIpAddress: boolean;
  hasHttps: boolean;
  urlEntropy: number;
  hostnameEntropy: number;
  numSubdomains: number;
  numQueryParams: number;
  hasHexChars: boolean;
  doubleSlashInPath: boolean;
  hostname: string;
}

export interface ScanResult {
  id: string;
  url: string;
  classification: 'BENIGN' | 'SUSPICIOUS' | 'MALICIOUS';
  riskScore: number;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  triggeredFlags: string[];
  features: URLFeatures;
  extractionTimeNs: number;
  scanDurationMs: number;
  scannedAt: string;
}

export interface SystemStats {
  totalScans: number;
  malicious: number;
  suspicious: number;
  benign: number;
  avgLatencyMs: number;
  systemStatus: string;
}
