const renderNode = (node: any, key?: React.Key): React.ReactNode => {
    if (!node) return null

    switch (node.type) {
      case 'root':
        return node.children.map((child: any, i: number) => renderNode(child, i))

      case 'heading': {
        const Tag = node.tag || 'h2'
        const text = node.children.map((c: any) => c.text).join('')
        if (Tag === 'h6') {
          return <Tag key={key} className="text-2xl text-slate-900 mt-12 pr-12 mb-2">{text}</Tag>
        }
        return <Tag key={key} className="text-2xl font-semibold mt-8 mb-4 text-slate-900">{text}</Tag>
      }

      case 'paragraph': {
        const children = node.children?.length
          ? node.children.map((child: any, i: number) => {
              const textClasses = child.format === 1 ? 'font-bold' : ''
              const text = child.text || ''
              const urlRegex = /(https?:\/\/[^\s]+)/g
              const parts = text.split(urlRegex)

              return (
                <span key={i} className={textClasses}>
                  {parts.map((part, idx) =>
                    urlRegex.test(part) ? (
                      <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {part}
                      </a>
                    ) : (
                      part
                    )
                  )}
                </span>
              )
            })
          : null
        return <p key={key} className="my-2 text-slate-900">{children}</p>
      }

      case 'list': {
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol'
        return <ListTag key={key} className="list-disc pl-6 my-4 marker:text-[#C0EF4B]">{node.children.map((child: any, i: number) => renderNode(child, i))}</ListTag>
      }

      case 'listitem': {
        const children = node.children?.length ? node.children.map((child: any, i: number) => renderNode(child, i)) : null
        return <li key={key}>{children}</li>
      }

      case 'block': {
        if (node.fields?.blockType === 'code') {
          const handleCopy = () => {
            navigator.clipboard.writeText(node.fields.code)
            setCopiedIndex(key as number)
            setTimeout(() => setCopiedIndex(null), 5000)
          }

          return (
            <div key={key} className="relative my-4">
              <button onClick={handleCopy} className="absolute top-1 right-1 text-xs hover:bg-slate-200 px-2 py-2 rounded">
                {copiedIndex === key ? <Check className="text-slate-900 w-4 h-4" /> : <Copy className="text-slate-700 w-4 h-4" />}
              </button>
              <pre className="bg-slate-100 p-4 rounded-md whitespace-pre-wrap break-words overflow-x-hidden overflow-y-auto">
                <code className={`language-${node.fields.language || 'plaintext'}`} style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  {node.fields.code}
                </code>
              </pre>
            </div>
          )
        }
        return null
      }

      case 'upload': {
        if (node.value?.url) {
          return <img key={key} src={node.value.url} alt={node.value.alt || ''} className="my-4 rounded-lg max-w-full h-auto" />
        }
        return null
      }

      case 'quote': {
        const children = node.children?.length ? node.children.map((child: any, i: number) => renderNode(child, i)) : null
        return <blockquote key={key} className="border-l-4 border-slate-200 pl-2 pr-8 my-4 text-slate-800 text-xl">{children}</blockquote>
      }

      case 'text':
        return node.text

      default:
        if (node.children) return node.children.map((child: any, i: number) => renderNode(child, i))
        return null
    }
  }
