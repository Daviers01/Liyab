const CTA = () => {
  return (
    <div id="contact" className="max-w-4xl mx-auto text-center space-y-6 py-12 px-6 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/20">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
        Ready to Optimize Your Tag Management?
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Let's discuss how we can help you implement, audit, or optimize your Google Tag Manager setup for better data collection and insights.
      </p>
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <a
          href="https://www.facebook.com/liyabdigitalph"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Get Started
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-600/10 font-semibold rounded-lg transition-colors duration-200"
        >
          View Portfolio
        </a>
      </div>
    </div>
  );
};

export default CTA;
