import Link from 'next/link';

const CallToAction = () => {
  return (
    <div className="relative overflow-hidden text-center space-y-8 py-16 px-6 rounded-3xl bg-card/50 border border-orange-500/20 backdrop-blur-sm">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">Transform Your Data?</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Don&apos;t let valuable insights slip away. Let&apos;s build a custom data strategy that drives growth, improves ROI, and ensures compliance.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap gap-4 justify-center pt-4">
        <a
          href="https://www.facebook.com/liyabdigitalph"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:shadow-lg hover:scale-105 text-white font-bold rounded-lg transition-all duration-300"
        >
          Book a Strategy Call
        </a>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-8 py-4 border border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/5 font-semibold rounded-lg transition-all duration-300"
        >
          Learn About Our Process
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
