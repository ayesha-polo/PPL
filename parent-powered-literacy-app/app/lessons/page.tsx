'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'


type Lesson = {
  id: string
  title: string
  week: number
}

export default function LessonsPage() {
 const router = useRouter()
 const [lessons, setLessons] = useState<Lesson[]>([])

 useEffect(() => {
  const checkAuthAndFetch = async () => {
    const user = await getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('lessons')
      .select('id, title, week')
      .order('week')

    setLessons(data || [])
  }

  checkAuthAndFetch()
}, [router])

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
