import { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { generateBaseMetadata } from "@/lib/seo";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

// Google Fonts with system fallbacks
const appSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

const appMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

// Base metadata for all pages
export const metadata: Metadata = {
  ...generateBaseMetadata(),
  title: {
    default: "CodeJeet - Master Coding Interviews with 8000+ Company-Wise Questions",
    template: "%s | CodeJeet",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

          {/* DNS prefetch for LeetCode links */}
          <link rel="dns-prefetch" href="https://leetcode.com" />
        </head>
        <body
          className={`${appSans.variable} ${appMono.variable} font-sans`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
