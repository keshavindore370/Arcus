package com.arcus.backend.controller;

import com.arcus.backend.model.ScanRequest;
import com.arcus.backend.model.ScanResult;
import com.arcus.backend.model.URLFeatures;
import com.arcus.backend.repository.ScanResultRepository;
import com.arcus.backend.service.FeatureExtractionService;
import com.arcus.backend.service.MLEngineService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class ScanController {

    private static final Logger log = LoggerFactory.getLogger(ScanController.class);

    private final FeatureExtractionService featureExtractionService;
    private final MLEngineService mlEngineService;
    private final ScanResultRepository scanResultRepository;

    // In-memory resilient telemetry store for zero-downtime operation
    private final Deque<ScanResult> inMemoryHistory = new ConcurrentLinkedDeque<>();
    private final AtomicLong totalScans = new AtomicLong(0);
    private final AtomicLong maliciousScans = new AtomicLong(0);
    private final AtomicLong suspiciousScans = new AtomicLong(0);
    private final AtomicLong benignScans = new AtomicLong(0);

    @Autowired
    public ScanController(FeatureExtractionService featureExtractionService,
                          MLEngineService mlEngineService,
                          @Autowired(required = false) ScanResultRepository scanResultRepository) {
        this.featureExtractionService = featureExtractionService;
        this.mlEngineService = mlEngineService;
        this.scanResultRepository = scanResultRepository;

        // Seed some sample baseline scans for immediate dashboard presentation
        seedInitialDemoData();
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "arcus-core-backend");
        status.put("version", "1.0.0");
        status.put("databaseConnected", scanResultRepository != null);
        status.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }

    @PostMapping("/scan")
    public ResponseEntity<ScanResult> scan(@Valid @RequestBody ScanRequest request) {
        long overallStart = System.currentTimeMillis();

        // 1. High-speed in-memory lexical feature extraction in Java (< 5ms)
        long extractStart = System.nanoTime();
        URLFeatures features = featureExtractionService.extract(request.getUrl());
        long extractionDurationNs = System.nanoTime() - extractStart;

        // 2. Machine Learning inference via Python microservice (REST)
        Map<String, Object> prediction = mlEngineService.predict(request.getUrl(), features);

        long totalScanDurationMs = System.currentTimeMillis() - overallStart;

        // 3. Assemble unified scan result
        @SuppressWarnings("unchecked")
        List<String> flags = (List<String>) prediction.getOrDefault("triggered_flags", Collections.emptyList());

        String classification = (String) prediction.getOrDefault("classification", "BENIGN");
        String riskLevel = (String) prediction.getOrDefault("risk_level", "LOW");
        double riskScore = toDouble(prediction.get("risk_score"));
        double confidence = toDouble(prediction.get("confidence"));

        ScanResult result = ScanResult.builder()
                .id(UUID.randomUUID().toString())
                .url(request.getUrl())
                .classification(classification)
                .riskScore(riskScore)
                .confidence(confidence)
                .riskLevel(riskLevel)
                .triggeredFlags(flags)
                .features(features)
                .extractionTimeNs(extractionDurationNs)
                .scanDurationMs(totalScanDurationMs)
                .scannedAt(LocalDateTime.now())
                .build();

        // 4. Update in-memory telemetry
        inMemoryHistory.addFirst(result);
        while (inMemoryHistory.size() > 100) {
            inMemoryHistory.removeLast();
        }

        totalScans.incrementAndGet();
        if ("MALICIOUS".equalsIgnoreCase(classification)) {
            maliciousScans.incrementAndGet();
        } else if ("SUSPICIOUS".equalsIgnoreCase(classification)) {
            suspiciousScans.incrementAndGet();
        } else {
            benignScans.incrementAndGet();
        }

        // 5. Asynchronously / Safely persist to MongoDB if available
        if (scanResultRepository != null) {
            try {
                ScanResult saved = scanResultRepository.save(result);
                return ResponseEntity.ok(saved);
            } catch (Exception ex) {
                log.warn("MongoDB persistence skipped ({}); saved to volatile memory.", ex.getMessage());
            }
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ScanResult>> history() {
        if (scanResultRepository != null) {
            try {
                List<ScanResult> dbHistory = scanResultRepository.findTop50ByOrderByScannedAtDesc();
                if (dbHistory != null && !dbHistory.isEmpty()) {
                    return ResponseEntity.ok(dbHistory);
                }
            } catch (Exception ex) {
                log.warn("Unable to fetch scan history from MongoDB: {}. Returning in-memory history.", ex.getMessage());
            }
        }
        return ResponseEntity.ok(new ArrayList<>(inMemoryHistory));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        long total = totalScans.get();
        long malicious = maliciousScans.get();
        long suspicious = suspiciousScans.get();
        long benign = benignScans.get();

        if (scanResultRepository != null) {
            try {
                long dbTotal = scanResultRepository.count();
                if (dbTotal > total) {
                    total = dbTotal;
                    malicious = scanResultRepository.countByClassificationIgnoreCase("MALICIOUS");
                    suspicious = scanResultRepository.countByClassificationIgnoreCase("SUSPICIOUS");
                    benign = scanResultRepository.countByClassificationIgnoreCase("BENIGN");
                }
            } catch (Exception ignored) {
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalScans", total);
        stats.put("malicious", malicious);
        stats.put("suspicious", suspicious);
        stats.put("benign", benign);
        stats.put("avgLatencyMs", inMemoryHistory.stream().mapToLong(ScanResult::getScanDurationMs).average().orElse(18.5));
        stats.put("systemStatus", "OPERATIONAL");

        return ResponseEntity.ok(stats);
    }

    private double toDouble(Object val) {
        if (val == null) return 0.0;
        if (val instanceof Number) return ((Number) val).doubleValue();
        try {
            return Double.parseDouble(val.toString());
        } catch (Exception e) {
            return 0.0;
        }
    }

    private void seedInitialDemoData() {
        // Pre-populate with realistic threat intel demonstrations
        String[][] samples = {
                {"https://secure-login.paypal.com.verify-billing-update.xyz/signin", "MALICIOUS", "0.94", "HIGH"},
                {"http://192.168.1.104/admin/credential_steal.php?user=target@corp.com", "MALICIOUS", "0.89", "HIGH"},
                {"https://github.com/torvalds/linux", "BENIGN", "0.04", "LOW"},
                {"https://amazon-security-alert.tracking-order-service.top/confirm", "SUSPICIOUS", "0.58", "MEDIUM"},
                {"https://en.wikipedia.org/wiki/Phishing", "BENIGN", "0.03", "LOW"}
        };

        for (String[] s : samples) {
            String url = s[0];
            String classification = s[1];
            double risk = Double.parseDouble(s[2]);
            String level = s[3];

            URLFeatures feat = featureExtractionService.extract(url);
            List<String> demoFlags = new ArrayList<>();
            if ("MALICIOUS".equals(classification)) {
                demoFlags.add("Brand impersonation & suspicious TLD flagged");
                demoFlags.add("Deep subdomain nesting detected");
                maliciousScans.incrementAndGet();
            } else if ("SUSPICIOUS".equals(classification)) {
                demoFlags.add("Suspicious keyword sequence & generic TLD");
                suspiciousScans.incrementAndGet();
            } else {
                demoFlags.add("Verified legitimate lexical distribution");
                benignScans.incrementAndGet();
            }
            totalScans.incrementAndGet();

            ScanResult res = ScanResult.builder()
                    .id(UUID.randomUUID().toString())
                    .url(url)
                    .classification(classification)
                    .riskScore(risk)
                    .confidence(0.92)
                    .riskLevel(level)
                    .triggeredFlags(demoFlags)
                    .features(feat)
                    .extractionTimeNs(850000) // ~0.85 ms
                    .scanDurationMs(18)
                    .scannedAt(LocalDateTime.now().minusMinutes((long) (Math.random() * 60)))
                    .build();

            inMemoryHistory.add(res);
        }
    }
}
