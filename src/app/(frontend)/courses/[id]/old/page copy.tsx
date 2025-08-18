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

type RootNode = {
  type: 'root';
  children: (HeadingNode | CodeBlockNode)[];
};

type Course = {
  id: string;
  title: string;
  description?: string;
  content?: RootNode | string;
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
      return node.children.map((child: any, i: number) => renderNode(child, i));

    case 'heading': {
      const Tag = node.tag || 'h2';
      const text = node.children.map((c: any) => c.text).join('');
      return (
        <Tag key={key} className="font-semibold my-4">
          {text}
        </Tag>
      );
    }

    case 'paragraph': {
      const children = node.children?.length
        ? node.children.map((child: any, i: number) => renderNode(child, i))
        : null;
      return (
        <p key={key} className="my-2">
          {children}
        </p>
      );
    }

    case 'list': {
      const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
      return (
        <ListTag key={key} className="list-disc pl-6 my-4">
          {node.children.map((child: any, i: number) => renderNode(child, i))}
        </ListTag>
      );
    }

    case 'listitem': {
      const children = node.children?.length
        ? node.children.map((child: any, i: number) => renderNode(child, i))
        : null;
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

export default async function CoursePage({ params }: Props) {
  const course = await getCourse(params.id);

  console.log(course.content)

  let richContent: RootNode | null = null;
  if (course.content) {
    if (typeof course.content === 'string') {
      try {
        richContent = JSON.parse(course.content);
      } catch {
        richContent = null;
      }
    } else {
      richContent = course.content as RootNode;
    }
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

      

      {course.description && <p className="text-gray-700 mb-6">{course.description}</p>}

      {richContent?.root ? (
  <article className="prose max-w-none mb-8">{renderNode(richContent.root)}</article>
) : (
  <p className="text-gray-500 mb-8">Контент отсутствует</p>
)}

      <Link href="/" className="text-blue-600 hover:underline">
        ← Назад к списку курсов
      </Link>

    </main>
  );
}