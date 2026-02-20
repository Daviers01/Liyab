import Link from 'next/link';

const Hero = () => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="block text-foreground mb-2">Liyab Digital</span>
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Data Collection Experts
          </span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground max-w-4xl mx-auto">
          Turn User Interactions into <span className="text-orange-600 dark:text-orange-400 font-semibold">Actionable Data</span>
        </h2>
      </div>

      <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        We specialize in advanced tracking implementations, server-side tagging, and privacy-compliant data strategies.
        Stop guessing and start making decisions based on accurate, reliable data.
      </p>

      <div className="flex flex-wrap gap-4 justify-center pt-8">
        <a
          href="#cta"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:shadow-lg hover:scale-105 text-white font-bold rounded-lg transition-all duration-300"
        >
          Start Collecting Better Data
        </a>
        <a
          href="#expertise"
          className="inline-flex items-center gap-2 px-8 py-4 border border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/5 font-semibold rounded-lg transition-all duration-300"
        >
          View Our Services
        </a>
      </div>

      {/* Trust indicators / micro-copy for CRO */}
      <div className="pt-8 flex justify-center items-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span> GA4 & GTM Certified
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span> Privacy First
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span> Server-Side Tracking
        </div>
      </div>
    </div>
  );
};

export default Hero;
