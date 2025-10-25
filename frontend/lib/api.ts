const API_BASE = typeof window !== 'undefined' 
  ? 'http://localhost:8000'  // Browser (client-side)
  : 'http://backend:8000'    // Server-side in Docker

export interface Comment {
  id: number
  text: string
  likes: number
  created_at: string
}

export interface Poll {
  id: number
  title: string
  options: string[]
  votes: number[]
  likes: number
  comments: Comment[]
}

export const api = {
  async getPolls(): Promise<Poll[]> {
    const response = await fetch(`${API_BASE}/polls`)
    return response.json()
  },

  async createPoll(title: string, options: string[]): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, options })
    })
    return response.json()
  },

  async vote(pollId: number, optionIndex: number): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/polls/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poll_id: pollId, option_index: optionIndex })
    })
    return response.json()
  },

  async likePoll(pollId: number): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/polls/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poll_id: pollId })
    })
    return response.json()
  },

  async addComment(pollId: number, text: string): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE}/polls/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poll_id: pollId, text })
    })
    return response.json()
  },

  async likeComment(commentId: number): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/polls/comment/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment_id: commentId })
    })
    return response.json()
  }
}
