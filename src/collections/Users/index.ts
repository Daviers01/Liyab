import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: anyone, // Allow self-registration
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'authProvider'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'organizationName',
      type: 'text',
      label: 'Organization Name',
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job Title / Role',
    },
    {
      name: 'deactivated',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'user',
          value: 'user',
        },
      ],
      access: {
        read: authenticated,
        create: admins,
        update: admins,
      },
    },
    // ── Google OAuth fields ────────────────────────────────────────────
    {
      name: 'authProvider',
      type: 'select',
      defaultValue: 'credentials',
      options: [
        { label: 'Credentials', value: 'credentials' },
        { label: 'Google', value: 'google' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'googleSub',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden: true },
      access: {
        read: admins,
        update: () => false,
      },
    },
    {
      name: 'avatarUrl',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'googleAccessToken',
      type: 'text',
      admin: { hidden: true },
      access: {
        read: () => false,
      },
    },
    {
      name: 'googleRefreshToken',
      type: 'text',
      admin: { hidden: true },
      access: {
        read: () => false,
      },
    },
    // ── Paddle / Subscription fields ──────────────────────────────────
    {
      name: 'paddleCustomerId',
      type: 'text',
      label: 'Paddle Customer ID',
      index: true,
      admin: { position: 'sidebar', readOnly: true },
      access: { update: () => false },
    },
    {
      name: 'paddleSubscriptionId',
      type: 'text',
      label: 'Paddle Subscription ID',
      index: true,
      admin: { position: 'sidebar', readOnly: true },
      access: { update: () => false },
    },
    {
      name: 'subscriptionStatus',
      type: 'select',
      label: 'Subscription Status',
      defaultValue: 'free',
      saveToJWT: true,
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Active', value: 'active' },
        { label: 'Trialing', value: 'trialing' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Paused', value: 'paused' },
      ],
      admin: { position: 'sidebar', readOnly: true },
      access: { update: () => false },
    },
    {
      name: 'subscriptionPlan',
      type: 'select',
      label: 'Subscription Plan',
      defaultValue: 'free',
      saveToJWT: true,
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Pro Monthly', value: 'pro_monthly' },
      ],
      admin: { position: 'sidebar', readOnly: true },
      access: { update: () => false },
    },
    {
      name: 'subscriptionCurrentPeriodEnd',
      type: 'date',
      label: 'Subscription Period End',
      admin: { position: 'sidebar', readOnly: true },
      access: { update: () => false },
    },
  ],
  timestamps: true,
}
