import Link from 'next/link';

const ExpertiseCard = ({ 
  title, 
  description, 
  icon, 
  link 
}: { 
  title: string; 
  description: string; 
  icon: string; 
  link?: string;
}) => {
  const content = (
    <>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">{description}</p>
      {link && (
        <div className="mt-4 text-orange-600 dark:text-orange-400 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Learn more →
        </div>
      )}
    </>
  );

  const cardClasses = "p-8 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 h-full relative overflow-hidden group";

  if (link) {
    return (
      <Link href={link} className="block h-full">
        <div className={cardClasses}>
           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            {content}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {content}
      </div>
    </div>
  );
};

const Expertise = () => {
  const expertise = [
    {
      icon: "🎯",
      title: "Advanced Data Collection",
      description: "Go beyond standard tracking. We implement custom event architectures, user properties, and enhanced ecommerce tracking to capture the behavioral data that matters to your business.",
      link: "/services/google-tag-manager"
    },
    {
      icon: "🚀",
      title: "Server-Side Tracking",
      description: "Improve data accuracy, site speed, and privacy. We set up Server-Side GTM and Facebook CAPI to bypass ad blockers and extend cookie life for better attribution.",
      link: "/services/google-tag-manager"
    },
    {
      icon: "🛡️",
      title: "Privacy & Compliance",
      description: "Navigate the complex landscape of GDPR, CCPA, and Consent Mode v2. We implement robust consent management solutions that collect data responsibly without risking fines.",
    },
    {
      icon: "📊",
      title: "Actionable Dashboards",
      description: "Data is useless if you can't read it. We connect your data sources to Looker Studio or Power BI to create real-time, automated dashboards for your stakeholders.",
    },
    {
      icon: "⚛️",
      title: "Modern Web Development",
      description: "Building scalable, performant applications with React and Next.js. Our code is optimized for SEO and data collection from the ground up.",
    },
     {
      icon: "🔌",
      title: "CRM & CDP Integration",
      description: "Unify your customer data. We integrate your analytics with CRMs (Salesforce, HubSpot) and CDPs (Segment, Tealium) for a single customer view.",
    }
  ];

  return (
    <div className="space-y-16">
      <div className="text-center space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">Data Services</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From collection to visualization, we help you build a robust data infrastructure.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {expertise.map((item, index) => (
          <ExpertiseCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Expertise;
