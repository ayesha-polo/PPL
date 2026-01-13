'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Lesson = {
  id: string
  title: string
  week: number
  overview: string | null
  objectives: string | null
  content: string | null
}

export default function LessonDetailPage() {
  const { id } = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    const fetchLesson = async () => {
      const { data } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single()

      setLesson(data)
    }

    fetchLesson()
  }, [id])

  if (!lesson) return <p>Loading...</p>

  return (
    <div>
      <h1>
        Week {lesson.week}: {lesson.title}
      </h1>

      <p>{lesson.overview}</p>

      <h3>Objectives</h3>
      <p>{lesson.objectives}</p>

      <h3>Lesson Content</h3>
      <p>{lesson.content}</p>
    </div>
  )
}
