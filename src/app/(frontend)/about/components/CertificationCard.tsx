'use client';

import Image from 'next/image';
import { cn } from '@/utilities/ui';

interface CertificationCardProps {
  name: string;
  image: string;
  role: string[];
  date?: string;
  subsidiary?: string;
  className?: string;
}

export const CertificationCard = ({ 
  name, 
  image, 
  role, 
  date, 
  subsidiary,
  className 
}: CertificationCardProps) => {
  return (
    <div
      className={cn(
        'group rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm p-6 transition-all hover:shadow-xl hover:border-primary/50',
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Logo */}
        <div className="relative h-16 w-full flex items-center justify-center border border-border rounded-md p-3">
          <Image
            src={image}
            alt={name}
            width={120}
            height={48}
            className="object-contain max-h-full max-w-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Name & Subsidiary */}
        <div>
          <h4 className="text-lg font-bold text-foreground">
            {name}
            {subsidiary && (
              <span className="block text-xs text-muted-foreground font-normal mt-1">
                {subsidiary}
              </span>
            )}
          </h4>
        </div>

        {/* Credentials/Courses */}
        <div className="space-y-2">
          {role.map((r, index) => (
            <p key={index} className="text-sm text-muted-foreground font-medium">
              • {r}
            </p>
          ))}
        </div>

        {/* Date */}
        {date && (
          <p className="text-sm text-muted-foreground/80 italic">{date}</p>
        )}
      </div>
    </div>
  );
};
