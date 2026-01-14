
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function PreCourseSurveyPage() {
  const [priorExperience, setPriorExperience] = useState('')
  const [confidenceLevel, setConfidenceLevel] = useState('')
  const [goals, setGoals] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from('pre_course_survey').insert({
    user_id: user.id,
    prior_experience: priorExperience,
    confidence_level: Number(confidenceLevel),
    goals: goals,
  })

  alert('Survey submitted successfully')
}

  return (
    <div>
      <h1>Pre-course Survey</h1>

      <p>
        Please answer the questions below. This survey helps us understand your
        experience and goals as you begin the course.
      </p>

      <form onSubmit={handleSubmit}>

        <div>
          <label>
            Have you previously participated in any early literacy programs?
          </label>
          <br />
          <textarea
            value={priorExperience}
            onChange={(e) => setPriorExperience(e.target.value)}
          />
        </div>

        <div>
          <label>
            How confident do you feel supporting your child’s early literacy
            development? (1 = not confident, 5 = very confident)
          </label>
          <br />
          <input
            type="number"
            min="1"
            max="5"
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(e.target.value)}
          />
        </div>

        <div>
          <label>
            What are your goals for taking this course?
          </label>
          <br />
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: '16px' }}>
          Submit Survey
        </button>
      </form>
    </div>
  )
}
