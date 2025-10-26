'use client'

import { useState, useEffect } from 'react'
import { Poll, api } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import PollForm from '@/components/PollForm'
import PollCard from '@/components/PollCard'

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [showPollForm, setShowPollForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    <div className="min-h-screen bg-gray-50">
      <Header 
        onNewPoll={() => setShowPollForm(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        connected={connected}
      />
      
      <div className="max-w-8xl mx-auto flex">
        {/* Main Feed */}
        <main className="flex-1 lg:max-w-none lg:w-[65%] xl:w-[70%] px-4 sm:px-6 lg:px-8 py-6">

          {/* Poll Form Modal */}
          {showPollForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Create New Poll</h2>
                    <button 
                      onClick={() => setShowPollForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <PollForm 
                    onPollCreated={() => {
                      fetchPolls()
                      setShowPollForm(false)
                    }} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Polls Feed */}
          <div className="space-y-4">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} onUpdate={fetchPolls} />
            ))}
            
            {polls.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No polls yet. Create the first one!
              </div>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <div className="hidden lg:block lg:w-[30%] xl:w-[30%]">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      </div>
    </div>
  )
}
