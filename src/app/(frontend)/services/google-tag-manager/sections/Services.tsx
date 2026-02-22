const ServiceCard = ({
  icon,
  title,
  description,
  highlights,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
}) => {
  return (
    <article className="group p-7 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 flex flex-col">
      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 group-hover:bg-orange-500/15 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed text-[15px] mb-4">
        {description}
      </p>
      <ul className="mt-auto space-y-1.5">
        {highlights.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
};

const services = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Container Architecture & Setup',
    description:
      'Clean-slate container design or restructuring existing chaos. I build a maintainable foundation with naming conventions, folder organization, and workspace strategy.',
    highlights: ['Web & server-side containers', 'Workspace governance', 'Naming & folder conventions'],
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path d="M4.75 3A1.75 1.75 0 003 4.75v2.752l.104-.002h13.792c.035 0 .07 0 .104.002V4.75A1.75 1.75 0 0015.25 3H4.75zM18 10.748a1.534 1.534 0 00-.104.002H2.104A1.534 1.534 0 002 10.748v.007a1.004 1.004 0 001.066.991 2.752 2.752 0 012.585 1.752c.3.665-.1 1.423-.823 1.523A1 1 0 004 16.004v.246A1.75 1.75 0 005.75 18h8.5A1.75 1.75 0 0016 16.25v-.246a1 1 0 00-.828-.978c-.724-.1-1.123-.858-.823-1.523a2.752 2.752 0 012.585-1.752A1.004 1.004 0 0018 10.755v-.007zM2 9.25V7.497c0-.028.002-.055.004-.082h15.992A1.44 1.44 0 0118 7.497V9.25a.25.25 0 01-.25.25H2.25A.25.25 0 012 9.25z" />
      </svg>
    ),
    title: 'Tag Creation & Management',
    description:
      'From conversion pixels to custom HTML—every tag built with clear purpose, proper trigger logic, and zero redundancy.',
    highlights: ['Marketing & analytics tags', 'Custom HTML / JavaScript', 'Tag sequencing & priorities'],
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.052.683a1 1 0 000 1.898l2.052.684a1 1 0 01.633.632l.683 2.052a1 1 0 001.898 0l.683-2.052a1 1 0 01.633-.632l2.052-.684a1 1 0 000-1.898l-2.052-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.184a1 1 0 01.632.632l.184.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.632l.551-.184a1 1 0 000-1.898l-.551-.183a1 1 0 01-.632-.633l-.184-.551z" />
      </svg>
    ),
    title: 'Custom Tracking Solutions',
    description:
      'Advanced event tracking tailored to your user journeys—scroll depth, video engagement, form interactions, dynamic eCommerce, and beyond.',
    highlights: ['Enhanced eCommerce events', 'Cross-domain tracking', 'Custom event frameworks'],
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
      </svg>
    ),
    title: 'GTM Audits & Remediation',
    description:
      'Comprehensive container review—I surface duplicate tags, broken triggers, missing variables, and performance bottlenecks, then fix them.',
    highlights: ['Container health report', 'Performance optimization', 'Tag deduplication'],
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Data Layer Architecture',
    description:
      'Structured data layer design that decouples your tracking from the DOM. Clean, predictable, and ready for any analytics platform.',
    highlights: ['Schema documentation', 'Push-based event model', 'Developer-friendly specs'],
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Server-Side Tagging',
    description:
      'Move tags off the browser and onto your own cloud endpoint. Faster pages, better data quality, and full control over what leaves your domain.',
    highlights: ['GCP / Cloud Run hosting', 'First-party data control', 'Consent-mode integration'],
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
    title: 'QA & Validation',
    description:
      'Rigorous testing through Preview mode, debug consoles, and automated checks—so you never push a broken tag to production.',
    highlights: ['Preview & Debug workflows', 'Real-time event validation', 'Regression testing'],
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
      </svg>
    ),
    title: 'Training & Consulting',
    description:
      'Hands-on coaching for your team—from GTM fundamentals to advanced custom template development. Walk away confident, not dependent.',
    highlights: ['Team workshops', 'Documentation & SOPs', 'Async support packages'],
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
      </svg>
    ),
    title: 'GA4 & Analytics Integration',
    description:
      'Seamless GA4 wiring through GTM—config tags, custom dimensions, conversion events, and audience triggers that make reporting effortless.',
    highlights: ['GA4 event mapping', 'Custom dimensions & metrics', 'Conversion tracking'],
  },
];

const Services = () => {
  return (
    <div id="services" className="space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
          What I Deliver
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          End-to-End GTM Services
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Every engagement starts with understanding your stack, your goals, and
          the delta between them. Here&apos;s what that looks like in practice.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </div>
  );
};

export default Services;
