import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A.R.C.U.S. — Automated Risk & Cyber URL Scanner',
  description: 'AI-Powered Phishing and Malicious URL Scanner with Java Spring Boot and Python Microservices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
