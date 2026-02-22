const Hero = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
          Tag Management &amp; Data Architecture
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
          Google Tag Manager{' '}
          <span className="text-orange-600 dark:text-orange-400">Done Right</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Most GTM containers are a mess of duplicated tags, broken triggers, and mystery
          variables nobody dares touch. I architect clean, scalable setups that marketing
          trusts and engineering respects—so every event fires with purpose and every
          data point earns its place.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-orange-600/20"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
            </svg>
            Explore Services
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-border hover:border-orange-500/40 text-foreground hover:text-orange-600 dark:hover:text-orange-400 font-semibold rounded-xl transition-colors duration-200"
          >
            Request an Audit
          </a>
        </div>
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-4">
        {[
          { icon: 'M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z', label: 'Server-side & Web containers' },
          { icon: 'M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z', label: 'Custom templates & variables' },
          { icon: 'M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z', label: 'Privacy-first by design' },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500 shrink-0">
              <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
            </svg>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Hero;
