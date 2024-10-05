import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InferenceProvider } from '@/contexts/InferenceContext';
import { ConfettiProvider } from '@/contexts/ConfettiContext';
import ConfettiCanvas from '@/components/patterns/Confetti/ConfettiCanvas'; // Corrected import path

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
        <InferenceProvider> 
          <ConfettiProvider> 
            {children}
            <ConfettiCanvas /> {/* Ensure ConfettiCanvas is included here */}
          </ConfettiProvider>
        </InferenceProvider>
      </body>
    </html>
  );
}