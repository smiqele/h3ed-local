export async function addCourses(data: any) {
  // если пришёл объект с ключом "docs" → берём его
  const rawItems = Array.isArray(data)
    ? data
    : data?.docs
    ? data.docs
    : [data]

  const created: any[] = []
  const token = localStorage.getItem('payload-token')

  for (const item of rawItems) {
    const payloadData = {
      title: item.title?.toString().trim(),
      slug: item.slug?.toString().trim(),
      description: item.description ?? '',
      isPublished: item.isPublished ?? false,
      content: item.content ?? undefined,
    }

    console.log('Отправляем:', payloadData)

    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      body: JSON.stringify(payloadData),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(
        `Ошибка при добавлении: ${res.status} ${res.statusText} - ${text}`,
      )
    }

    created.push(await res.json())
  }

  return created
}