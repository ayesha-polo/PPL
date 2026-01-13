'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

type Lesson = {
  id: string
  title: string
  week: number
}

export default function Dashboard() {
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/login')
    })

    supabase
      .from('lessons')
      .select('id,title,week')
      .order('week')
      .then(({ data }) => {
        setLessons(data || [])
        setLoading(false)
      })
  }, [router])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {lessons.map(l => (
          <li key={l.id}>
            <a href={`/lessons/${l.id}`}>
              Week {l.week}: {l.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
