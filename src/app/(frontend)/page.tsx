import type { Metadata, NextPage } from "next";
import { Hero, DefiningRole, HowWeHelp, TechnicalProof, Philosophy, CallToAction } from "./home/sections";

export const metadata: Metadata = {
  title: "Liyab Digital - Lighting the Path Between Code and Conversions",
  description: "Most marketing breaks because the technical foundation is shaky. Liyab Digital specializes in the heavy lifting—GTM architecture, GA4 precision, and custom web development—so your data tells the truth.",
  keywords: ["technical marketing", "GTM architecture", "GA4", "web development", "data layer", "server-side tagging", "privacy compliance"],
  authors: [{ name: "Chan Laurente" }],
  creator: "Chan Laurente",
  publisher: "Liyab Digital",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://liyabdigital.com",
    title: "Liyab Digital - Technical Marketing & Web Development",
    description: "Lighting the Path Between Code and Conversions.",
    siteName: "Liyab Digital",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liyab Digital - Technical Marketing & Web Development",
    description: "Lighting the Path Between Code and Conversions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const HomePage: NextPage = () => {
  return (
    <div className="relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[80vh] flex items-center pt-20 pb-16">
        <div className="container">
          <Hero />
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Defining the Role */}
      <section id="role" className="relative py-24">
        <div className="container">
          <DefiningRole />
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* How We Help */}
      <section id="how-we-help" className="relative py-24">
        <div className="container">
          <HowWeHelp />
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Technical Proof (From the Lab) */}
      <section id="lab" className="relative py-24 bg-muted/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container relative">
          <TechnicalProof />
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Philosophy */}
      <section id="philosophy" className="relative py-24">
        <div className="container">
          <Philosophy />
        </div>
      </section>

      {/* Call To Action */}
      <section id="cta" className="relative py-24">
        <div className="container">
          <CallToAction />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
