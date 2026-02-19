'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
        className,
      )}
      ref={card.ref}
    >
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        {/* Image Section */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
          {!metaImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-muted-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {metaImage && typeof metaImage !== 'string' && (
            <div className="group-hover:scale-105 transition-transform duration-300">
              <Media resource={metaImage} size="33vw" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative p-6 space-y-4">
          {/* Categories */}
          {showCategories && hasCategories && (
            <div className="flex flex-wrap gap-2">
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category
                  const categoryTitle = titleFromCategory || 'Untitled'

                  return (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    >
                      {categoryTitle}
                    </span>
                  )
                }
                return null
              })}
            </div>
          )}

          {/* Title */}
          {titleToUse && (
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              <Link href={href} ref={link.ref} className="hover:no-underline">
                {titleToUse}
              </Link>
            </h3>
          )}

          {/* Description */}
          {description && (
            <p className="text-muted-foreground line-clamp-3 leading-relaxed">
              {sanitizedDescription}
            </p>
          )}

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
            <span>Read article</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  )
}
