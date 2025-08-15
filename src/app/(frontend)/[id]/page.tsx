'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';

type TextNode = { type: 'text'; text: string };
type HeadingNode = { type: 'heading'; tag: string; children: TextNode[] };
type CodeBlockNode = { type: 'block'; fields: { blockType: 'code'; code: string; language?: string } };
type ParagraphNode = { type: 'paragraph'; children: TextNode[] };
type ListNode = { type: 'list'; listType: 'bullet' | 'ordered'; children: ListItemNode[] };
type ListItemNode = { type: 'listitem'; children: TextNode[] };
type RootNode = { type: 'root'; children: (HeadingNode | CodeBlockNode | ParagraphNode | ListNode)[] };

type Step = { id: string; title: string; duration?: number; content?: RootNode | string };
type Topic = { id: string; title: string; relatedSteps?: { docs: Step[] } };
type Course = { id: string; title: string; description?: string; relatedTopics?: { docs: Topic[] } };

function renderNode(node: any, key?: React.Key): React.ReactNode {
  if (!node) return null;
  switch (node.type) {
    case 'root':
      return node.children?.map((child: any, i: number) => renderNode(child, i));
    case 'heading': {
      const Tag = node.tag || 'h2';
      const text = node.children?.map((c: any) => c.text).join('') || '';
      return <Tag key={key} className="font-semibold my-4">{text}</Tag>;
    }
    case 'paragraph': {
      const children = node.children?.map((child: any, i: number) => renderNode(child, i));
      return <p key={key} className="my-2">{children}</p>;
    }
    case 'list': {
      const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
      const className = node.listType === 'bullet' ? 'list-disc pl-6 my-4' : 'list-decimal pl-6 my-4';
      return <ListTag key={key} className={className}>{node.children?.map((c: any, i: number) => renderNode(c, i))}</ListTag>;
    }
    case 'listitem': {
      const children = node.children?.map((child: any, i: number) => renderNode(child, i));
      return <li key={key}>{children}</li>;
    }
    case 'block':
      if (node.fields?.blockType === 'code') {
        return (
          <pre key={key} className="bg-gray-100 p-4 rounded my-4 overflow-auto">
            <code className={`language-${node.fields.language || 'plaintext'}`}>{node.fields.code}</code>
          </pre>
        );
      }
      return null;
    case 'text':
      return node.text;
    default:
      if (node.children) return node.children.map((child: any, i: number) => renderNode(child, i));
      return null;
  }
}

async function getCourse(id: string): Promise<Course> {
  const payload = await getPayload({ config });
  return payload.findByID({
    collection: 'courses',
    id,
    depth: 2,
  });
}

async function getStep(id: string): Promise<Step> {
  const payload = await getPayload({ config });
  return payload.findByID({
    collection: 'steps',
    id,
    depth: 2,
  });
}

function parseContent(raw?: string | RootNode): React.ReactNode {
  if (!raw) return null;
  let parsed: RootNode | null = typeof raw === 'string' ? JSON.parse(raw) : raw;
  console.log(parsed);
  return parsed?.root ? renderNode(parsed.root) : null;
}

export default function CoursePage(props: { params: Promise<{ id: string }> }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [topicsWithSteps, setTopicsWithSteps] = useState<Topic[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<Record<string, number>>({});
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    props.params.then(({ id }) => setCourseId(id));
  }, [props.params]);

  useEffect(() => {
    if (!courseId) return;
    async function load() {
      const c = await getCourse(courseId);
      const topics = await Promise.all(
        (c.relatedTopics?.docs || []).map(async (topic) => {
          const steps = await Promise.all(
            (topic.relatedSteps?.docs || []).map(async (step) =>
              typeof step === 'string' || typeof step === 'number' ? await getStep(String(step)) : step
            )
          );
          return { ...topic, relatedSteps: { docs: steps } };
        })
      );
      const stepMap: Record<string, number> = {};
      topics.forEach((t) => {
        if (t.relatedSteps?.docs?.length) {
          stepMap[t.id] = 0;
        }
      });
      setCourse(c);
      setTopicsWithSteps(topics);
      setVisibleSteps(stepMap);
    }
    load();
  }, [courseId]);

  const handleNext = (topicId: string, max: number) => {
    setVisibleSteps((prev) => ({ ...prev, [topicId]: Math.min((prev[topicId] ?? 0) + 1, max - 1) }));
  };

  if (!course) return <p>Загрузка...</p>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
      {course.description && <p className="text-gray-700 mb-6">{course.description}</p>}

      {topicsWithSteps.length ? (
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold mt-8">Темы</h2>
          {topicsWithSteps.map((topic) => {
            const visibleCount = visibleSteps[topic.id] ?? 0;
            const steps = topic.relatedSteps?.docs || [];
            return (
              <div key={topic.id} className="space-y-6">
                <h3 className="text-xl font-semibold">{topic.title}</h3>
                {steps.slice(0, visibleCount + 1).map((step) => (
                  <div key={step.id} className="border p-4 rounded">
                    <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                    {step.duration && (
                      <p className="text-sm text-gray-500 mb-2">
                        Время прохождения: {step.duration} мин
                      </p>
                    )}
                    <article className="prose max-w-none">{parseContent(step.content)}</article>
                  </div>
                ))}
                {visibleCount + 1 < steps.length && (
                  <button
                    onClick={() => handleNext(topic.id, steps.length)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Далее
                  </button>
                )}
              </div>
            );
          })}
        </section>
      ) : (
        <p className="text-gray-500">Темы отсутствуют</p>
      )}

      <Link href="/" className="text-blue-600 hover:underline">← Назад к списку курсов</Link>
    </main>
  );
}