import type { CollectionConfig } from 'payload';

export const Tests: CollectionConfig = {
  slug: 'tests',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'step', type: 'relationship', relationTo: 'steps', required: false,},
    { name: 'description', type: 'textarea' },
    { name: 'content', type: 'richText' },
  ],
};