import type { Access } from 'payload'

export const admins: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'))
}
