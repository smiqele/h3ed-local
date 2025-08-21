import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'

function renderNode(node: any, key?: React.Key): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'root':
      return node.children.map((child: any, i: number) => renderNode(child, i))

    case 'heading': {
      const Tag = node.tag || 'h2'
      const text = node.children.map((c: any) => c.text).join('')
      return (
        <Tag key={key} className="font-semibold my-4">
          {text}
        </Tag>
      )
    }

    case 'paragraph': {
      const children = node.children?.length
        ? node.children.map((child: any, i: number) => renderNode(child, i))
        : null
      return (
        <p key={key} className="my-2">
          {children}
        </p>
      )
    }

    case 'list': {
      const ListTag = node.listType === 'bullet' ? 'ul' : 'ol'
      return (
        <ListTag key={key} className="list-disc pl-6 my-4">
          {node.children.map((child: any, i: number) => renderNode(child, i))}
        </ListTag>
      )
    }

    case 'listitem': {
      const children = node.children?.length
        ? node.children.map((child: any, i: number) => renderNode(child, i))
        : null
      return <li key={key}>{children}</li>
    }

    case 'block': {
      if (node.fields?.blockType === 'code') {
        return (
          <pre key={key} className="bg-gray-100 p-4 rounded my-4 overflow-auto">
            <code className={`language-${node.fields.language || 'plaintext'}`}>
              {node.fields.code}
            </code>
          </pre>
        )
      }
      return null
    }

    case 'text':
      return node.text

    default:
      if (node.children) {
        return node.children.map((child: any, i: number) => renderNode(child, i))
      }
      return null
  }
}

export default async function TopicPage({ params }: { params: { id: string } }) {
  const payload = await getPayload({
    config,
    importMap: {},
  })

  const topic = await payload.findByID({
    collection: 'topics',
    id: params.id,
    depth: 2,
  })

  const stepsIds = topic.relatedSteps?.docs?.map((step: any) => step.id) || []

  const stepsAll = await payload.find({
    collection: 'steps',
    where: {
      id: {
        in: stepsIds,
      },
    },
    sort: '_order',
    depth: 2,
  })

  console.log('stepsIds data:', stepsIds)
  console.log('Topic data:', topic)
  console.log('Steps All data:', stepsAll)

  const steps = stepsAll.docs

  if (!topic) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Курс не найден</h1>
        <Link href="/courses" className="text-blue-600 hover:underline">
          ← Назад к списку курсов
        </Link>
      </main>
    )
  }

  return (
    <main className="p-8 flex justify-center">

      <div className='w-3xl'>
      
        <h1 className="text-3xl font-bold">{topic.title}</h1>
        
        {topic.description && <p className="text-gray-600 mt-2">{topic.description}</p>}

        {steps.length > 0 && (
          <section className="mt-6 space-y-8">
            {steps.map((step, idx) => (
              <article key={step.id || idx} className="border-1 border-slate-200 rounded-2xl p-8 bg-white">
                
                {step.duration && (
                  <div className="text-sm font-medium bg-[#C0EF4B] size-fit text-slate-900 rounded-full px-2 py-1 mb-2">{step.duration} минут(а)</div>
                )}

                <h2 className="text-3xl font-semibold mb-2">#{step.title}</h2>
                
                {step.content && (
                  <div>
                    {renderNode(
                      step.content.root
                        ? step.content.root
                        : typeof step.content === 'string'
                          ? JSON.parse(step.content)
                          : step.content,
                    )}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        <div className="mt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Назад к списку курсов
          </Link>
        </div>

      </div>

    </main>
  )
}
