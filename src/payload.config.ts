// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Code } from './blocks/Code'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

import { Categories } from './collections/Categories';
import { Tags } from './collections/Tags';

import { Courses } from './collections/Courses';
import { Topics } from './collections/Topics';
import { Steps } from './collections/Steps';
import { Tests } from './collections/Tests';
import { ExampleCollection } from './collections/ExampleCollection'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Courses, Topics, Steps, Tests, Categories, Tags, ExampleCollection],
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [Code],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  cors: ['http://localhost:3001', 'http://10.250.0.143:3001']
})
