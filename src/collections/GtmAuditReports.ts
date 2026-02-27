import type { CollectionConfig } from 'payload'

export const GtmAuditReports: CollectionConfig = {
  slug: 'gtm-audit-reports',
  admin: {
    useAsTitle: 'containerName',
    defaultColumns: ['containerName', 'publicId', 'healthScore', 'createdAt'],
    group: 'App',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: () => false,
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
      name: 'containerName',
      type: 'text',
      required: true,
    },
    {
      name: 'containerId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'publicId',
      type: 'text',
      required: true,
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
    {
      name: 'martech',
      type: 'json',
    },
    {
      name: 'containerType',
      type: 'json',
    },
    {
      name: 'tagCount',
      type: 'number',
    },
    {
      name: 'triggerCount',
      type: 'number',
    },
    {
      name: 'variableCount',
      type: 'number',
    },
  ],
  timestamps: true,
}
