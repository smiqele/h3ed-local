"use client"
import { useState, useEffect, useRef } from "react"

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

export default function StepsViewer({ steps }: { steps: any[] }) {
  const stepRefs = useRef<Array<HTMLDivElement | null>>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    stepRefs.current[currentIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentIndex])

  return (
    <section className="mt-6 space-y-8">
      {steps.slice(0, currentIndex + 1).map((step, idx) => (
        <article
          ref={el => stepRefs.current[idx] = el}
          key={step.id || idx}
          className="border-1 border-slate-200 rounded-2xl p-8 bg-white"
        >
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

      <div className="flex gap-2">
        {currentIndex < steps.length - 1 && (
            <button
              onClick={() => {
                const nextIndex = currentIndex + 1
                setCurrentIndex(nextIndex)
                // Скролл к текущему шагу
                stepRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="px-4 py-2 bg-slate-200 text-slate-900 rounded-xl"
            >
              Далее
            </button>
          )}
      </div>
    </section>
  )
}