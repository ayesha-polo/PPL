'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CertificatePage() {
  const [isEligible, setIsEligible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkCompletion = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')

      const { data: progress } = await supabase
        .from('progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true)

      if (lessons && progress && lessons.length === progress.length) {
        setIsEligible(true)
      }

      setLoading(false)
    }

    checkCompletion()
  }, [])

  if (loading) return <p>Checking completion status…</p>

  if (!isEligible) {
    return (
      <div>
        <h1>Certificate of Completion</h1>
        <p>
          You will be able to access your certificate after completing all
          course lessons.
        </p>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>Certificate of Completion</h1>

      <p>
        This certifies that the participant has successfully completed the
        Parent Powered Literacy course.
      </p>

      <p style={{ marginTop: '24px' }}>
        Date of Completion: {new Date().toLocaleDateString()}
      </p>

      <button
        onClick={() => window.print()}
        style={{
          marginTop: '32px',
          padding: '12px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Download Certificate
      </button>
    </div>
  )
}
