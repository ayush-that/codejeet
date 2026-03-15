import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBanner from "@/components/TopBanner";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codejeet.com"),
  title: {
    default: "CodeJeet - Company-wise LeetCode Interview Questions",
    template: "%s | CodeJeet",
  },
  description:
    "Browse 17,000+ company-wise LeetCode DSA interview questions from 660+ companies. " +
    "Filter by company, topic, and difficulty. Practice smarter for your next tech interview.",
  openGraph: {
    type: "website",
    siteName: "CodeJeet",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${jakarta.variable} font-sans tracking-normal`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background flex flex-col">
            <div className="sticky top-0 z-50">
              <TopBanner />
              <Navbar />
            </div>
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
