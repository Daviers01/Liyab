const Portfolio = () => {
  const solutions = [
    {
      problem: 'Our GA4 data looks wrong.',
      fix: 'We run deep-dive audits and data layer refactoring so every critical event is measured with implementation-level precision.',
    },
    {
      problem: 'Third-party tags are slowing down my site.',
      fix: 'We implement Server-Side GTM to move processing load from the browser to the cloud and protect real user performance.',
    },
    {
      problem: 'We have data, but no insights.',
      fix: 'We build custom pipelines from your website to BigQuery and AI-ready models for prediction, attribution, and decision support.',
    },
    {
      problem: 'Tracking is breaking our privacy compliance.',
      fix: 'We architect consent-mode-ready implementations that preserve measurement quality while respecting user privacy choices.',
    }
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold text-foreground">How We Help</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Problems we solve, engineered with durable systems rather than short-term patches.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px]">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-5 text-sm font-semibold text-foreground">The Problem</th>
              <th className="text-left p-5 text-sm font-semibold text-foreground">How Liyab Digital Fixes It</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((item, index) => (
              <tr key={index} className="border-t border-border align-top">
                <td className="p-5 text-foreground font-medium w-[36%]">{item.problem}</td>
                <td className="p-5 text-muted-foreground leading-relaxed">{item.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
