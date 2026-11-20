package com.arcus.backend.service;

import com.arcus.backend.model.URLFeatures;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

@Service
public class MLEngineService {

    private static final Logger log = LoggerFactory.getLogger(MLEngineService.class);

    private final RestTemplate restTemplate;

    @Value("${mlengine.url:http://localhost:8000}")
    private String mlEngineUrl;

    public MLEngineService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(1500))
                .setReadTimeout(Duration.ofMillis(2000))
                .build();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> predict(String url, URLFeatures features) {
        String endpoint = mlEngineUrl + "/predict";
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("url", url);

            Map<String, Object> featureMap = new HashMap<>();
            featureMap.put("url_length", features.getUrlLength());
            featureMap.put("hostname_length", features.getHostnameLength());
            featureMap.put("path_length", features.getPathLength());
            featureMap.put("num_dots", features.getNumDots());
            featureMap.put("num_hyphens", features.getNumHyphens());
            featureMap.put("num_underscores", features.getNumUnderscores());
            featureMap.put("num_slashes", features.getNumSlashes());
            featureMap.put("num_at_symbols", features.getNumAtSymbols());
            featureMap.put("num_digits", features.getNumDigits());
            featureMap.put("digit_ratio", features.getDigitRatio());
            featureMap.put("has_ip_address", features.isHasIpAddress());
            featureMap.put("has_https", features.isHasHttps());
            featureMap.put("url_entropy", features.getUrlEntropy());
            featureMap.put("hostname_entropy", features.getHostnameEntropy());
            featureMap.put("num_subdomains", features.getNumSubdomains());
            featureMap.put("has_hex_chars", features.isHasHexChars());
            featureMap.put("double_slash_in_path", features.isDoubleSlashInPath());
            featureMap.put("hostname", features.getHostname());

            payload.put("features", featureMap);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            log.debug("Dispatching feature payload to Python ML engine at: {}", endpoint);
            ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (Map<String, Object>) response.getBody();
            }
        } catch (Exception ex) {
            log.warn("Remote ML Engine request failed or timed out: {}. Activating resilient in-memory heuristic fallback.", ex.getMessage());
        }

        return executeResilientFallback(url, features);
    }

    /**
     * Resilient in-memory fallback classifier ensuring high-availability zero-downtime scanning
     * even during ML microservice redeployments.
     */
    private Map<String, Object> executeResilientFallback(String url, URLFeatures f) {
        double score = 0.02;
        List<String> flags = new ArrayList<>();

        if (f.isHasIpAddress()) {
            score += 0.35;
            flags.add("Direct IP address format utilized as domain host");
        }
        if (f.getNumAtSymbols() > 0) {
            score += 0.30;
            flags.add("Embedded \"@\" symbol detected (Credential harvesting marker)");
        }
        if (f.getUrlLength() > 100) {
            score += 0.12;
            flags.add("Excessive URL character length (" + f.getUrlLength() + " chars)");
        }
        if (f.getNumDots() >= 5) {
            score += 0.10;
            flags.add("Elevated dot count (" + f.getNumDots() + " dots)");
        }
        if (f.getUrlEntropy() > 4.6) {
            score += 0.15;
            flags.add("High Shannon entropy indicating randomized domain tokens (" + f.getUrlEntropy() + ")");
        }
        if (!f.isHasHttps()) {
            score += 0.08;
            flags.add("Cleartext HTTP transmission protocol");
        }
        if (f.isHasHexChars()) {
            score += 0.10;
            flags.add("Hexadecimal/Percent encoding obfuscation found");
        }
        if (f.getNumSubdomains() >= 3) {
            score += 0.15;
            flags.add("Deep subdomain layering (" + f.getNumSubdomains() + " levels)");
        }

        double normalizedScore = Math.min(Math.round(score * 10000.0) / 10000.0, 0.99);
        String classification = normalizedScore >= 0.60 ? "MALICIOUS" : (normalizedScore >= 0.35 ? "SUSPICIOUS" : "BENIGN");
        String riskLevel = normalizedScore >= 0.60 ? "HIGH" : (normalizedScore >= 0.35 ? "MEDIUM" : "LOW");

        if (flags.isEmpty()) {
            flags.add("Standard benign structural patterns observed [Resilient Fallback Mode]");
        } else {
            flags.add("[Engine Notice: Computed via Java In-Memory Resilient Safety Engine]");
        }

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("url", url);
        fallback.put("classification", classification);
        fallback.put("risk_score", normalizedScore);
        fallback.put("confidence", 0.85);
        fallback.put("risk_level", riskLevel);
        fallback.put("triggered_flags", flags);
        fallback.put("inference_time_ms", 0.5);

        return fallback;
    }
}
