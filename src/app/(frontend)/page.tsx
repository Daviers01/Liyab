import type { Metadata, NextPage } from "next";
import { Hero, Expertise, Portfolio, LatestPosts, CallToAction } from "./home/sections";

export const metadata: Metadata = {
  title: "Liyab Digital - Web Development & Analytics Tagging Experts",
  description: "Expert web development and analytics team. Building modern web applications with React, Next.js, and implementing precise tracking solutions with GA4, GTM, and Tealium.",
  keywords: ["web development", "analytics tagging", "google analytics", "google tag manager", "react developer", "nextjs", "tracking implementation", "gtm specialist", "ga4", "tealium"],
  authors: [{ name: "Chan Laurente" }],
  creator: "Chan Laurente",
  publisher: "Liyab Digital",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    title: "Liyab Digital - Web Development & Analytics Tagging",
    description: "Expert web development and analytics team specializing in React, Next.js, GA4, and GTM implementations.",
    siteName: "Liyab Digital",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liyab Digital - Web Development & Analytics Tagging",
    description: "Expert web development and analytics team specializing in React, Next.js, GA4, and GTM implementations.",
  },
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
};

const HomePage: NextPage = () => {
  return (
    <div className="relative">
      {/* Gradient Orbs Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center">
        <div className="container py-20">
          <Hero />
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Expertise Section */}
      <section id="expertise" className="relative py-24">
        <div className="container">
          <Expertise />
        </div>
      </section>

      {/* Portfolio Section - Highlighted */}
      <section id="portfolio" className="relative py-24 bg-gradient-to-b from-background via-card/50 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container relative">
          <Portfolio />
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Latest Posts Section */}
      <section id="blog" className="relative py-24">
        <div className="container">
          <LatestPosts />
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Call to Action Section */}
      <section id="cta" className="relative py-24">
        <div className="container">
          <CallToAction />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
