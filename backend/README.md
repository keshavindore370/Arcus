# A.R.C.U.S. Core Spring Boot Backend

The central orchestrator and feature-extraction engine for A.R.C.U.S. (Automated Risk & Cyber URL Scanner).

## Highlights
- **Sub-5ms Java In-Memory Feature Extraction**: Implements O(N) ASCII Shannon entropy calculation, character frequency counters, and structural regex matchers without external API dependencies.
- **Microservice Orchestration**: Dispatches extracted vectors to the Python ML Inference Engine via REST.
- **Dual-Storage Resilience**: Stores persistent scan audit logs in MongoDB, with transparent in-memory fault tolerance if database connectivity is unavailable.
- **REST Endpoints**:
  - `POST /api/scan`: Ingests target URL, executes end-to-end scanning, returns classification, risk score, confidence, and triggered threat flags.
  - `GET /api/history`: Returns recent scan audits.
  - `GET /api/stats`: Returns telemetry (total scans, malicious count, suspicious count, benign count, average latency).
  - `GET /api/health`: Health status.

## Build & Run
```bash
cd backend
mvn clean spring-boot:run
```
