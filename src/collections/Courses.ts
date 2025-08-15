import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true,
  },
  fields: [{
    type: 'tabs',
    tabs: [
      {
        label: 'Info',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'slug', type: 'text', required: true, unique: true },
          { name: 'description', type: 'textarea' },
          { name: 'isPublished', type: 'checkbox', defaultValue: false },
          {
            name: 'relatedTopics',
            type: 'join',
            collection: 'topics',
            on: 'course',
          },
        ]
      },
      {
        label: 'Info',
        fields: [
          { name: 'content', type: 'richText' },
        ]
      }
    ], 
  }],
}