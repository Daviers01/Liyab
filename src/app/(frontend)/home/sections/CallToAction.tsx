import Link from 'next/link';

const CallToAction = () => {
  return (
    <div className="relative overflow-hidden text-center space-y-8 py-16 px-6 rounded-3xl bg-card/50 border border-primary/20 backdrop-blur-sm">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Have a technical hurdle you can&apos;t clear? <br className="hidden md:block" />
          <span className="text-primary">Let&apos;s look at the code together.</span>
        </h2>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:scale-105 font-bold rounded-lg transition-all duration-300 w-full sm:w-auto"
        >
          Start a Conversation
        </Link>
        <Link
          href="#"
          className="inline-flex items-center justify-center px-8 py-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-semibold rounded-lg transition-all duration-300 w-full sm:w-auto text-center"
        >
          Download my Technical Marketing Checklist for Developers
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
