import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import StepsViewer from './StepsViewer'

export default async function TopicPage({ params }: { params: { id: string } }) {
  const payload = await getPayload({ config, importMap: {} })

  const topic = await payload.findByID({
    collection: 'topics',
    id: params.id,
    depth: 2,
  })

  const stepsIds = topic.relatedSteps?.docs?.map((step: any) => step.id) || []

  const stepsAll = await payload.find({
    collection: 'steps',
    where: { id: { in: stepsIds } },
    sort: '_order',
    depth: 2,
  })

  const steps = stepsAll.docs

  console.log('steps data:', steps)
  console.log('steps data:', steps[9])

  if (!topic) return <div>Тема не найдена</div>

  return (
    <main className=" ">
      <div className="">

        {/*<h1 className="text-3xl font-bold">{topic.title}</h1>*/}
        
        {topic.description && <p className="text-gray-600 mt-2">{topic.description}</p>}

        {steps.length > 0 && <StepsViewer steps={steps} />}

      </div>
    </main>
  )
}