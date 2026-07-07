import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteJsonLd, organizationJsonLd, siteNavigationJsonLd } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codejeet.com"),
  title: {
    default: "CodeJeet - Company-wise LeetCode Interview Questions",
    template: "%s | CodeJeet",
  },
  description:
    "Browse 15,000+ company-wise LeetCode DSA interview questions from 700+ companies. " +
    "Filter by company, topic, and difficulty. Practice smarter for your next tech interview.",
  openGraph: {
    type: "website",
    siteName: "CodeJeet",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@codejeet",
    creator: "@codejeet",
  },
  robots: { index: true, follow: true },
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <JsonLd data={websiteJsonLd()} />
          <JsonLd data={organizationJsonLd()} />
          <JsonLd data={siteNavigationJsonLd()} />
          {process.env.NODE_ENV === "development" && (
            <Script
              src="//unpkg.com/react-scan/dist/auto.global.js"
              crossOrigin="anonymous"
              strategy="beforeInteractive"
            />
          )}
          {process.env.NODE_ENV === "development" && (
            <Script
              src="//unpkg.com/react-grab/dist/index.global.js"
              crossOrigin="anonymous"
              strategy="beforeInteractive"
            />
          )}
        </head>
        <body
          className={`${jakarta.variable} ${jetbrainsMono.variable} font-sans tracking-normal`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background flex flex-col">
              <div className="sticky top-0 z-50 bg-background">
                <Navbar />
              </div>
              <main className="flex-1 overflow-x-clip">{children}</main>
              <Footer />
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
