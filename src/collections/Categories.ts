// collections/Categories.ts
import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true,},
    { name: 'slug', type: 'text', required: true, },
  ],
};