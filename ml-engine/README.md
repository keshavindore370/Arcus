# A.R.C.U.S. Machine Learning & Heuristic Inference Engine

Python FastAPI microservice engineered to evaluate lexical risk, entropy distribution, brand spoofing patterns, and suspicious indicators in URLs in real-time.

## Features
- **Sub-5ms Inference**: Fast lexical and structural pattern matching without external lookups.
- **Shannon Entropy Analysis**: Detects pseudo-random or algorithmically generated domains (DGA).
- **Brand Impersonation Detection**: Analyzes subdomains and path structures against known spoofed brands.
- **Detailed Threat Flags**: Returns granular breakdown of triggered indicators for transparency.

## Endpoints
- `GET /health` - Service health status
- `POST /predict` - JSON body: `{"url": "https://example.com"}`

## Local Execution
```bash
cd ml-engine
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
