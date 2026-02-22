const steps = [
  {
    number: '01',
    title: 'Discovery & Audit',
    description:
      'I map your current tracking landscape—what fires, what doesn\'t, and what\'s missing. You get a clear picture of your container health before anything changes.',
  },
  {
    number: '02',
    title: 'Architecture & Planning',
    description:
      'Based on your goals, I design the data layer schema, tag strategy, and naming conventions. Everything is documented before implementation begins.',
  },
  {
    number: '03',
    title: 'Implementation',
    description:
      'Tags, triggers, and variables are built in a structured workspace with full version control. Each component is tested in Preview mode before publishing.',
  },
  {
    number: '04',
    title: 'Validation & Handoff',
    description:
      'End-to-end QA across devices and browsers. You receive documentation, a container changelog, and a walkthrough—so your team owns it going forward.',
  },
];

const Process = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
          How It Works
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          A Structured Process, Not Guesswork
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Every GTM engagement follows a repeatable methodology that keeps scope
          tight, timelines clear, and outcomes measurable.
        </p>
      </div>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[1.6rem] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/30 via-orange-500/15 to-transparent hidden sm:block" />

        <div className="space-y-8 md:space-y-12">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={step.number}
                className={`relative flex flex-col sm:flex-row items-start gap-5 md:gap-10 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Number badge */}
                <div className="shrink-0 z-10 sm:absolute sm:left-[1.6rem] sm:-translate-x-1/2 md:left-1/2">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`sm:ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${
                    isEven ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4'
                  }`}
                >
                  <div className="p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Process;
