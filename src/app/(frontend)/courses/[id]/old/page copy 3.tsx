// frontend/src/app/course/[id]/page.tsx
import Link from 'next/link';
import React from 'react';

type TextNode = {
  type: 'text';
  text: string;
};

type HeadingNode = {
  type: 'heading';
  tag: string;
  children: TextNode[];
};

type CodeBlockNode = {
  type: 'block';
  fields: {
    blockType: 'code';
    code: string;
    language?: string;
  };
};

type ParagraphNode = {
  type: 'paragraph';
  children: TextNode[];
};

type ListNode = {
  type: 'list';
  listType: 'bullet' | 'ordered';
  children: ListItemNode[];
};

type ListItemNode = {
  type: 'listitem';
  children: TextNode[];
};

type RootNode = {
  type: 'root';
  children: (HeadingNode | CodeBlockNode | ParagraphNode | ListNode)[];
};

type Step = {
  id: string;
  title: string;
  duration?: number;
  content?: RootNode | string;
};

type Topic = {
  id: string;
  title: string;
  relatedSteps?: {
    docs: (Step | string | number)[];
  };
};

type Course = {
  id: string;
  title: string;
  description?: string;
  relatedTopics?: {
    docs: Topic[];
  };
};

type Props = {
  params: {
    id: string;
  };
};

function renderNode(node: any, key?: React.Key): React.ReactNode {
  if (!node) return null;

  switch (node.type) {
    case 'root':
      return node.children?.map((child: any, i: number) => renderNode(child, i)) || null;

    case 'heading': {
      const Tag = node.tag || 'h2';
      const text = node.children?.map((c: any) => c.text).join('') || '';
      return (
        <Tag key={key} className="font-semibold my-4">
          {text}
        </Tag>
      );
    }

    case 'paragraph': {
      const children = node.children?.map((child: any, i: number) => renderNode(child, i)) || null;
      return (
        <p key={key} className="my-2">
          {children}
        </p>
      );
    }

    case 'list': {
      const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
      const className = node.listType === 'bullet' ? 'list-disc pl-6 my-4' : 'list-decimal pl-6 my-4';
      return (
        <ListTag key={key} className={className}>
          {node.children?.map((child: any, i: number) => renderNode(child, i)) || null}
        </ListTag>
      );
    }

    case 'listitem': {
      const children = node.children?.map((child: any, i: number) => renderNode(child, i)) || null;
      return <li key={key}>{children}</li>;
    }

    case 'block': {
      if (node.fields?.blockType === 'code') {
        return (
          <pre key={key} className="bg-gray-100 p-4 rounded my-4 overflow-auto">
            <code className={`language-${node.fields.language || 'plaintext'}`}>
              {node.fields.code}
            </code>
          </pre>
        );
      }
      return null;
    }

    case 'text':
      return node.text;

    default:
      if (node.children) {
        return node.children.map((child: any, i: number) => renderNode(child, i));
      }
      return null;
  }
}

async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}?depth=2`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch course with id ${id}`);
  }
  return res.json();
}

async function getStep(id: string): Promise<Step> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/steps/${id}?depth=2`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch step with id ${id}`);
  }
  return res.json();
}

function parseContent(raw?: string | RootNode): React.ReactNode {
  if (!raw) return null;
  let parsed: RootNode | null = null;

  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return <p className="text-red-500">Невозможно отобразить контент</p>;
    }
  } else {
    parsed = raw;
  }

  return parsed?.root ? renderNode(parsed.root) : null;
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse(params.id);

  const topicsWithSteps = await Promise.all(
    (course.relatedTopics?.docs || []).map(async (topic) => {
      if (!topic.relatedSteps?.docs) return topic;

      const detailedSteps: Step[] = await Promise.all(
        topic.relatedSteps.docs.map(async (step) => {
          if (typeof step === 'string' || typeof step === 'number') {
            return getStep(String(step));
          }
          return step;
        })
      );

      return {
        ...topic,
        relatedSteps: {
          docs: detailedSteps,
        },
      };
    })
  );

  console.log('Related topics:', topicsWithSteps);
  topicsWithSteps.forEach((topic) => {
    console.log('Topic:', topic.title);
    topic.relatedSteps?.docs.forEach((step) => {
      console.log('Step:', step.title, 'Duration:', step.duration);
    });
  });

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

      {course.description && <p className="text-gray-700 mb-6">{course.description}</p>}

      {topicsWithSteps.length ? (
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold mt-8">Темы</h2>

          {topicsWithSteps.map((topic) => (
            <div key={topic.id} className="space-y-6">
              <h3 className="text-xl font-semibold">{topic.title}</h3>

              {topic.relatedSteps?.docs?.length ? (
                <ul className="space-y-4">
                  {topic.relatedSteps.docs.map((step) => (
                    <li key={step.id} className="border p-4 rounded">
                      <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                      {step.duration && (
                        <p className="text-sm text-gray-500 mb-2">
                          Время прохождения: {step.duration} мин
                        </p>
                      )}
                      <article className="prose max-w-none">{parseContent(step.content)}</article>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Нет шагов</p>
              )}
            </div>
          ))}
        </section>
      ) : (
        <p className="text-gray-500">Темы отсутствуют</p>
      )}

      <Link href="/" className="text-blue-600 hover:underline">
        ← Назад к списку курсов
      </Link>
    </main>
  );
}