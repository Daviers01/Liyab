import type { PayloadRequest } from 'payload'

export const authenticated = ({ req: { user } }: { req: PayloadRequest }) => {
  return Boolean(user)
}
