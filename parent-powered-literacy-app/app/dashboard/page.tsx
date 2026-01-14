'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const [completedCount, setCompletedCount] = useState(0)
  const [totalLessons, setTotalLessons] = useState(0)
  const [nextLessonId, setNextLessonId] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .order('week')

      const { data: progress } = await supabase
        .from('progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true)

      setTotalLessons(lessons?.length || 0)
      setCompletedCount(progress?.length || 0)

      const completedIds = progress?.map(p => p.lesson_id) || []
      const nextLesson = lessons?.find(l => !completedIds.includes(l.id))

      if (nextLesson) {
        setNextLessonId(nextLesson.id)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div>
      <h1>Welcome to Parent Powered Literacy</h1>

      <p>
        You have completed {completedCount} of {totalLessons} lessons.
      </p>

      {nextLessonId && (
        <Link href={`/lessons/${nextLessonId}`}>
          <button style={{ marginTop: '16px' }}>
            Continue to next lesson
          </button>
        </Link>
      )}
    </div>
  )
}
