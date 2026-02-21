import React from 'react';
import Link from 'next/link';

const TechnicalProof = () => {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">From the Lab</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Since you don&apos;t want to &quot;sell,&quot; let your expertise do the talking.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              Mini-Case Study
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              How we reduced a client&apos;s tag-related latency by 40%.
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              By auditing the tag firing rules and implementing server-side GTM, we moved heavy third-party scripts off the main thread, resulting in a significant boost to Core Web Vitals and conversion rates.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">The Tech Stack</h4>
            <div className="flex flex-wrap gap-3">
              {['GTM', 'GA4', 'BigQuery', 'JavaScript', 'Python'].map((tech) => (
                <div
                  key={tech}
                  className="px-3 py-1 bg-muted/50 rounded-md font-mono text-sm border border-border text-foreground"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/30 p-6 rounded-lg border border-border/50">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="text-primary">🛠️</span> Helpful Tool
                </h4>
                <p className="text-sm text-muted-foreground">
                  Check out my free GTM Data Layer Generator (or a link to a technical blog post).
                </p>
              </div>
              <Link
                href="/posts"
                className="whitespace-nowrap inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                View Tool
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalProof;
