'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

type Lesson = {
  title: string
  overview: string
  objectives: string
  content: string
}

export default function LessonPage() {
  const { id } = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    supabase
      .from('lessons')
      .select('title, overview, objectives, content')
      .eq('id', id)
      .single()
      .then(({ data }) => setLesson(data))
  }, [id])

  if (!lesson) return <p>Loading lesson...</p>

  return (
    <div>
      <h1>{lesson.title}</h1>

      <h2>Overview</h2>
      <p>{lesson.overview}</p>

      <h2>Objectives</h2>
      <p>{lesson.objectives}</p>

      <h2>Lesson Content</h2>
      <p>{lesson.content}</p>
    </div>
  )
}
