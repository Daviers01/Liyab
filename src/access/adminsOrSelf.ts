import type { Access, AccessArgs } from 'payload'
import type { User } from '@/payload-types'

export const adminsOrSelf: Access = ({ req: { user } }: AccessArgs<User>) => {
  if (!user) return false

  if (user.roles?.includes('admin')) return true

  return {
    id: {
      equals: user.id,
    },
  }
}
