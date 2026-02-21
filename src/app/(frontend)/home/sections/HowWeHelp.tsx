import React from 'react';

const HowWeHelp = () => {
  const solutions = [
    {
      problem: '"Our GA4 data looks wrong."',
      solution: 'We perform deep-dive audits and data layer refactoring to ensure every event is tracked with 100% accuracy.'
    },
    {
      problem: '"Third-party tags are slowing down my site."',
      solution: 'We implement Server-Side GTM to move the processing load off the user\'s browser and onto the cloud.'
    },
    {
      problem: '"We have data, but no insights."',
      solution: 'We build custom pipelines connecting your website to BigQuery and AI tools for advanced prediction.'
    },
    {
      problem: '"Tracking is breaking our privacy compliance."',
      solution: 'We architect consent-mode-ready implementations that respect user privacy while preserving data.'
    }
  ];

  return (
    <div className="space-y-16">
      <div className="text-center space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Problems we solve
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We fix the technical issues that break your marketing.
        </p>
      </div>

      <div className="grid gap-8 max-w-5xl mx-auto">
        {solutions.map((item, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-8 p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">The Problem</h3>
              <p className="text-xl font-medium text-foreground italic">{item.problem}</p>
            </div>
            <div className="space-y-2 relative">
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent -ml-4" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">How Liyab Digital Fixes It</h3>
              <p className="text-muted-foreground leading-relaxed">{item.solution}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowWeHelp;
