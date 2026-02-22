const Hero = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
      {/* Left — Messaging */}
      <div className="space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/5 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 dark:text-orange-400">
            Technical Marketing Partner
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
          Your tracking is leaking revenue.{' '}
          <span className="text-orange-600 dark:text-orange-400">We fix the pipes.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
          Misattributed conversions, bloated tag containers, and broken data layers cost more
          than bad creative ever will. Liyab Digital engineers the measurement infrastructure
          that makes every marketing dollar accountable—GTM, GA4, Server-Side Tagging,
          and BigQuery pipelines built to spec.
        </p>

        {/* Social proof line */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500 shrink-0">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
          <span>Trusted by marketing and engineering teams across e-commerce, SaaS, and enterprise.</span>
        </div>

        <div className="flex flex-wrap gap-4 pt-1">
          <a
            href="#cta"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30"
          >
            Request a Technical Audit
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="#blueprint"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-foreground hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-orange-400 font-semibold rounded-lg transition-all duration-200"
          >
            See How It Works
          </a>
        </div>
      </div>

      {/* Right — Data flow diagram */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-7 md:p-9 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="flex items-center justify-between mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Signal Architecture
          </p>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2.5 py-0.5">
            Live
          </span>
        </div>

        <div className="space-y-4">
          {/* Layer 1 — Collection */}
          <div className="p-4 rounded-xl border border-border bg-background flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-500">
                <path d="M1 4.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 2H3.25A2.25 2.25 0 001 4.25zM1 7.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 5H3.25A2.25 2.25 0 001 7.25zM7 8a1 1 0 000 2h6a1 1 0 100-2H7zM2 9.75C2 8.784 2.784 8 3.75 8h12.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0116.25 17H3.75A1.75 1.75 0 012 15.25v-5.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Data Layer &amp; Event Collection</p>
              <p className="text-xs text-muted-foreground">Page views, conversions, custom events</p>
            </div>
          </div>

          {/* Connector */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-3 bg-orange-500/40" />
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500/60">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Layer 2 — Processing */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-border bg-background flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Consent Mode v2</p>
                <p className="text-xs text-muted-foreground">Privacy-safe signals</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-violet-500">
                  <path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234z" />
                  <path fillRule="evenodd" d="M4 13a2 2 0 100 4h12a2 2 0 100-4H4zm11.24 2a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Server-Side GTM</p>
                <p className="text-xs text-muted-foreground">Cloud-processed tags</p>
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-3 bg-orange-500/40" />
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500/60">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Layer 3 — Destination */}
          <div className="p-4 rounded-xl border border-orange-500/25 bg-gradient-to-r from-orange-500/5 to-amber-500/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
                  <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.052.683a1 1 0 000 1.898l2.052.684a1 1 0 01.633.632l.683 2.052a1 1 0 001.898 0l.683-2.052a1 1 0 01.633-.632l2.052-.684a1 1 0 000-1.898l-2.052-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.184a1 1 0 01.632.632l.184.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.632l.551-.184a1 1 0 000-1.898l-.551-.183a1 1 0 01-.632-.633l-.184-.551z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  GA4 + BigQuery + AI-Ready Pipelines
                </p>
                <p className="text-xs text-muted-foreground">Verified, enriched, decision-ready data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
