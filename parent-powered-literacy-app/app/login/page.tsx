'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const signIn = async () => {
    await supabase.auth.signInWithOtp({ email })
    setSent(true)
  }

  return (
    <div>
      <h1>Login</h1>
      {sent ? (
        <p>Check your email for the login link.</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button onClick={signIn}>Send login link</button>
        </>
      )}
    </div>
  )
}
