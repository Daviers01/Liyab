const CallToAction = () => {
  return (
    <div className="text-center space-y-6 py-12 px-6 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/20">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
        Let's Work Together
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Need help with web development or analytics implementation? Let's discuss how we can help bring your project to life.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="https://www.facebook.com/liyabdigitalph"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Get in Touch
        </a>
        <a
          href="/about"
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-600/10 font-semibold rounded-lg transition-colors duration-200"
        >
          Learn More About Me
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
