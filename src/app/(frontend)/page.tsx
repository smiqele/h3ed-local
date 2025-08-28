import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const { docs: topics } = await payload.find({
    collection: 'topics',
    depth: 1,
  })

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">🗂️ Темы</h1>

      {topics.length === 0 && <p>Нет доступных тем.</p>}

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic: any) => (
          <li key={topic.id} className="border rounded p-4 hover:shadow">
            <h2 className="text-xl font-semibold mb-1">{topic.title}</h2>
            {topic.description && <p className="text-gray-600 text-sm mb-2">{topic.description}</p>}
            <Link href={`/topics/${topic.id}`} className="text-blue-600 hover:underline text-sm">
              Перейти к теме →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
