import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

export const admins = ({ req: { user } }: AccessArgs<User>): boolean => {
  return Boolean(user?.roles?.includes('admin'))
}
