import type { PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

export const authenticated = ({ req: { user } }: { req: PayloadRequest }) => {
  return Boolean(user)
}
