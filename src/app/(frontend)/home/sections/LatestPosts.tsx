import Link from 'next/link';

const LatestPosts = () => {
  const stack = ['GTM', 'GA4', 'BigQuery', 'JavaScript', 'Python'];

  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold text-foreground">From the Lab</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Technical proof from real implementations, shared in a practical format teams can use.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 p-7 rounded-xl border border-border bg-card">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
            Mini Case Study
          </p>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            How we reduced a client&apos;s tag-related latency by 40%
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-5">
            We audited legacy tags, moved execution to Server-Side GTM, and rebuilt the event model
            with a strict data layer contract. Result: faster pages, cleaner analytics, and fewer
            emergency fixes during campaign launches.
          </p>
          <Link href="/about#projects" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
            Explore technical outcomes →
          </Link>
        </article>

        <aside className="space-y-6 p-7 rounded-xl border border-border bg-card">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
              The Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-orange-500/20 bg-orange-500/5">
            <p className="text-sm font-semibold text-foreground mb-2">Helpful Tool</p>
            <p className="text-sm text-muted-foreground mb-3">
              Build cleaner implementation plans before you deploy new events.
            </p>
            <Link href="/posts" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
              Check the GTM Data Layer Generator →
            </Link>
          </div>
        </aside>
      </div>

      <div className="flex justify-end">
        <Link href="/posts" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
          Visit The Journal →
        </Link>
      </div>
    </div>
  );
};

export default LatestPosts;
