package com.arcus.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class URLFeatures {
    private int urlLength;
    private int hostnameLength;
    private int pathLength;
    private int numDots;
    private int numHyphens;
    private int numUnderscores;
    private int numSlashes;
    private int numAtSymbols;
    private int numQuestionMarks;
    private int numEquals;
    private int numAmpersands;
    private int numPercent;
    private int numDigits;
    private double digitRatio;
    private boolean hasIpAddress;
    private boolean hasHttps;
    private double urlEntropy;
    private double hostnameEntropy;
    private int numSubdomains;
    private int numQueryParams;
    private boolean hasHexChars;
    private boolean doubleSlashInPath;
    private String hostname;
}
