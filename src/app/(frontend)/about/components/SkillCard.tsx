'use client';

import Image from 'next/image';
import { cn } from '@/utilities/ui';

interface SkillCardProps {
  name: string;
  image: string;
  className?: string;
}

export const SkillCard = ({ name, image, className }: SkillCardProps) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-primary/50 hover:-translate-y-1',
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-16 w-16 flex items-center justify-center rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className="object-contain max-h-full max-w-full"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <p className="text-sm font-semibold text-foreground text-center group-hover:text-primary transition-colors duration-300">{name}</p>
      </div>
    </div>
  );
};
