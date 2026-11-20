package com.arcus.backend.service;

import com.arcus.backend.model.URLFeatures;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.regex.Pattern;

@Service
public class FeatureExtractionService {

    private static final Pattern IP_PATTERN = Pattern.compile(
            "^(?:https?://)?(?:\\d{1,3}\\.){3}\\d{1,3}(?::\\d+)?(?:/.*)?$",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern HEX_PATTERN = Pattern.compile("%[0-9a-fA-F]{2}");

    /**
     * In-memory lexical feature extraction engineered for high-throughput, ultra-low latency (< 5ms).
     */
    public URLFeatures extract(String rawUrl) {
        String url = rawUrl != null ? rawUrl.trim() : "";
        String host = "";
        String path = "";
        String query = "";
        String scheme = "";

        try {
            String parsableUrl = url.contains("://") ? url : "http://" + url;
            URI uri = URI.create(parsableUrl);
            host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";
            path = uri.getPath() != null ? uri.getPath() : "";
            query = uri.getQuery() != null ? uri.getQuery() : "";
            scheme = uri.getScheme() != null ? uri.getScheme().toLowerCase() : "";
        } catch (Exception ignored) {
            // Fallback parsing if malformed URI structure
            int schemeIdx = url.indexOf("://");
            if (schemeIdx != -1) {
                scheme = url.substring(0, schemeIdx).toLowerCase();
                String remainder = url.substring(schemeIdx + 3);
                int slashIdx = remainder.indexOf('/');
                host = slashIdx != -1 ? remainder.substring(0, slashIdx).toLowerCase() : remainder.toLowerCase();
                path = slashIdx != -1 ? remainder.substring(slashIdx) : "";
            } else {
                int slashIdx = url.indexOf('/');
                host = slashIdx != -1 ? url.substring(0, slashIdx).toLowerCase() : url.toLowerCase();
                path = slashIdx != -1 ? url.substring(slashIdx) : "";
            }
        }

        int numDigits = 0;
        int numDots = 0;
        int numHyphens = 0;
        int numUnderscores = 0;
        int numSlashes = 0;
        int numAtSymbols = 0;
        int numQuestionMarks = 0;
        int numEquals = 0;
        int numAmpersands = 0;
        int numPercent = 0;

        for (int i = 0; i < url.length(); i++) {
            char c = url.charAt(i);
            if (Character.isDigit(c)) numDigits++;
            else if (c == '.') numDots++;
            else if (c == '-') numHyphens++;
            else if (c == '_') numUnderscores++;
            else if (c == '/') numSlashes++;
            else if (c == '@') numAtSymbols++;
            else if (c == '?') numQuestionMarks++;
            else if (c == '=') numEquals++;
            else if (c == '&') numAmpersands++;
            else if (c == '%') numPercent++;
        }

        int subdomainCount = 0;
        if (!host.isEmpty()) {
            String[] parts = host.split("\\.");
            subdomainCount = Math.max(0, parts.length - 2);
        }

        int queryParamCount = 0;
        if (!query.isEmpty()) {
            queryParamCount = query.split("&").length;
        }

        double digitRatio = url.isEmpty() ? 0.0 : (double) numDigits / url.length();

        return URLFeatures.builder()
                .urlLength(url.length())
                .hostnameLength(host.length())
                .pathLength(path.length())
                .numDots(numDots)
                .numHyphens(numHyphens)
                .numUnderscores(numUnderscores)
                .numSlashes(numSlashes)
                .numAtSymbols(numAtSymbols)
                .numQuestionMarks(numQuestionMarks)
                .numEquals(numEquals)
                .numAmpersands(numAmpersands)
                .numPercent(numPercent)
                .numDigits(numDigits)
                .digitRatio(Math.round(digitRatio * 10000.0) / 10000.0)
                .hasIpAddress(IP_PATTERN.matcher(url).find())
                .hasHttps("https".equalsIgnoreCase(scheme) || url.toLowerCase().startsWith("https://"))
                .urlEntropy(calculateShannonEntropy(url))
                .hostnameEntropy(calculateShannonEntropy(host))
                .numSubdomains(subdomainCount)
                .numQueryParams(queryParamCount)
                .hasHexChars(HEX_PATTERN.matcher(url).find())
                .doubleSlashInPath(path.contains("//"))
                .hostname(host)
                .build();
    }

    /**
     * Computes the Shannon entropy in O(N) using an ASCII frequency array.
     */
    public double calculateShannonEntropy(String text) {
        if (text == null || text.isEmpty()) {
            return 0.0;
        }

        int[] frequencies = new int[256];
        int total = text.length();

        for (int i = 0; i < total; i++) {
            char c = text.charAt(i);
            if (c < 256) {
                frequencies[c]++;
            }
        }

        double entropy = 0.0;
        for (int count : frequencies) {
            if (count > 0) {
                double probability = (double) count / total;
                entropy -= probability * (Math.log(probability) / Math.log(2));
            }
        }

        return Math.round(entropy * 10000.0) / 10000.0;
    }
}
