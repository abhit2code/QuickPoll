import { config } from './config'

// Force HTTPS in production - aggressive fix
const API_BASE = config.apiUrl

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
  created_at?: string
}

export interface TrendingData {
  most_voted: Array<{ id: number; title: string; total_votes: number }>
  most_liked: Array<{ id: number; title: string; likes: number }>
  most_commented: Array<{ id: number; title: string; comment_count: number }>
}

export interface StatsData {
  total_polls: number
  active_polls: number
  total_votes: number
  total_likes: number
  total_comments: number
  polls_today: number
  avg_votes_per_poll: number
}

export const api = {
  async getConnections(): Promise<{ active_connections: number }> {
    const response = await fetch(`${API_BASE}/connections`)
    return response.json()
  },

  async getPolls(params?: {
    search?: string
    view?: string
    time_period?: string
    sort_by?: string
  }): Promise<Poll[]> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.view) searchParams.append('view', params.view)
    if (params?.time_period) searchParams.append('time_period', params.time_period)
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by)
    
    const url = `${API_BASE}/polls${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    console.log('🔧 api.getPolls URL:', url)
    
    const response = await fetch(url, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    return response.json()
  },

  async searchPolls(query: string): Promise<Poll[]> {
    const response = await fetch(`${API_BASE}/polls/search?q=${encodeURIComponent(query)}`)
    return response.json()
  },

  async getTrending(): Promise<TrendingData> {
    const response = await fetch(`${API_BASE}/polls/trending`)
    return response.json()
  },

  async getStats(): Promise<StatsData> {
    const response = await fetch(`${API_BASE}/polls/stats`)
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

  async likePoll(pollId: number, isLiked: boolean): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/polls/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poll_id: pollId, is_liked: isLiked })
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

  async likeComment(commentId: number, isLiked: boolean): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/polls/comment/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment_id: commentId, is_liked: isLiked })
    })
    return response.json()
  }
}
