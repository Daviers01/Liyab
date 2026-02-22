import type { CollectionConfig } from 'payload'

export const AuditReports: CollectionConfig = {
  slug: 'audit-reports',
  admin: {
    useAsTitle: 'propertyName',
    defaultColumns: ['propertyName', 'propertyId', 'healthScore', 'createdAt'],
    group: 'App',
  },
  access: {
    // Users can only read their own reports
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: () => false, // Reports are immutable
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { user: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'propertyName',
      type: 'text',
      required: true,
    },
    {
      name: 'propertyId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'healthScore',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
    },
    {
      name: 'checks',
      type: 'json',
      required: true,
    },
    {
      name: 'summary',
      type: 'json',
      required: true,
    },
  ],
  timestamps: true,
}
