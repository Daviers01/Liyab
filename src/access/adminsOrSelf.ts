import type { Access } from 'payload'

export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('admin')) return true

  return {
    id: {
      equals: user.id,
    },
  }
}
