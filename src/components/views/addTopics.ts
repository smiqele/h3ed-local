export async function addTopics(data: any, courseId = 2) {
  const items = Array.isArray(data) ? data : data.docs ? data.docs : [data]
  const created: any[] = []
  const seenSlugs = new Set<string>()

  for (let raw of items) {
    const item: any = {
      title: raw.title || 'Без названия',
      slug: raw.slug || raw.title?.toLowerCase().replace(/\s+/g, '-') || 'topic-' + Date.now(),
      course: courseId, // 👈 всегда привязываем к одному курсу
      description: raw.description || '',
      isSingleTopicCourse: raw.isSingleTopicCourse ?? false,
    }

    // Уникализация slug
    let baseSlug = item.slug
    let uniqueSlug = baseSlug
    let counter = 1
    while (seenSlugs.has(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`
      counter++
    }
    item.slug = uniqueSlug
    seenSlugs.add(uniqueSlug)

    // POST → Payload
    const token = localStorage.getItem('payload-token')
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      body: JSON.stringify(item),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Ошибка при добавлении topic: ${res.status} ${res.statusText} - ${text}`)
    }

    created.push(await res.json())
  }

  return created
}
