'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utilities/ui';

interface Project {
  id: string;
  title: string;
  description?: string;
  image: string;
  url: string;
  tags?: string[];
  category?: 'client' | 'personal';
  outcome?: string;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const { title, image, url, tags, description, category, outcome } = project;

  return (
    <div className={cn('flex flex-col gap-6 group', className)}>
      {/* Project Image */}
      <Link href={url} target="_blank" rel="noopener noreferrer">
        <div className="relative overflow-hidden rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 border-b border-border/50">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-colors"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-500 transition-colors"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/80 group-hover:bg-green-500 transition-colors"></div>
            </div>
          </div>
          
          {/* Project Screenshot */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </Link>
      
      {/* Project Info */}
      <div className="flex-1 space-y-3">
        {/* Category Badge */}
        {category && (
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-xs px-2.5 py-1 rounded-full font-medium',
              category === 'client' 
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            )}>
              {category === 'client' ? '💼 Client Work' : '🚀 Pet Project'}
            </span>
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        )}
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Outcome */}
        {outcome && (
          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium flex items-center gap-2">
            <span>✓</span> {outcome}
          </p>
        )}
        
        {/* Link */}
        <Link 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium transition-colors"
        >
          Visit Site <span>→</span>
        </Link>
      </div>
    </div>
  );
};
