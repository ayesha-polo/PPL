'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type LessonInsight = {
  id: string
  title: string
  completedCount: number
}

export default function InsightsPage() {
  const [lessonInsights, setLessonInsights] = useState<LessonInsight[]>([])
  const [userCount, setUserCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      // 1️⃣ Get all lessons
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, title')
        .order('week')

      // 2️⃣ Get all progress rows (for user count)
      const { data: progressRows } = await supabase
        .from('progress')
        .select('user_id, lesson_id')
        .eq('completed', true)

      if (!lessons || !progressRows) {
        setLoading(false)
        return
      }

      // 3️⃣ Calculate unique users
      const uniqueUsers = new Set(progressRows.map((row) => row.user_id))
      setUserCount(uniqueUsers.size)

      // 4️⃣ Calculate per-lesson completion counts
      const insights: LessonInsight[] = lessons.map((lesson) => {
        const count = progressRows.filter(
          (row) => row.lesson_id === lesson.id
        ).length

        return {
          id: lesson.id,
          title: lesson.title,
          completedCount: count,
        }
      })

      setLessonInsights(insights)
      setLoading(false)
    }

    fetchInsights()
  }, [])

  if (loading) return <p>Loading insights...</p>

  return (
    <div style={{ padding: '24px' }}>
      <h1>Course Insights</h1>

      <p>
        This page shows how often each lesson has been completed by learners.
      </p>

      {userCount !== null && (
        <p>
          <strong>Total active learners:</strong> {userCount}
        </p>
      )}

      <ul style={{ marginTop: '16px' }}>
        {lessonInsights.map((lesson) => (
          <li key={lesson.id}>
            <strong>{lesson.title}</strong>: {lesson.completedCount} completions
          </li>
        ))}
      </ul>
    </div>
  )
}
