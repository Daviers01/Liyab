import Link from 'next/link';

type PortfolioCardProps = {
  title: string;
  description: string;
  tech: string[];
  link?: string;
};

const PortfolioCard = ({ title, description, tech, link }: PortfolioCardProps) => {
  const Card = (
    <div className="group p-6 rounded-lg border border-border bg-card hover:border-orange-500/50 transition-all duration-300 h-full hover:shadow-lg hover:shadow-orange-500/10">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tech.map((t, i) => (
            <span 
              key={i} 
              className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{Card}</Link>;
  }
  
  return Card;
};

const Portfolio = () => {
  const projects = [
    {
      title: "E-commerce Analytics Platform",
      description: "Implemented comprehensive tracking solution for a major e-commerce site using GA4 and GTM. Custom event tracking, enhanced e-commerce tracking, and custom reporting dashboard.",
      tech: ["GA4", "GTM", "BigQuery", "Data Studio", "JavaScript"],
    },
    {
      title: "Next.js SaaS Application",
      description: "Built a full-stack SaaS platform with authentication, payment integration, and real-time features. Optimized for performance with SSR and ISR strategies.",
      tech: ["Next.js", "React", "Node.js", "Payload CMS", "Stripe"],
    },
    {
      title: "Cross-Domain Tracking Implementation",
      description: "Implemented complex cross-domain tracking setup for multi-brand company with unified analytics across 5+ domains. Custom tag architecture in Tealium.",
      tech: ["Tealium", "GA4", "Custom JavaScript", "Cookie Management"],
    },
    {
      title: "Marketing Attribution Platform",
      description: "Developed custom attribution modeling solution integrating data from multiple marketing channels. Real-time dashboard with conversion tracking and ROI analysis.",
      tech: ["React", "Node.js", "PostgreSQL", "GTM", "GA4 API"],
    }
  ];

  return (
    <div id="portfolio" className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Featured Work</h2>
          <p className="text-xl text-muted-foreground">
            Real-world projects showcasing web development and analytics expertise
          </p>
        </div>
        <Link 
          href="/about#projects"
          className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
        >
          View all projects →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <PortfolioCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
