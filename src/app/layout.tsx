import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/app/providers";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ec4899" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export const metadata: Metadata = (() => {
  try {
    return {
      title: {
        default: "Bridge2Us - Long Distance Relationship Companion",
        template: "%s | Bridge2Us"
      },
      description: "Stay connected with your partner across time zones. Countdown to meetups, sync calendars, share music, and bridge the distance together with our comprehensive long-distance relationship app.",
      keywords: [
        "long distance relationship",
        "couples app",
        "timezone management",
        "calendar sync",
        "meetup countdown",
        "relationship app",
        "long distance couples",
        "time zone converter",
        "shared calendar",
        "relationship tools",
        "couple communication",
        "distance relationship",
        "LDR app",
        "relationship management"
      ],
      authors: [{ name: "Bridge2Us Team" }],
      creator: "Bridge2Us",
      publisher: "Bridge2Us",
      category: "Lifestyle",
      classification: "Relationship App",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: "https://www.bridge2us.app",
        languages: {
          'en-US': '/en',
          'es-ES': '/es',
        },
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://www.bridge2us.app",
        siteName: "Bridge2Us",
        title: "Bridge2Us - Long Distance Relationship Companion",
        description: "Stay connected with your partner across time zones. Countdown to meetups, sync calendars, share music, and bridge the distance together.",
        images: [
          {
            url: "https://www.bridge2us.app/og-image.png",
            width: 1200,
            height: 630,
            alt: "Bridge2Us - Long Distance Relationship App",
            type: "image/png",
          },
          {
            url: "https://www.bridge2us.app/og-image-square.png",
            width: 600,
            height: 600,
            alt: "Bridge2Us App Icon",
            type: "image/png",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@bridge2us",
        creator: "@bridge2us",
        title: "Bridge2Us - Long Distance Relationship Companion",
        description: "Stay connected with your partner across time zones. Countdown to meetups, sync calendars, share music, and bridge the distance together.",
        images: ["https://www.bridge2us.app/twitter-image.png"],
      },
      other: {
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        "apple-mobile-web-app-title": "Bridge2Us",
        "mobile-web-app-capable": "yes",
        "msapplication-TileColor": "#ec4899",
        "msapplication-TileImage": "/ms-icon-144x144.png",
        "msapplication-config": "/browserconfig.xml",
        "theme-color": "#ec4899",
        "color-scheme": "light dark",
      },
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      manifest: "/manifest.json",
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Bridge2Us",
        startupImage: [
          {
            url: "/apple-touch-startup-image-768x1004.png",
            media: "(device-width: 768px) and (device-height: 1024px)",
          },
          {
            url: "/apple-touch-startup-image-1536x2008.png",
            media: "(device-width: 1536px) and (device-height: 2008px)",
          },
        ],
      },
      icons: {
        icon: [
          { url: "/favicon.ico", sizes: "any" },
          { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
          { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
      },
      verification: {
        google: "your-google-verification-code",
        yandex: "your-yandex-verification-code",
        yahoo: "your-yahoo-verification-code",
      },
    };
  } catch (error) {
    // Fallback to minimal metadata if anything fails
    return {
      title: "Bridge2Us",
      description: "Long Distance Relationship Companion",
    };
  }
})();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="application-name" content="Bridge2Us" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bridge2Us" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Bridge2Us",
              "description": "Long Distance Relationship Companion App",
              "url": "https://www.bridge2us.app",
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Bridge2Us"
              },
              "screenshot": "https://www.bridge2us.app/screenshot.png",
              "softwareVersion": "1.0.0",
              "featureList": [
                "Time zone management",
                "Calendar synchronization",
                "Meetup countdown",
                "Shared journaling",
                "Music sharing",
                "Partner communication"
              ]
            })
          }}
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://vercel.live" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//vercel.live" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <div className="min-h-full bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <Header />
            {children}
          </div>
          <div id="overlay-root"></div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
