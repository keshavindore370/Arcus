# A.R.C.U.S. — Automated Risk & Cyber URL Scanner

A real-time phishing and malicious URL detection system built with a microservice architecture.

## What it does

Paste any URL → get an instant threat verdict with risk score, confidence level, and triggered flags — all in under 50ms.

It detects:
- Zero-day phishing URLs (no blacklist needed)
- Brand impersonation (e.g. fake PayPal, Google domains)
- Suspicious TLDs, obfuscation patterns, and URL tricks

## Architecture

```
Frontend (Next.js)  →  Backend (Spring Boot)  →  ML Engine (FastAPI)
   Port 3000              Port 8080                Port 8000
```

1. **Frontend** — Next.js dashboard with scan input, threat map, history, and feature breakdown.
2. **Backend** — Java Spring Boot extracts 20+ lexical features from the URL (entropy, subdomain depth, special chars, etc.) in <5ms.
3. **ML Engine** — Python FastAPI scores the features using heuristic analysis, Shannon entropy, and brand-spoofing detection.
4. **Database** — MongoDB stores scan history and audit logs.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Java 17, Spring Boot 3, Maven |
| ML Engine | Python 3.11, FastAPI, Uvicorn |
| Database | MongoDB |
| DevOps | Docker, Docker Compose |

## Quick Start

### Docker (Recommended)
```bash
docker-compose up --build
```

### Manual Setup

**Terminal 1 — ML Engine:**
```bash
cd ml-engine
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 — Backend:**
```bash
cd backend
mvn clean spring-boot:run
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm install && npm run dev
```

Open **http://localhost:3000** to use the dashboard.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scan` | Scan a URL and get threat verdict |
| GET | `/api/history` | Last 50 scan results |
| GET | `/api/stats` | Scan stats and avg latency |
| GET | `/api/health` | Health check |

### Example

```bash
curl -X POST http://localhost:8080/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://paypal-update-account.xyz/login"}'
```

```json
{
  "classification": "MALICIOUS",
  "riskScore": 0.94,
  "confidence": 0.96,
  "triggeredFlags": [
    "Brand impersonation attempt detected (paypal)",
    "High-risk TLD: .xyz",
    "Suspicious keywords: login, update"
  ],
  "scanDurationMs": 14
}
```

## Project Structure

```
arcus/
├── frontend/          # Next.js dashboard (21 components)
├── backend/           # Java Spring Boot API
├── ml-engine/         # Python FastAPI scoring engine
└── README.md
```
