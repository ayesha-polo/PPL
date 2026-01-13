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
    const fetchLessons = async () => {
      const { data } = await supabase
        .from('lessons')
        .select('id, title, week')
        .order('week')

      setLessons(data || [])
    }

    fetchLessons()
  }, [])

  return (
    <div>
      <h1>Lessons</h1>

      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link href={`/lessons/${lesson.id}`}>
              Week {lesson.week}: {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
