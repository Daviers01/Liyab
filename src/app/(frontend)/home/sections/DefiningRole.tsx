import React from 'react';

const DefiningRole = () => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The Gap I Bridge</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Many clients don&apos;t know they need a technical marketer until you explain it.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-card p-8 rounded-lg border border-border space-y-4">
          <h3 className="text-xl font-semibold">The Marketer</h3>
          <p className="text-muted-foreground">
            Wants to know which ad worked.
          </p>
        </div>
        <div className="bg-card p-8 rounded-lg border border-border space-y-4">
          <h3 className="text-xl font-semibold">The Developer</h3>
          <p className="text-muted-foreground">
            Wants the site to load fast and the code to stay clean.
          </p>
        </div>
        <div className="bg-primary/5 p-8 rounded-lg border border-primary/20 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-8 -mt-8" />
          <h3 className="text-xl font-semibold text-primary">The Technical Marketer (Liyab Digital)</h3>
          <p className="text-muted-foreground">
            Writes the custom scripts and configures the servers to make both happen without compromise.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DefiningRole;
