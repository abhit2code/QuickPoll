import { Poll, api } from '@/lib/api'
import Comments from './Comments'

interface PollCardProps {
  poll: Poll
  onUpdate: () => void
}

export default function PollCard({ poll, onUpdate }: PollCardProps) {
  const totalVotes = poll.votes.reduce((sum, votes) => sum + votes, 0)

  const vote = async (optionIndex: number) => {
    try {
      await api.vote(poll.id, optionIndex)
    } catch (error) {
      console.error('Error voting:', error)
      setTimeout(onUpdate, 100)
    }
  }

  const likePoll = async () => {
    try {
      await api.likePoll(poll.id)
    } catch (error) {
      console.error('Error liking poll:', error)
      setTimeout(onUpdate, 100)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{poll.title}</h3>
        <button
          onClick={likePoll}
          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
        >
          ❤️ {poll.likes}
        </button>
      </div>
      
      <div className="space-y-3">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? (poll.votes[index] / totalVotes) * 100 : 0
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span>{option}</span>
                <span className="text-sm text-gray-600">
                  {poll.votes[index]} votes ({percentage.toFixed(1)}%)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <button
                  onClick={() => vote(index)}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
                >
                  Vote
                </button>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Total votes: {totalVotes}
      </div>

      <Comments 
        pollId={poll.id} 
        comments={poll.comments} 
        onUpdate={onUpdate} 
      />
    </div>
  )
}
