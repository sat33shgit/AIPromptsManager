import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";

import "@/app/globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers";

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "PromptVault",
  description: "AI prompt manager for creating, organizing, and sharing prompts."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${body.variable} ${display.variable} transition-colors duration-200`}>
        <Providers>
          <a
            href="#main-content"
            className="focus-ring sr-only absolute left-4 top-4 z-50 rounded-md bg-[var(--surface)] px-3 py-2 focus:not-sr-only"
          >
            Skip to main content
          </a>
          <div className="min-h-screen">
            <Header />
            <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 md:px-6">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
