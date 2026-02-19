import Link from 'next/link';

type PostCardProps = {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
};

const PostCard = ({ title, excerpt, slug, date }: PostCardProps) => {
  return (
    <Link href={`/posts/${slug}`}>
      <div className="group p-6 rounded-lg border border-border bg-card hover:border-orange-500/50 transition-all duration-300 h-full hover:shadow-lg hover:shadow-orange-500/10">
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">{date}</div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed line-clamp-3">
            {excerpt}
          </p>
          <div className="text-orange-600 dark:text-orange-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Read more →
          </div>
        </div>
      </div>
    </Link>
  );
};

const LatestPosts = () => {
  // This will be replaced with actual blog posts from your CMS
  const posts = [
    {
      title: "Setting Up Google Analytics 4 with Next.js",
      excerpt: "A comprehensive guide to implementing GA4 in your Next.js application with proper event tracking and custom dimensions.",
      slug: "ga4-nextjs-setup",
      date: "February 15, 2026"
    },
    {
      title: "Advanced GTM Strategies for E-commerce Tracking",
      excerpt: "Learn how to implement enhanced e-commerce tracking using Google Tag Manager with proper data layer architecture.",
      slug: "gtm-ecommerce-tracking",
      date: "February 10, 2026"
    },
    {
      title: "Building Performant React Applications",
      excerpt: "Best practices for optimizing React apps: code splitting, lazy loading, memoization, and performance monitoring.",
      slug: "react-performance-optimization",
      date: "February 5, 2026"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Latest Posts</h2>
          <p className="text-xl text-muted-foreground">
            Insights and tutorials on web development and analytics
          </p>
        </div>
        <Link 
          href="/posts"
          className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
        >
          View all posts →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </div>
  );
};

export default LatestPosts;
