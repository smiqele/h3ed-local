import type { CollectionConfig } from 'payload';

export const Topics: CollectionConfig = {
  slug: 'topics',
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'isSingleTopicCourse', label: 'Это единственная тема в курсе?', type: 'checkbox', defaultValue: false },
    {
      name: 'relatedSteps',
      type: 'join',
      collection: 'steps',
      on: 'topic',
    },
  ],
};