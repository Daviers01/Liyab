const Hero = () => {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-semibold mb-4">
        🏷️ Analytics Excellence
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
        Google Tag Manager Services
      </h1>
      
      <p className="text-xl md:text-2xl text-orange-600 dark:text-orange-400 font-semibold">
        Expert GTM Setup, Audits & Consulting
      </p>
      
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Comprehensive GTM services to elevate your business&apos;s online performance. From expert setup and custom tracking to thorough audits and consulting, we optimize your data collection to deliver actionable insights that power your digital strategy.
      </p>

      <div className="flex flex-wrap gap-4 justify-center pt-6">
        <a
          href="#services"
          className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          View Services
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-600/10 font-semibold rounded-lg transition-colors duration-200"
        >
          Get a Quote
        </a>
      </div>
    </div>
  );
};

export default Hero;
