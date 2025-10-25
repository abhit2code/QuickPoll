import { useState } from 'react'
import { Comment, api } from '@/lib/api'

interface CommentsProps {
  pollId: number
  comments: Comment[]
  onUpdate: () => void
}

export default function Comments({ pollId, comments, onUpdate }: CommentsProps) {
  const [newComment, setNewComment] = useState('')

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
      await api.likeComment(commentId)
    } catch (error) {
      console.error('Error liking comment:', error)
      setTimeout(onUpdate, 100)
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold mb-3">Comments ({comments.length})</h4>
      
      {/* Add Comment */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-2 border rounded-md text-sm"
          onKeyPress={(e) => e.key === 'Enter' && addComment()}
        />
        <button
          onClick={addComment}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Post
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm mb-2">{comment.text}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
              <button
                onClick={() => likeComment(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600"
              >
                ❤️ {comment.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
