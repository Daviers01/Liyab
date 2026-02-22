import Link from 'next/link';

const CTA = () => {
  return (
    <div
      id="contact"
      className="relative max-w-4xl mx-auto rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.06] via-amber-500/[0.04] to-transparent p-10 md:p-14 overflow-hidden"
    >
      {/* Decorative glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
          Let&apos;s Talk
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Ready to Fix Your Tag Management?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Whether you need a fresh GTM setup, an audit of an existing container, or
          server-side tagging—reach out and let&apos;s scope it together.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <a
            href="https://www.facebook.com/liyabdigitalph"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-orange-600/20"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
              <path d="M19 8.839l-7.616 3.808a2.75 2.75 0 01-2.768 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
            </svg>
            Get Started
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-border hover:border-orange-500/40 text-foreground hover:text-orange-600 dark:hover:text-orange-400 font-semibold rounded-xl transition-colors duration-200"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
