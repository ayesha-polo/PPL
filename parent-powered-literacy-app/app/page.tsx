'use client'
import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(console.log)
  }, [])

  return <h1>PPL Connected</h1>
}
