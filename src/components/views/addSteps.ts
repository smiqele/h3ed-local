export async function addSteps(data: any, topicId: number) {
  const items = Array.isArray(data) ? data : data.docs ? data.docs : [data]
  const created: any[] = []
  const seenTitles = new Set<string>()

  for (let raw of items) {
    const item: any = {
      title: raw.title || 'Без названия',
      topic: topicId, // 👈 привязка к конкретному topic
      duration: raw.duration || null,
      order: raw.order ?? 0,
      content: raw.content || null,
    }

    // Уникализация title (если вдруг дубли)
    let baseTitle = item.title
    let uniqueTitle = baseTitle
    let counter = 1
    while (seenTitles.has(uniqueTitle)) {
      uniqueTitle = `${baseTitle} (${counter})`
      counter++
    }
    item.title = uniqueTitle
    seenTitles.add(uniqueTitle)

    // POST → Payload API
    const token = localStorage.getItem('payload-token')
    const res = await fetch('/api/steps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      body: JSON.stringify(item),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Ошибка при добавлении step: ${res.status} ${res.statusText} - ${text}`)
    }

    created.push(await res.json())
  }

  return created
}
