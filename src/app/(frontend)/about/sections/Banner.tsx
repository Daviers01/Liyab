'use client';

import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-20">
      {/* Profile Image */}
      <div className="relative flex-shrink-0">
        <div className="relative w-64 h-64 lg:w-80 lg:h-80">
          {/* Glowing Ring Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 opacity-20 blur-xl" />
          
          {/* Image Container */}
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl">
            <Image
              className="object-cover"
              src="/chan-profile.png"
              alt="Chan's profile picture"
              fill
              sizes="(max-width: 768px) 256px, 320px"
              priority
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
        
        {/* Floating Badge */}
        <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-orange-500 to-amber-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
          🇵🇭 Philippines
        </div>
      </div>

      {/* Hero Text */}
      <div className="flex-1 space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Available for opportunities
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="text-foreground">Hey, I'm </span>
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Chan Laurente
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl">
          Web Developer & MarTech Engineer
          <br />
          <span className="text-lg">Building high-performance applications and bridging code with data</span>
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            Let's Connect
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a 
            href="#projects" 
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-muted hover:scale-105 transition-all"
          >
            View Projects
          </a>
          <a 
            href="https://drive.google.com/file/d/1UOVF02KuOJ5RCC4vMFDLiHlR562qg1gC/view?usp=sharing" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-muted hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download CV
          </a>
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap gap-8 pt-8 justify-center lg:justify-start">
          <div>
            <div className="text-3xl font-bold text-foreground">7+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">50+</div>
            <div className="text-sm text-muted-foreground">Projects Delivered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">10+</div>
            <div className="text-sm text-muted-foreground">Certifications</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
