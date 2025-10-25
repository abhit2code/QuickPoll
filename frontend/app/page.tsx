'use client'

import { useState, useEffect } from 'react'
import { Poll, api } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import PollForm from '@/components/PollForm'
import PollCard from '@/components/PollCard'

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([])

  const fetchPolls = async () => {
    try {
      const data = await api.getPolls()
      setPolls(data)
    } catch (error) {
      console.error('Error fetching polls:', error)
    }
  }

  const { connected } = useWebSocket((data) => {
    if (data.type === 'new_poll') {
      fetchPolls()
    } else if (data.type === 'vote_update') {
      setPolls(prev => prev.map(poll => 
        poll.id === data.poll_id 
          ? { ...poll, votes: data.votes! }
          : poll
      ))
    } else if (data.type === 'like_update') {
      setPolls(prev => prev.map(poll => 
        poll.id === data.poll_id 
          ? { ...poll, likes: data.likes! }
          : poll
      ))
    } else if (data.type === 'new_comment') {
      setPolls(prev => prev.map(poll => 
        poll.id === data.poll_id 
          ? { ...poll, comments: [data.comment!, ...poll.comments] }
          : poll
      ))
    } else if (data.type === 'comment_like_update') {
      setPolls(prev => prev.map(poll => 
        poll.id === data.poll_id 
          ? { 
              ...poll, 
              comments: poll.comments.map(comment =>
                comment.id === data.comment_id
                  ? { ...comment, likes: data.likes! }
                  : comment
              )
            }
          : poll
      ))
    }
  })

  useEffect(() => {
    fetchPolls()
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className={`text-sm p-2 rounded ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {connected ? '🟢 Real-time connected' : '🔴 Connecting...'}
      </div>

      <PollForm onPollCreated={fetchPolls} />

      <div className="space-y-6">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} onUpdate={fetchPolls} />
        ))}
      </div>
    </div>
  )
}
