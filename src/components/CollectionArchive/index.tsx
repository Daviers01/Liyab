import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <Card key={index} doc={result} relationTo="posts" showCategories />
            )
          }

          return null
        })}
      </div>
      
      {posts?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No posts found.</p>
        </div>
      )}
    </div>
  )
}
