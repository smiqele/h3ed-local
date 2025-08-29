import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import StepsViewer from './StepsViewer'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const payload = await getPayload({ config })

  try {
    const topic = await payload.findByID({
      collection: 'topics',
      id,
      depth: 1,
    })

    return {
      title: topic.title,
      description: topic.description || 'Описание темы',
      openGraph: {
        title: topic.title,
        description: topic.description || 'Описание темы',
      },
    }
  } catch {
    return {
      title: 'Тема не найдена',
      description: 'Такой темы не существует',
    }
  }
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params // ждём Promise

  const payload = await getPayload({ config })

  let topic: any
  try {
    topic = await payload.findByID({
      collection: 'topics',
      id,
      depth: 2,
    })
  } catch (e) {
    console.error('Ошибка загрузки темы:', e)
    return <div>Тема не найдена</div>
  }

  if (!topic) return <div>Тема не найдена</div>

  const stepsIds = topic.relatedSteps?.docs?.map((step: any) => step.id) || []

  const steps =
    stepsIds.length > 0
      ? (
          await payload.find({
            collection: 'steps',
            where: {
              topic: {
                equals: id, // id топика
              },
            },
            sort: '_order', // или _order
            depth: 2,
            limit: 0, // ⚡ чтобы вытащить все
          })
        ).docs
      : []

  console.log(steps)

  return (
    <main>
      {topic.description && <p className="text-gray-600 mt-2">{topic.description}</p>}
      {steps.length > 0 ? <StepsViewer steps={steps} /> : <p>Шаги не найдены</p>}
    </main>
  )
}
