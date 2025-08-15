import type { CollectionConfig } from 'payload';

export const Steps: CollectionConfig = {
  slug: 'steps',
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
          { name: 'topic', type: 'relationship', relationTo: 'topics', required: true },
          {
            name: 'duration',
            label: 'Время на прохождение (минуты)',
            type: 'number',
            required: false,
            min: 1,
            admin: {
              description: 'Укажите ориентировочное время на прохождение шага в минутах',
            },
          },
        ]
      },
      {
        label: 'Сontent',
        fields: [
          { name: 'content', type: 'richText' },
        ]
      }
    ], 
  }],
};