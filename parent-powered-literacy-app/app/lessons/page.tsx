'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type Lesson = {
  id: string
  title: string
  week: number
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])

  useEffect(() => {
    supabase
      .from('lessons')
      .select('id, title, week')
      .order('week')
      .then(({ data }) => setLessons(data || []))
  }, [])

  return (
    <div>
      <h1>Lessons</h1>

      {lessons.map(lesson => (
        <div key={lesson.id}>
          <Link href={`/lessons/${lesson.id}`}>
            Week {lesson.week}: {lesson.title}
          </Link>
        </div>
      ))}
    </div>
  )
}
