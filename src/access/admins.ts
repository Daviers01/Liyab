import type { PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

import { checkRole } from './checkRole'

export const admins = ({ req: { user } }: { req: PayloadRequest }) => {
  return checkRole(['admin'], user as User | null | undefined)
}
