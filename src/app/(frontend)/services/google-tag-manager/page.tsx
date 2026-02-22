import type { Metadata, NextPage } from "next";
import { Hero, Services, Process, WhyChooseUs, CTA } from "./sections";

export const metadata: Metadata = {
  title: "Google Tag Manager Services | GTM Setup, Audits & Consulting",
  description: "Expert Google Tag Manager services including setup, custom tracking, audits, and consulting. Optimize your data collection with professional GTM implementation and support.",
  keywords: ["google tag manager", "gtm setup", "gtm audit", "gtm consulting", "tag management", "gtm implementation", "custom tracking", "data layer", "gtm services"],
  authors: [{ name: "Chan Laurente" }],
  creator: "Chan Laurente",
  publisher: "Liyab Digital",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Google Tag Manager Services | Expert GTM Setup & Consulting",
    description: "Professional Google Tag Manager services: setup, audits, custom tracking, and ongoing support. Elevate your data collection strategy.",
    siteName: "Liyab Digital",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GTMServicesPage: NextPage = () => {
  return (
    <div className="relative">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container">
          <Hero />
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-16 md:py-24">
        <div className="container">
          <Services />
        </div>
      </section>

      {/* Process */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-card/30 to-background">
        <div className="container">
          <Process />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-16 md:py-24">
        <div className="container">
          <WhyChooseUs />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24">
        <div className="container">
          <CTA />
        </div>
      </section>
    </div>
  );
};

export default GTMServicesPage;
