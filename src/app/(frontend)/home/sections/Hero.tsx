import Link from 'next/link';

const Hero = () => {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
        Liyab Digital
      </h1>
      <h2 className="text-3xl md:text-4xl font-semibold text-orange-600 dark:text-orange-400">
        Web Development & Analytics Tagging 🔥
      </h2>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        Building high-performance web applications and implementing precise analytics tracking solutions.
        From React to GA4, we turn complex requirements into elegant solutions.
      </p>
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <a
          href="#portfolio"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          View Portfolio
        </a>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-600/10 font-semibold rounded-lg transition-colors duration-200"
        >
          Read Our Blog
        </Link>
      </div>
    </div>
  );
};

export default Hero;
