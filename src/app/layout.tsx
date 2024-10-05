import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InferenceProvider } from '@/contexts/InferenceContext'; // Import InferenceProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PolyGene",
  description: "AI Biotech Model",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InferenceProvider> {/* Wrap with InferenceProvider */}
          {children}
        </InferenceProvider>
      </body>
    </html>
  );
}