import React from 'react';

const Hero = () => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
          Lighting the Path Between Code and Conversions.
        </h1>
        <h2 className="text-xl md:text-2xl font-medium text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Most marketing breaks because the technical foundation is shaky. Liyab Digital specializes in the heavy lifting—GTM architecture, GA4 precision, and custom web development—so your data tells the truth.
        </h2>
      </div>

      {/* Visual Placeholder: A clean, high-tech diagram showing data flowing from a website into a structured cloud environment. */}
      <div className="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground mb-2">[Diagram Placeholder]</p>
          <div className="flex items-center justify-center gap-4 text-xs md:text-sm font-mono text-muted-foreground">
            <span>Website</span>
            <span>→</span>
            <span>Data Layer</span>
            <span>→</span>
            <span>GTM</span>
            <span>→</span>
            <span>Cloud (BigQuery/GA4)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
