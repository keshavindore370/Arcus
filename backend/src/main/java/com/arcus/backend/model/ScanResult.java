package com.arcus.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "scan_results")
public class ScanResult {

    @Id
    private String id;
    private String url;
    private String classification;    // BENIGN, SUSPICIOUS, MALICIOUS
    private double riskScore;         // 0.00 to 1.00
    private double confidence;        // 0.00 to 1.00
    private String riskLevel;         // LOW, MEDIUM, HIGH
    private List<String> triggeredFlags;
    private URLFeatures features;
    private long extractionTimeNs;    // Java in-memory extraction duration in nanoseconds
    private long scanDurationMs;      // Total round-trip latency
    private LocalDateTime scannedAt;
}
