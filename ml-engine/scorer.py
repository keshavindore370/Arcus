import re
import math
from urllib.parse import urlparse
from typing import Dict, Any, List, Optional
import requests

class URLScorer:
    """
    A.R.C.U.S. Advanced Heuristic & Statistical Risk Scoring Engine.
    Evaluates URLs across lexical, structural, statistical, brand-spoofing,
    typosquatting, unshortening, and cloud hosting abuse dimensions.
    Returns normalized risk score (0.0 - 1.0), risk classification, confidence, and triggered flags.
    """

    SUSPICIOUS_TLDS = {
        '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', 
        '.online', '.site', '.click', '.download', '.buzz', '.work',
        '.bid', '.loan', '.racing', '.win', '.vip', '.rest', '.icu',
        '.monster', '.cam', '.cfd'
    }

    SPOOFED_BRANDS = [
        'paypal', 'apple', 'google', 'amazon', 'microsoft', 'netflix', 
        'facebook', 'instagram', 'twitter', 'linkedin', 'bankofamerica', 
        'chase', 'wells', 'citibank', 'ebay', 'dropbox', 'icloud', 
        'outlook', 'office365', 'binance', 'coinbase', 'metamask', 'whatsapp',
        'steam', 'spotify', 'telegram', 'sbi', 'hdfc', 'icici'
    ]

    SUSPICIOUS_KEYWORDS = [
        'login', 'signin', 'verify', 'account', 'secure', 'update', 
        'confirm', 'banking', 'password', 'credential', 'wallet', 
        'authenticate', 'validation', 'security', 'suspended', 'unusual',
        'free', 'reward', 'lucky', 'winner', 'claim', 'bonus', 'kyc',
        'otp', 'refund', 'unlock', 'urgent', 'billing'
    ]

    SHORTENER_DOMAINS = {
        'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
        'buff.ly', 'cutt.ly', 'rb.gy', 'shorturl.at', 'rebrand.ly',
        'clck.ru', 'v.gd', 'tny.im'
    }

    CLOUD_HOSTING_DOMAINS = {
        'docs.google.com', 'forms.gle', 'firebaseapp.com', 'web.app',
        'github.io', 'vercel.app', 'weebly.com', 'wixsite.com', 'canva.site',
        'pages.dev', 'netlify.app', 'glitch.me', 'surveymonkey.com',
        'jotform.com', 'typeform.com', '000webhostapp.com', 'blogspot.com',
        'wordpress.com', 'sites.google.com', 'appspot.com'
    }

    PRIVATE_IP_PATTERNS = [
        r'^127\.', r'^10\.', r'^192\.168\.', r'^172\.(1[6-9]|2[0-9]|3[0-1])\.', r'^localhost'
    ]

    def calculate_entropy(self, text: str) -> float:
        """Calculates Shannon entropy to identify algorithmic / randomized strings."""
        if not text:
            return 0.0
        frequencies: Dict[str, int] = {}
        for char in text:
            frequencies[char] = frequencies.get(char, 0) + 1
        
        length = len(text)
        entropy = -sum((count / length) * math.log2(count / length) for count in frequencies.values())
        return round(entropy, 4)

    def _levenshtein(self, s1: str, s2: str) -> int:
        """Calculates edit distance between two strings."""
        if len(s1) < len(s2):
            return self._levenshtein(s2, s1)
        if len(s2) == 0:
            return len(s1)
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        return previous_row[-1]

    def detect_typosquatting(self, hostname: str) -> List[str]:
        """Detects visual character substitution and close misspellings of trusted brands."""
        clean_host = hostname.lower().split(':')[0]
        # Common substitution map (leetspeak)
        subs = {'0': 'o', '1': 'l', '3': 'e', '5': 's', '4': 'a', '@': 'a', 'vv': 'w'}
        normalized = clean_host
        for k, v in subs.items():
            normalized = normalized.replace(k, v)

        detected = []
        host_labels = clean_host.split('.')
        primary_domain = host_labels[-2] if len(host_labels) >= 2 else host_labels[0]

        for brand in self.SPOOFED_BRANDS:
            # Check 1: Leetspeak character swap (e.g. 'paypa1' -> 'paypal')
            if brand in normalized and brand not in clean_host:
                detected.append(brand)
                continue
            # Check 2: Edit distance 1 (e.g. 'amazn' or 'paypall' or 'amazom')
            if len(brand) >= 5 and primary_domain != brand:
                if self._levenshtein(primary_domain, brand) == 1:
                    detected.append(brand)
        return detected

    def resolve_shortener(self, url: str) -> Optional[str]:
        """Expands shortened URLs (bit.ly, tinyurl, etc.) in under 1 second without downloading body."""
        try:
            parsed = urlparse(url if "://" in url else "http://" + url)
            host = (parsed.netloc or '').lower().split(':')[0]
            if host in self.SHORTENER_DOMAINS:
                full_url = url if "://" in url else "https://" + url
                resp = requests.head(full_url, allow_redirects=True, timeout=1.2, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ArcusScanner/2.0'
                })
                resolved = resp.url
                if resolved and resolved.lower().rstrip('/') != full_url.lower().rstrip('/'):
                    return resolved
        except Exception:
            pass
        return None

    def extract_lexical_features(self, url: str) -> Dict[str, Any]:
        """Extracts complete lexical, structural, and character distribution features."""
        try:
            parsed = urlparse(url if "://" in url else "http://" + url)
        except Exception:
            parsed = urlparse("http://" + url)

        hostname = (parsed.netloc or '').lower()
        path = parsed.path or ''
        query = parsed.query or ''
        full_url = url.strip()

        # Handle port in hostname
        if ':' in hostname:
            hostname = hostname.split(':')[0]

        parts = hostname.split('.')
        tld = f".{parts[-1]}" if len(parts) > 1 else ""
        subdomain_count = max(0, len(parts) - 2) if len(parts) >= 2 else 0

        num_digits = sum(c.isdigit() for c in full_url)
        digit_ratio = round(num_digits / max(len(full_url), 1), 4)

        has_ip = bool(re.match(r'^(?:https?://)?(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:/.*)?$', full_url))
        is_private_ip = any(re.search(pat, hostname) for pat in self.PRIVATE_IP_PATTERNS) if (has_ip or 'localhost' in hostname) else False

        is_shortener = hostname in self.SHORTENER_DOMAINS
        is_cloud_platform = any(hostname.endswith(cp) or hostname == cp for cp in self.CLOUD_HOSTING_DOMAINS)

        return {
            'url_length': len(full_url),
            'hostname_length': len(hostname),
            'path_length': len(path),
            'num_dots': full_url.count('.'),
            'num_hyphens': full_url.count('-'),
            'num_underscores': full_url.count('_'),
            'num_slashes': full_url.count('/'),
            'num_at_symbols': full_url.count('@'),
            'num_question_marks': full_url.count('?'),
            'num_equals': full_url.count('='),
            'num_ampersands': full_url.count('&'),
            'num_percent': full_url.count('%'),
            'num_digits': num_digits,
            'digit_ratio': digit_ratio,
            'has_ip_address': has_ip,
            'is_private_ip': is_private_ip,
            'has_https': full_url.lower().startswith('https://'),
            'url_entropy': self.calculate_entropy(full_url),
            'hostname_entropy': self.calculate_entropy(hostname),
            'path_entropy': self.calculate_entropy(path),
            'num_subdomains': subdomain_count,
            'tld': tld,
            'uses_suspicious_tld': tld in self.SUSPICIOUS_TLDS,
            'has_hex_chars': bool(re.search(r'%[0-9a-fA-F]{2}', full_url)),
            'double_slash_in_path': '//' in path,
            'has_punycode': 'xn--' in hostname,
            'is_shortener': is_shortener,
            'is_cloud_platform': is_cloud_platform,
            'hostname': hostname
        }

    def score(self, url: str, precomputed_features: Dict[str, Any] = None) -> Dict[str, Any]:
        """Calculates multi-dimensional risk score and generates threat signals."""
        features = self.extract_lexical_features(url)
        if precomputed_features:
            features.update(precomputed_features)

        raw_score = 0.0
        triggered_flags: List[str] = []

        # -------------------------------------------------------------
        # DRAWBACK FIX 1: URL Shortener Unmasking & Redirect Analysis
        # -------------------------------------------------------------
        if features.get('is_shortener'):
            resolved = self.resolve_shortener(url)
            if resolved:
                triggered_flags.append(f"⚡ Shortener Unmasked: Redirects to target '{resolved}'")
                # Score the target destination and inherit its risk!
                target_result = self.score(resolved)
                if target_result['risk_score'] > 0.30:
                    raw_score += target_result['risk_score'] * 0.85
                    triggered_flags.extend([f"↳ Target risk: {flag}" for flag in target_result['triggered_flags'][:2]])
                else:
                    raw_score += 0.15
            else:
                raw_score += 0.25
                triggered_flags.append('⚠️ URL Shortener Detected: Obfuscating real destination domain')

        # -------------------------------------------------------------
        # DRAWBACK FIX 2: Cloud / Free Hosting Credential Harvesting Abuse
        # -------------------------------------------------------------
        hostname = str(features.get('hostname', '')).lower()
        full_lower = url.lower()
        if features.get('is_cloud_platform'):
            harvesting_keywords = [kw for kw in self.SUSPICIOUS_KEYWORDS if kw in full_lower]
            if harvesting_keywords:
                raw_score += 0.50
                triggered_flags.append(f"🚨 Cloud Service Abuse: Credential harvesting attempt hosted on public cloud platform ({hostname})")

        # -------------------------------------------------------------
        # DRAWBACK FIX 3: Typosquatting & Leetspeak Brand Spoofing
        # -------------------------------------------------------------
        typosquats = self.detect_typosquatting(hostname)
        if typosquats:
            raw_score += 0.45
            triggered_flags.append(f"🚨 Typosquatting Detected: Visual character substitution spoofing brand '{typosquats[0]}'")

        # -------------------------------------------------------------
        # DRAWBACK FIX 4: Punycode (IDN Homograph) Attack
        # -------------------------------------------------------------
        if features.get('has_punycode'):
            raw_score += 0.40
            triggered_flags.append("🚨 IDN Homograph / Punycode Attack: Non-ASCII spoofed characters detected (xn--)")

        # -------------------------------------------------------------
        # DRAWBACK FIX 5: Private / Local Network IP (SSRF)
        # -------------------------------------------------------------
        if features.get('is_private_ip'):
            raw_score += 0.45
            triggered_flags.append("🚨 SSRF / Private Subnet Target: URL attempts internal network exploitation")
        elif features.get('has_ip_address'):
            raw_score += 0.35
            triggered_flags.append('Direct IP address format utilized as domain host')

        # Embedded @ symbol (URL authority confusion)
        if features.get('num_at_symbols', 0) > 0:
            raw_score += 0.30
            triggered_flags.append('Embedded "@" delimiter detected (URL authority confusion)')

        # Suspicious or high-risk TLD
        if features.get('uses_suspicious_tld'):
            raw_score += 0.20
            triggered_flags.append(f"High-risk generic TLD flagged: {features.get('tld')}")

        # Standard Brand spoofing detection in subdomains / paths
        matched_brands = [b for b in self.SPOOFED_BRANDS if b in full_lower and b not in typosquats]
        for brand in matched_brands:
            if brand in hostname:
                parts = hostname.split('.')
                registered_domain = '.'.join(parts[-2:]) if len(parts) >= 2 else hostname
                if brand not in registered_domain:
                    raw_score += 0.30
                    triggered_flags.append(f'Brand impersonation attempt detected ({brand})')
                    break
                elif '-' in registered_domain and brand in registered_domain:
                    raw_score += 0.15
                    triggered_flags.append(f'Hyphenated brand spoofing pattern detected ({brand})')
                    break
            else:
                raw_score += 0.15
                triggered_flags.append(f'Brand credential harvesting keyword in URL path/query ({brand})')
                break

        # Phishing Keywords
        detected_keywords = [kw for kw in self.SUSPICIOUS_KEYWORDS if kw in full_lower]
        if detected_keywords:
            weight = min(0.20, 0.06 * len(detected_keywords))
            raw_score += weight
            triggered_flags.append(f"Suspicious intent keywords detected: {', '.join(detected_keywords[:4])}")

        # Structural length anomalies
        url_len = features.get('url_length', 0)
        if url_len > 180:
            raw_score += 0.15
            triggered_flags.append(f'Excessive URL length ({url_len} characters)')
        elif url_len > 90:
            raw_score += 0.08
            triggered_flags.append(f'Elevated URL length ({url_len} characters)')

        # Subdomain depth abuse
        subdomains = features.get('num_subdomains', 0)
        if subdomains >= 3:
            raw_score += 0.18
            triggered_flags.append(f'Excessive subdomain layering ({subdomains} levels)')
        elif subdomains == 2:
            raw_score += 0.08
            triggered_flags.append('Multiple nested subdomains present')

        # Shannon entropy anomaly
        entropy = features.get('url_entropy', 0.0)
        if entropy > 4.65:
            raw_score += 0.15
            triggered_flags.append(f'High Shannon entropy anomaly ({entropy:.2f}) indicating obfuscation')

        # Hex / Percentage character encoding
        if features.get('has_hex_chars'):
            raw_score += 0.10
            triggered_flags.append('Hex/Percent-encoded character obfuscation found')

        # Delimiter counts
        if features.get('num_hyphens', 0) >= 4:
            raw_score += 0.10
            triggered_flags.append(f"Abnormal hyphen frequency ({features['num_hyphens']})")

        if features.get('num_dots', 0) >= 5:
            raw_score += 0.10
            triggered_flags.append(f"High dot delimiter frequency ({features['num_dots']})")

        # Absence of HTTPS encryption
        if not features.get('has_https'):
            raw_score += 0.08
            triggered_flags.append('Insecure cleartext transmission protocol (Plain HTTP)')

        # Path redirection anomaly
        if features.get('double_slash_in_path'):
            raw_score += 0.12
            triggered_flags.append('Path double-slash detected (Open redirect exploitation marker)')

        # Normalize score
        normalized_score = round(min(max(raw_score, 0.02), 0.99), 4)

        # Categorize
        if normalized_score >= 0.60:
            classification = "MALICIOUS"
            risk_level = "HIGH"
        elif normalized_score >= 0.35:
            classification = "SUSPICIOUS"
            risk_level = "MEDIUM"
        else:
            classification = "BENIGN"
            risk_level = "LOW"

        confidence = round(min(0.75 + (abs(normalized_score - 0.45) * 0.55), 0.99), 4)

        if not triggered_flags:
            triggered_flags.append('Standard legitimate lexical and structural patterns verified')

        return {
            'url': url,
            'classification': classification,
            'risk_score': normalized_score,
            'confidence': confidence,
            'risk_level': risk_level,
            'triggered_flags': triggered_flags,
            'features': features
        }
