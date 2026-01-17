'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DiscussionPage() {
  const [message, setMessage] = useState('')
  const [posts, setPosts] = useState<any[]>([])

  // Fetch posts on page load
  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('discussion_posts')
        .select('*')
        .order('created_at', { ascending: false })

      setPosts(data || [])
    }

    fetchPosts()
  }, [])

  // Submit new post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !message) return

    await supabase.from('discussion_posts').insert({
      user_id: user.id,
      content: message,
    })

    setMessage('')

    // Refresh posts
    const { data } = await supabase
      .from('discussion_posts')
      .select('*')
      .order('created_at', { ascending: false })

    setPosts(data || [])
  }

  return (
    <div>
      {/* Page intro */}
      <div className="card">
        <div className="card-title">Discussion Forum</div>
        <p className="card-muted">
          Use this space to ask questions, share reflections, or connect with
          other parents in the course.
        </p>
      </div>

      {/* Post form */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={{ width: '100%' }}
          />

          <button type="submit" style={{ marginTop: '12px' }}>
            Post Message
          </button>
        </form>
      </div>

      {/* Posts */}
      <div className="card">
        <div className="card-title">Recent Posts</div>

        {posts.length === 0 && (
          <p className="card-muted">No posts yet.</p>
        )}

        {posts.map((post) => (
          <div key={post.id} className="card" style={{ marginTop: '12px' }}>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
