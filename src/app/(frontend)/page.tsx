import Link from 'next/link';
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function HomePage() {

  const payload = await getPayload({ config })
  
  const { docs: courses } = await payload.find({
    collection: 'courses',
    depth: 1,
  });

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">📚 Курсы</h1>

      {courses.length === 0 && <p>Нет доступных курсов.</p>}

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course: any) => (
          <li key={course.id} className="border rounded p-4 hover:shadow">
            <h2 className="text-xl font-semibold mb-1">{course.title}</h2>
            {course.description && (
              <p className="text-gray-600 text-sm mb-2">{course.description}</p>
            )}
            <Link href={`/courses/${course.id}`} className="text-blue-600 hover:underline text-sm">
              Перейти к курсу →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}