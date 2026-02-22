import Link from 'next/link';

const CallToAction = () => {
  return (
    <div className="space-y-8 py-12 px-6 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/20">
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Liyab?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Liyab means &quot;to blaze&quot; or &quot;to ignite.&quot; In digital marketing, data can feel
          dark and confusing. We provide the spark that illuminates performance, turning
          guessing into knowing.
        </p>
      </div>

      <div className="text-center space-y-5">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
          Have a technical hurdle you can&apos;t clear? Let&apos;s look at the code together.
        </h3>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://www.facebook.com/liyabdigitalph"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Start a Conversation
          </a>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-600/10 font-semibold rounded-lg transition-colors duration-200"
          >
            Download Technical Marketing Checklist
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
