import type { Metadata, NextPage } from "next";
import { About, Banner, Certifications, Contact, Experiences, Projects, Skills } from "./sections";

export const metadata: Metadata = {
  title: "Chan Laurente | Web Developer & MarTech Engineer",
  description: "Experienced Web Developer and MarTech Engineer with 7+ years building high-performance web applications and implementing analytics solutions. Specialized in React, Next.js, and marketing technology platforms.",
  keywords: ["web developer", "martech engineer", "react developer", "nextjs", "analytics", "google analytics", "tealium", "javascript", "typescript", "portfolio"],
  authors: [{ name: "Chan Laurente" }],
  creator: "Chan Laurente",
  publisher: "Chan Laurente",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com/about",  
    title: "Chan Laurente | Web Developer & MarTech Engineer",
    description: "Experienced Web Developer and MarTech Engineer with 7+ years building high-performance web applications and implementing analytics solutions.",
    siteName: "Chan Laurente Portfolio",
    images: [
      {
        url: "/chan-profile.jpg",
        width: 1200,
        height: 630,
        alt: "Chan Laurente - Web Developer & MarTech Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chan Laurente | Web Developer & MarTech Engineer",
    description: "Experienced Web Developer and MarTech Engineer with 7+ years of experience",
    images: ["/chan-profile.jpg"],
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

const Home: NextPage = (_props) => {
  return (
    <div className="relative">
      {/* Gradient Orbs Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero/Banner Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center">
        <div className="container py-20">
          <Banner />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24">
        <div className="container">
          <About />
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Skills Section */}
      <section id="skills" className="relative py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-8">Skills & Technologies</h2>
          <Skills />
        </div>
      </section>

      {/* Projects Section - Highlighted */}
      <section id="projects" className="relative py-24 bg-gradient-to-b from-background via-card/50 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container relative">
          <h2 className="text-3xl font-bold text-foreground mb-8">Recent Projects</h2>
          <Projects />
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Experience & Certifications Section */}
      <section id="experience" className="relative py-24">
        <div className="container">
          <div className="space-y-24">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Professional Experience</h2>
              <Experiences />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Education & Certifications</h2>
              <Certifications />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - CTA Style */}
      <section id="contact" className="relative py-24 bg-gradient-to-br from-orange-500/5 via-background to-amber-500/5">
        <div className="container">
          <Contact />
        </div>
      </section>
    </div>
  );
};

export default Home;
