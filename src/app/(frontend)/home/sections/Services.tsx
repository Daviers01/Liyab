const Expertise = () => {
  return (
    <div className="space-y-14">
      {/* Section header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
          What is a Technical Marketer?
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
          The Gap Between Marketing and Engineering
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Great marketers know what to measure. Great developers know how to build. But when
          tracking misfires, attribution breaks, and data conflicts pile up, both teams stall.
          The missing role is the one that speaks both languages fluently.
        </p>
      </div>

      {/* Bridge illustration */}
      <div className="relative max-w-3xl mx-auto select-none py-4" aria-hidden="true">
        <div className="relative flex items-end justify-center h-52 md:h-60">

          {/* ── Left cliff: Marketing ── */}
          <div className="absolute left-0 bottom-0 w-[30%] md:w-[32%]">
            <div className="h-32 md:h-40 rounded-tr-2xl bg-gradient-to-b from-blue-500/10 to-blue-500/5 border border-blue-500/15 border-b-0 border-l-0" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-500">
                  <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
                </svg>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-500">Marketing</span>
            </div>
          </div>

          {/* ── Right cliff: Engineering ── */}
          <div className="absolute right-0 bottom-0 w-[30%] md:w-[32%]">
            <div className="h-32 md:h-40 rounded-tl-2xl bg-gradient-to-b from-violet-500/10 to-violet-500/5 border border-violet-500/15 border-b-0 border-r-0" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-violet-500">
                  <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-violet-500">Engineering</span>
            </div>
          </div>

          {/* ── Chasm ── */}
          <div className="absolute bottom-0 left-[30%] right-[30%] md:left-[32%] md:right-[32%] h-24 md:h-28 bg-gradient-to-t from-muted/30 to-transparent rounded-t-xl" />

          {/* ── The Bridge ── */}
          <div className="absolute left-[28%] right-[28%] md:left-[30%] md:right-[30%] bottom-[7.5rem] md:bottom-[9.5rem] z-10">
            <div className="h-2 rounded-full bg-gradient-to-r from-blue-500/30 via-orange-500/50 to-violet-500/30 shadow-sm" />
            <div className="absolute left-[8%] top-full w-px h-8 md:h-10 bg-gradient-to-b from-orange-500/40 to-orange-500/10" />
            <div className="absolute right-[8%] top-full w-px h-8 md:h-10 bg-gradient-to-b from-orange-500/40 to-orange-500/10" />
            <div className="absolute left-[35%] top-full w-px h-6 md:h-8 bg-gradient-to-b from-orange-500/30 to-orange-500/5" />
            <div className="absolute right-[35%] top-full w-px h-6 md:h-8 bg-gradient-to-b from-orange-500/30 to-orange-500/5" />
            <div className="absolute -top-2 left-0 right-0 h-px bg-gradient-to-r from-blue-500/15 via-orange-500/25 to-violet-500/15" />
          </div>
        </div>
      </div>

      {/* Three-column comparison */}
      <div className="grid md:grid-cols-3 gap-6">
        <article className="group p-7 rounded-2xl border border-border bg-card hover:border-blue-500/30 transition-colors duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
              <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">The Marketer</h3>
          <p className="text-muted-foreground leading-relaxed text-[15px]">
            Needs to know which campaign, keyword, and touchpoint actually drove results—but
            can&apos;t debug a broken data layer or validate server-side events.
          </p>
        </article>

        <article className="group p-7 rounded-2xl border border-border bg-card hover:border-violet-500/30 transition-colors duration-300">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-violet-500">
              <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">The Developer</h3>
          <p className="text-muted-foreground leading-relaxed text-[15px]">
            Wants the site fast, the codebase clean, and the tag container under control—but
            shouldn&apos;t have to reverse-engineer marketing requirements from a spreadsheet.
          </p>
        </article>

        <article className="group p-7 rounded-2xl border border-orange-500/30 bg-gradient-to-b from-orange-500/[0.06] to-transparent hover:border-orange-500/50 transition-colors duration-300">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center mb-5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
              <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.052.683a1 1 0 000 1.898l2.052.684a1 1 0 01.633.632l.683 2.052a1 1 0 001.898 0l.683-2.052a1 1 0 01.633-.632l2.052-.684a1 1 0 000-1.898l-2.052-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.184a1 1 0 01.632.632l.184.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.632l.551-.184a1 1 0 000-1.898l-.551-.183a1 1 0 01-.632-.633l-.184-.551z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            The Technical Marketer
            <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5 align-middle">
              Liyab Digital
            </span>
          </h3>
          <p className="text-muted-foreground leading-relaxed text-[15px]">
            Writes the custom scripts, architects the GTM containers, and wires
            cloud pipelines—so marketers get trusted data and developers keep a clean stack.
            No compromise required.
          </p>
        </article>
      </div>

      {/* Manifesto block */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-7 md:p-9 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/[0.04] to-transparent rounded-bl-full pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-500">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Operating Principle
            </p>
            <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
              Measurement should be trusted by stakeholders, respected by engineers, and
              invisible to users. The stack should capture what matters, protect privacy by
              design, and never stand in the way of results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expertise;
