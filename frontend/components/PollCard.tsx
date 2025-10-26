'use client'

import { useState, useEffect } from 'react'
import { Poll, api } from '@/lib/api'
import { Users, MessageCircle } from 'lucide-react'
import Comments from './Comments'

interface PollCardProps {
  poll: Poll
  onUpdate: () => void
}

export default function PollCard({ poll, onUpdate }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // Check if user has liked this poll (using localStorage)
    const likedPolls = JSON.parse(localStorage.getItem('likedPolls') || '[]')
    setIsLiked(likedPolls.includes(poll.id))
  }, [poll.id])

  const totalVotes = poll.votes.reduce((sum, votes) => sum + votes, 0)

  const handleVote = async () => {
    if (selectedOption === null || hasVoted) return

    try {
      await api.vote(poll.id, selectedOption)
      setHasVoted(true)
      onUpdate()
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleLike = async () => {
    try {
      const newLikedState = !isLiked
      await api.likePoll(poll.id, newLikedState)

      // Update localStorage
      const likedPolls = JSON.parse(localStorage.getItem('likedPolls') || '[]')
      if (newLikedState) {
        likedPolls.push(poll.id)
      } else {
        const index = likedPolls.indexOf(poll.id)
        if (index > -1) likedPolls.splice(index, 1)
      }
      localStorage.setItem('likedPolls', JSON.stringify(likedPolls))
      setIsLiked(newLikedState)

      onUpdate()
    } catch (error) {
      console.error('Error liking poll:', error)
    }
  }

  const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className={`w-4 h-4 ${filled ? 'text-red-500 fill-red-500' : 'text-red-500'}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h3 className="font-medium mb-3 text-gray-900 line-clamp-2">{poll.title}</h3>

      <div className="space-y-2 mb-4">
        {poll.options.map((option, index) => {
          const votes = poll.votes[index] || 0
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${poll.id}-${index}`}
                  name={`poll-${poll.id}`}
                  value={index}
                  onChange={() => setSelectedOption(index)}
                  disabled={hasVoted}
                  className="text-blue-600 w-4 h-4"
                />
                <label
                  htmlFor={`${poll.id}-${index}`}
                  className="flex-1 cursor-pointer text-sm text-gray-700"
                >
                  {option}
                </label>
                <span className="text-xs text-gray-500">
                  {percentage.toFixed(0)}%
                </span>
              </div>

              <div className="ml-6">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{totalVotes}</span>
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center space-x-1 transition-colors ${showComments ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            <MessageCircle
              className={`w-4 h-4 ${showComments ? 'text-blue-600' : 'text-gray-500'}`}
              fill={showComments ? 'currentColor' : 'none'}
              stroke="currentColor"
            />
            <span>{poll.comments.length}</span>
          </button>

          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
          >
            <HeartIcon filled={isLiked} />
            <span>{poll.likes}</span>
          </button>
        </div>

        <button
          onClick={handleVote}
          disabled={selectedOption === null || hasVoted}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {hasVoted ? 'Voted' : 'Vote'}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Comments pollId={poll.id} comments={poll.comments} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  )
}
