"use client";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const HomeClient = dynamic(() => import("./HomeClient"), { ssr: false });

export const metadata: Metadata = {
  title: "Bridge2Us - Long Distance Relationship Companion",
  description: "Stay connected with your partner across time zones. Countdown to meetups, sync calendars, share music, and bridge the distance together with our comprehensive long-distance relationship app.",
  keywords: [
    "long distance relationship",
    "couples app",
    "timezone management",
    "calendar sync",
    "meetup countdown",
    "relationship app",
    "long distance couples"
  ],
  openGraph: {
    title: "Bridge2Us - Long Distance Relationship Companion",
    description: "Stay connected with your partner across time zones. Countdown to meetups, sync calendars, share music, and bridge the distance together.",
    url: "https://www.bridge2us.app",
    siteName: "Bridge2Us",
    images: [
      {
        url: "https://www.bridge2us.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bridge2Us - Long Distance Relationship App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bridge2Us - Long Distance Relationship Companion",
    description: "Stay connected with your partner across time zones. Countdown to meetups, sync calendars, share music, and bridge the distance together.",
    images: ["https://www.bridge2us.app/twitter-image.png"],
  },
  alternates: {
    canonical: "https://www.bridge2us.app",
  },
};

export default function Home(){ 
  return <HomeClient/>; 
}
