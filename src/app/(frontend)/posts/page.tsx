import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="relative">
      <PageClient />
      
      {/* Gradient Orbs Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Blogs
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Thoughts, tutorials, and insights on web development, MarTech, and everything in between.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">{posts.totalDocs}</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative py-16">
        <div className="container">
          <div className="mb-6">
            <PageRange
              collection="posts"
              currentPage={posts.page}
              limit={12}
              totalDocs={posts.totalDocs}
            />
          </div>

          <CollectionArchive posts={posts.docs} />

          {posts.totalPages > 1 && posts.page && (
            <div className="mt-12">
              <Pagination page={posts.page} totalPages={posts.totalPages} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Blogs | Chan Laurente - Web Developer & MarTech Engineer',
    description: 'Read insights, tutorials, and thoughts on web development, React, Next.js, MarTech, analytics, and modern web technologies.',
    keywords: ['blog', 'web development', 'martech', 'react', 'nextjs', 'tutorials', 'javascript', 'typescript', 'analytics'],
    openGraph: {
      type: 'website',
      title: 'Blogs | Chan Laurente',
      description: 'Insights and tutorials on web development and MarTech',
    },
  }
}
