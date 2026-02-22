const WhyChooseUs = () => {
  const benefits = [
    {
      title: 'Proven Expertise',
      description:
        'Years of hands-on GTM work across eCommerce, SaaS, lead-gen, and publishing—from startup containers to enterprise-scale deployments.',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Data-Driven Methodology',
      description:
        'Every tag, trigger, and variable has documented purpose. No guesswork—just a structured process from discovery through validation.',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
          <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Custom, Not Cookie-Cutter',
      description:
        'Your tracking architecture is designed around your funnels, your KPIs, and your tech stack—not a template bolted onto every client.',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
          <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Ongoing Partnership',
      description:
        'Tracking requirements evolve. I provide long-term support, proactive maintenance, and priority response when your stack changes.',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
          Why Work With Me
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          The Difference Is in the Details
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Tag management is easy to set up and hard to get right. Here&apos;s why
          teams keep coming back.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="group flex gap-5 p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/15 transition-colors">
                {benefit.icon}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1.5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
