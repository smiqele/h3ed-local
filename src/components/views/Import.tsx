'use client'
import { Button } from '@payloadcms/ui'
import React, { useState } from 'react'
import { addCourses } from './addCourses'
import { addTopics } from './addTopics'
import { addSteps } from './addSteps'

export const Import: React.FC = () => {
  const [result, setResult] = useState<any>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    try {
      const parsed = JSON.parse(text)
      setResult(parsed)
    } catch (err) {
      console.error('Ошибка парсинга JSON:', err)
      setResult({ error: 'Невалидный JSON' })
    }
  }

  const handleImportCourses = async () => {
    if (!result) return
    try {
      const created = await addCourses(result)
      setStatus(`✅ Импортировано ${created.length} записей`)
    } catch (err) {
      console.error('Ошибка при импорте:', err)
      setStatus('❌ Ошибка при импорте')
    }
  }

  const handleImportTopics = async () => {
    if (!result) return
    try {
      const created = await addTopics(result)
      setStatus(`✅ Импортировано ${created.length} записей`)
    } catch (err) {
      console.error('Ошибка при импорте:', err)
      setStatus('❌ Ошибка при импорте')
    }
  }

  const handleImportSteps = async () => {
    if (!result) return
    try {
      const created = await addSteps(result, 2)
      setStatus(`✅ Импортировано ${created.length} записей`)
    } catch (err) {
      console.error('Ошибка при импорте:', err)
      setStatus('❌ Ошибка при импорте')
    }
  }

  return (
    <div>
      <input type="file" accept="application/json" onChange={handleFileChange} />

      <Button onClick={handleImportCourses} disabled={!result}>
        Import Courses
      </Button>

      <Button onClick={handleImportTopics} disabled={!result}>
        Import Topics
      </Button>

      <Button onClick={handleImportSteps} disabled={!result}>
        Import Steps
      </Button>

      {status && <p>{status}</p>}

      {result && (
        <pre
          style={{
            backgroundColor: '#f4f4f4',
            padding: '1rem',
            borderRadius: '5px',
            marginTop: '1rem',
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
