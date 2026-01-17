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

      // ✅ Select week since we order by it
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, week')
        .order('week')

      const { data: progress } = await supabase
        .from('progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true)

      const total = lessons?.length || 0
      const completed = progress?.length || 0

      setTotalLessons(total)
      setCompletedCount(completed)

      const completedIds = progress?.map(p => p.lesson_id) || []
      const nextLesson = lessons?.find(
        lesson => !completedIds.includes(lesson.id)
      )

      // ✅ Explicitly reset when none left
      setNextLessonId(nextLesson ? nextLesson.id : null)
    }

    fetchDashboardData()
  }, [])

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Welcome & Progress Card */}
      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
        }}
      >
        <h1 style={{ marginBottom: '8px' }}>
          Welcome to Parent Powered Literacy
        </h1>

        <p>
          You have completed <strong>{completedCount}</strong> of{' '}
          <strong>{totalLessons}</strong> lessons.
        </p>
      </div>

      {/* Continue Learning Card */}
      {nextLessonId && (
        <div
          style={{
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <h2 style={{ marginBottom: '8px' }}>
            Continue Learning
          </h2>

          <p style={{ marginBottom: '16px' }}>
            Pick up where you left off.
          </p>

          <Link
            href={`/lessons/${nextLessonId}`}
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Go to Next Lesson
          </Link>
        </div>
      )}
    </div>
  )
}
