import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import StepsViewer from './StepsViewer'

export default async function TopicPage({ params }: { params: { id: string } }) {
  const { id } = params

  const payload = await getPayload({ config })

  let topic: any = null
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

  let steps: any[] = []
  if (stepsIds.length > 0) {
    const stepsAll = await payload.find({
      collection: 'steps',
      where: { id: { in: stepsIds } },
      sort: '_order',
      depth: 2,
    })
    steps = stepsAll.docs
  }

  return (
    <main>
      {topic.description && <p className="text-gray-600 mt-2">{topic.description}</p>}
      {steps.length > 0 ? <StepsViewer steps={steps} /> : <p>Шаги не найдены</p>}
    </main>
  )
}
