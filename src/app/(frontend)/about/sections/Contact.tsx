const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          <span className="text-foreground">Let's Work </span>
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Together
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          I'm currently open for website-related gigs and exciting projects. 
          Drop me a message and let's create something amazing!
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Email Card */}
        <a 
          href="mailto:daviers01@gmail.com"
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-all hover:shadow-lg"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative space-y-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Me</h3>
              <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                daviers01@gmail.com
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
              <span>Send a message</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </a>

        {/* Location Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl" />
          <div className="relative space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Location</h3>
              <p className="text-lg font-semibold text-foreground">
                Philippines 🇵🇭
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Available for remote work worldwide
            </p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <a 
          href="mailto:daviers01@gmail.com"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send Email
        </a>
        <a 
          href="https://drive.google.com/file/d/1UOVF02KuOJ5RCC4vMFDLiHlR562qg1gC/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border rounded-xl font-semibold hover:bg-muted hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download CV
        </a>
      </div>

      {/* Social Links */}
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Connect with me</p>
        <div className="flex gap-4">
          <a 
            href="https://linkedin.com/in/yourprofile" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:scale-110 transition-all"
            aria-label="LinkedIn"
          >
            <svg className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a 
            href="https://github.com/Daviers01" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:scale-110 transition-all"
            aria-label="GitHub"
          >
            <svg className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a 
            href="https://www.facebook.com/liyabdigitalph" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:scale-110 transition-all"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
