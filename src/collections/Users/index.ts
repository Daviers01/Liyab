import type { CollectionConfig } from 'payload'

import { admins } from '../../access/admins'
import { adminsOrSelf } from '../../access/adminsOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: admins,
    create: admins,
    delete: admins,
    read: adminsOrSelf,
    update: adminsOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      required: true,
      saveToJWT: true,
      access: {
        update: admins,
      },
    },
  ],
  timestamps: true,
}
