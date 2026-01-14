'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
async function markLessonCompleted(lessonId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from('progress')
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
      },
      {
        onConflict: 'user_id,lesson_id',
      }
    )
}

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
  const [isCompleted, setIsCompleted] = useState(false)


 useEffect(() => {
  const fetchLesson = async () => {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()

    setLesson(data)
    const {
  data: { user },
} = await supabase.auth.getUser()

if (user && data?.id) {
  const { data: progress } = await supabase
    .from('progress')
    .select('completed')
    .eq('user_id', user.id)
    .eq('lesson_id', data.id)
    .single()

  if (progress?.completed) {
    setIsCompleted(true)
  }
}

    if (data?.id) {
      
    }
  }

  fetchLesson()
}, [id])

  if (!lesson) return <p>Loading...</p>
const markLessonComplete = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("No user logged in")
    return
  }

  const { error } = await supabase.from("progress").upsert({
    user_id: user.id,
    lesson_id: id,
    completed: true,
  })

  if (error) {
    console.error("Error saving progress:", error)
  } else {
    console.log("Lesson marked as complete")
  }
}

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
      <button
  onClick={markLessonComplete}
  disabled={isCompleted}
  style={{
    marginTop: "20px",
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: isCompleted ? "default" : "pointer",
  }}
>
  {isCompleted ? "Lesson completed ✓" : "Mark lesson as complete"}
</button>

    </div>
  )
}
