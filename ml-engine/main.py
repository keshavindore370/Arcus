from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import time
import uuid
from datetime import datetime
from collections import deque
from scorer import URLScorer

app = FastAPI(
    title="A.R.C.U.S. Core Security Engine",
    description="Dual-Mode API Gateway & ML Inference Service providing real-time URL classification, feature extraction, and audit history.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scorer = URLScorer()

# In-memory history and stats store
history_store = deque(maxlen=50)
stats_counter = {
    "totalScans": 0,
    "malicious": 0,
    "suspicious": 0,
    "benign": 0,
    "durations": deque(maxlen=50)
}

# Pre-populate sample audit history
def seed_initial_history():
    samples = [
        ("https://paypal-security-verification.acc-update.xyz/login", "MALICIOUS", 0.94, "HIGH", [
            "Brand impersonation attempt detected (paypal)",
            "High-risk generic TLD flagged: .xyz",
            "Suspicious intent keywords detected: login, security, update"
        ]),
        ("http://192.168.1.104/admin/credential_steal.php?user=target@corp.com", "MALICIOUS", 0.89, "HIGH", [
            "Direct IP address format utilized as domain host",
            "Embedded \"@\" delimiter detected (URL authority confusion)"
        ]),
        ("https://docs.github.com/en/rest", "BENIGN", 0.04, "LOW", [
            "Standard legitimate lexical and structural patterns verified"
        ]),
        ("https://amazon-security-alert.tracking-service.top/confirm", "SUSPICIOUS", 0.58, "MEDIUM", [
            "Suspicious keyword sequence & generic TLD flagged (.top)"
        ]),
        ("https://en.wikipedia.org/wiki/Phishing", "BENIGN", 0.03, "LOW", [
            "Standard legitimate lexical and structural patterns verified"
        ])
    ]
    for url, cls, score, level, flags in samples:
        f = scorer.extract_lexical_features(url)
        stats_counter["totalScans"] += 1
        if cls == "MALICIOUS":
            stats_counter["malicious"] += 1
        elif cls == "SUSPICIOUS":
            stats_counter["suspicious"] += 1
        else:
            stats_counter["benign"] += 1
        stats_counter["durations"].append(14.0)

        history_store.appendleft({
            "id": str(uuid.uuid4()),
            "url": url,
            "classification": cls,
            "riskScore": score,
            "confidence": 0.95,
            "riskLevel": level,
            "triggeredFlags": flags,
            "features": to_camel_case_features(f),
            "extractionTimeNs": 750000,
            "scanDurationMs": 14,
            "scannedAt": datetime.now().isoformat()
        })

def to_camel_case_features(f: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "urlLength": f.get("url_length", 0),
        "hostnameLength": f.get("hostname_length", 0),
        "pathLength": f.get("path_length", 0),
        "numDots": f.get("num_dots", 0),
        "numHyphens": f.get("num_hyphens", 0),
        "numUnderscores": f.get("num_underscores", 0),
        "numSlashes": f.get("num_slashes", 0),
        "numAtSymbols": f.get("num_at_symbols", 0),
        "numQuestionMarks": f.get("num_question_marks", 0),
        "numEquals": f.get("num_equals", 0),
        "numAmpersands": f.get("num_ampersands", 0),
        "numPercent": f.get("num_percent", 0),
        "numDigits": f.get("num_digits", 0),
        "digitRatio": f.get("digit_ratio", 0.0),
        "hasIpAddress": f.get("has_ip_address", False),
        "hasHttps": f.get("has_https", False),
        "urlEntropy": f.get("url_entropy", 0.0),
        "hostnameEntropy": f.get("hostname_entropy", 0.0),
        "numSubdomains": f.get("num_subdomains", 0),
        "numQueryParams": f.get("num_query_params", 0),
        "hasHexChars": f.get("has_hex_chars", False),
        "doubleSlashInPath": f.get("double_slash_in_path", False),
        "hostname": f.get("hostname", "")
    }

seed_initial_history()

class URLRequest(BaseModel):
    url: str

class PredictRequest(BaseModel):
    url: str
    features: Optional[Dict[str, Any]] = None

@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "UP",
        "service": "arcus-service",
        "engine": "A.R.C.U.S. Real-Time Classifier",
        "version": "1.0.0"
    }

@app.post("/predict")
def predict(request: PredictRequest):
    start = time.perf_counter()
    result = scorer.score(request.url.strip(), request.features)
    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
    return {
        "url": result["url"],
        "classification": result["classification"],
        "risk_score": result["risk_score"],
        "confidence": result["confidence"],
        "risk_level": result["risk_level"],
        "triggered_flags": result["triggered_flags"],
        "features": result["features"],
        "inference_time_ms": elapsed_ms
    }

@app.post("/api/scan")
def api_scan(request: URLRequest):
    if not request.url or not request.url.strip():
        raise HTTPException(status_code=400, detail="Target URL cannot be empty")
    
    start_total = time.perf_counter()
    raw_url = request.url.strip()
    
    extract_start = time.perf_counter_ns()
    raw_features = scorer.extract_lexical_features(raw_url)
    extraction_time_ns = time.perf_counter_ns() - extract_start
    
    result = scorer.score(raw_url, raw_features)
    total_duration_ms = max(int(round((time.perf_counter() - start_total) * 1000)), 4)
    
    camel_features = to_camel_case_features(result["features"])
    
    scan_item = {
        "id": str(uuid.uuid4()),
        "url": raw_url,
        "classification": result["classification"],
        "riskScore": result["risk_score"],
        "confidence": result["confidence"],
        "riskLevel": result["risk_level"],
        "triggeredFlags": result["triggered_flags"],
        "features": camel_features,
        "extractionTimeNs": extraction_time_ns if extraction_time_ns > 0 else 720000,
        "scanDurationMs": total_duration_ms,
        "scannedAt": datetime.now().isoformat()
    }
    
    # Update telemetry
    history_store.appendleft(scan_item)
    stats_counter["totalScans"] += 1
    if result["classification"] == "MALICIOUS":
        stats_counter["malicious"] += 1
    elif result["classification"] == "SUSPICIOUS":
        stats_counter["suspicious"] += 1
    else:
        stats_counter["benign"] += 1
    stats_counter["durations"].append(total_duration_ms)
    
    return scan_item

@app.get("/api/history")
def api_history():
    return list(history_store)

@app.get("/api/stats")
def api_stats():
    durations = stats_counter["durations"]
    avg_latency = round(sum(durations) / max(len(durations), 1), 1) if durations else 15.0
    return {
        "totalScans": stats_counter["totalScans"],
        "malicious": stats_counter["malicious"],
        "suspicious": stats_counter["suspicious"],
        "benign": stats_counter["benign"],
        "avgLatencyMs": avg_latency,
        "systemStatus": "OPERATIONAL"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
