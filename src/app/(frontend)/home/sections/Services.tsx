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
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
      {link && (
        <div className="mt-4 text-orange-600 dark:text-orange-400 font-semibold inline-flex items-center gap-1">
          Learn more →
        </div>
      )}
    </>
  );

  if (link) {
    return (
      <Link href={link}>
        <div className="p-6 rounded-lg border border-border bg-card hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 h-full cursor-pointer group">
          {content}
        </div>
      </Link>
    );
  }

  return (
    <div className="p-6 rounded-lg border border-border bg-card hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      {content}
    </div>
  );
};

const Expertise = () => {
  const expertise = [
    {
      icon: "⚛️",
      title: "Modern Web Development",
      description: "Expert in React, Next.js, and Node.js. Building scalable, performant applications with clean code architecture, server-side rendering, and modern development practices."
    },
    {
      icon: "📊",
      title: "Analytics Implementation",
      description: "Deep expertise in Google Analytics 4, Google Tag Manager, and Tealium. Implementing comprehensive tracking strategies that provide actionable insights for data-driven decisions.",
      link: "/services/google-tag-manager"
    },
    {
      icon: "🏷️",
      title: "Tracking & Tagging",
      description: "Custom event tracking, enhanced e-commerce tracking, cross-domain measurement, and complex tag management implementations. Making sure every interaction is captured accurately.",
      link: "/services/google-tag-manager"
    },
    {
      icon: "🎨",
      title: "UI/UX Development",
      description: "Creating responsive, accessible interfaces with Tailwind CSS, modern design systems, and component libraries. Focus on user experience and conversion optimization."
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">What We Do Best</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Specialized expertise in web development and analytics tracking
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {expertise.map((item, index) => (
          <ExpertiseCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Expertise;
