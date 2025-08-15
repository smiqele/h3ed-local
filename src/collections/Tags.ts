// collections/Tags.ts
import type { CollectionConfig } from 'payload';

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true, },
    { name: 'slug', type: 'text', required: true, unique: true, },
  ],
};