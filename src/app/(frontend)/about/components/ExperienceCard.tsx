'use client';

import { cn } from '@/utilities/ui';

interface ExperienceCardProps {
  name: string;
  image: string;
  role: string[];
  date: string;
  subsidiary?: string;
  className?: string;
  isLast?: boolean;
}

export const ExperienceCard = ({ 
  name, 
  image: _image, 
  role, 
  date, 
  subsidiary,
  className: _className,
  isLast: _isLast = false
}: ExperienceCardProps) => {
  // Extract year from date string (assuming format like "July 2024 - Present" or "September 2021 - June 2024")
  const getYear = (dateString: string) => {
    const match = dateString.match(/\b(\d{4})\b/);
    return match ? match[1] : '';
  };

  const year = getYear(date);
  const isCurrent = date.toLowerCase().includes('present');

  return (
    <div className="relative flex gap-12 items-start">
      {/* Year - Left Side */}
      <div className="w-24 flex-shrink-0 text-right pt-1">
        <span className={cn(
          "text-5xl font-bold",
          isCurrent ? "text-primary" : "text-foreground"
        )}>{year}</span>
      </div>

      {/* Spacer for alignment (no dot) */}
      <div className="relative flex-shrink-0 w-0" />

      {/* Content Card */}
      <div className="flex-1 pb-4">
        <div className="pb-6 border-b border-border/50">
          <div className="flex flex-col gap-4">
            {/* Company Name & Subsidiary */}
            <div>
              <h4 className="text-xl font-bold text-foreground">
                {name}
                {subsidiary && (
                  <span className="block text-sm text-muted-foreground font-normal mt-1">
                    {subsidiary}
                  </span>
                )}
              </h4>
            </div>

            {/* Roles with Progression Indicators */}
            <div className="space-y-3">
              {role.map((r, index) => (
                <div key={index}>
                  {index > 0 && (
                    <div className="flex items-center justify-center my-1">
                      <svg className="w-3 h-3 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      index === 0 ? "bg-primary/20 text-primary ring-2 ring-primary/30" : "bg-muted text-muted-foreground"
                    )}>
                      {role.length - index}
                    </div>
                    <p className={cn(
                      "text-sm font-medium flex-1 pt-0.5",
                      index === 0 ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}>
                      {r}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Date Range */}
            <p className="text-sm text-muted-foreground/70 italic">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
