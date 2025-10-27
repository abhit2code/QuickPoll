import { useState, useEffect } from 'react'
import { Comment, api } from '@/lib/api'

interface CommentsProps {
  pollId: number
  comments: Comment[]
  onUpdate: () => void
}

export default function Comments({ pollId, comments, onUpdate }: CommentsProps) {
  const [newComment, setNewComment] = useState('')
  const [likedComments, setLikedComments] = useState<number[]>([])

  useEffect(() => {
    // Load liked comments from localStorage
    const liked = JSON.parse(localStorage.getItem('likedComments') || '[]')
    setLikedComments(liked)
  }, [])

  const addComment = async () => {
    if (!newComment.trim()) return

    try {
      await api.addComment(pollId, newComment)
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
      setTimeout(onUpdate, 100)
    }
  }

  const likeComment = async (commentId: number) => {
    try {
      const isCurrentlyLiked = likedComments.includes(commentId)
      const newLikedState = !isCurrentlyLiked
      
      await api.likeComment(commentId, newLikedState)
      
      // Update localStorage
      let updatedLikes
      if (newLikedState) {
        updatedLikes = [...likedComments, commentId]
      } else {
        updatedLikes = likedComments.filter(id => id !== commentId)
      }
      
      setLikedComments(updatedLikes)
      localStorage.setItem('likedComments', JSON.stringify(updatedLikes))
    } catch (error) {
      console.error('Error liking comment:', error)
      setTimeout(onUpdate, 100)
    }
  }

  const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg 
      className={`w-3 h-3 ${filled ? 'text-red-500 fill-red-500' : 'text-red-500'}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" 
      strokeWidth="2" 
      viewBox="0 0 24 24"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )

  return (
    <div className="mt-4 border-t border-glass-border pt-4">
      <h4 className="font-semibold mb-3 text-text-primary text-glow">Comments ({comments.length})</h4>
      
      {/* Add Comment */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-2 glass-card rounded-md text-sm text-text-primary placeholder-text-muted focus:border-glass-accent focus:ring-1 focus:ring-glass-accent"
          onKeyPress={(e) => e.key === 'Enter' && addComment()}
        />
        <button
          onClick={addComment}
          className="px-3 py-2 glass-button rounded-md hover:bg-glass-button-hover text-sm transition-colors"
        >
          Post
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="glass-card p-3 rounded-md">
            <p className="text-sm mb-2 text-text-secondary">{comment.text}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-muted">
                {new Date(comment.created_at).toLocaleString()}
              </span>
              <button
                onClick={() => likeComment(comment.id)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  likedComments.includes(comment.id) ? 'text-red-400' : 'text-text-muted hover:text-red-400'
                }`}
              >
                <HeartIcon filled={likedComments.includes(comment.id)} />
                {comment.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
