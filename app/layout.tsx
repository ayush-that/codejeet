import type { Metadata } from "next";
import Script from "next/script";
import { Boldonse, JetBrains_Mono, Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Toaster } from "@/components/ui/toaster";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteJsonLd, organizationJsonLd, siteNavigationJsonLd } from "@/lib/seo";
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_TYPE,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const boldonse = Boldonse({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Company-wise LeetCode Interview Questions`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: OG_TYPE,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@codejeet",
    creator: "@codejeet",
    images: [OG_IMAGE_PATH],
  },
  robots: { index: true, follow: true },
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} appearance={{ baseTheme: dark }}>
      <html lang={SITE_LANG} suppressHydrationWarning>
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
          // !pr-0 kills the scrollbar-compensation padding modals (Clerk, Radix) put on
          // <body>; the stable scrollbar gutter on <html> already reserves that space.
          className={`${openSans.variable} ${boldonse.variable} ${jetbrainsMono.variable} font-sans font-normal tracking-normal !pr-0`}
          suppressHydrationWarning
        >
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
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
