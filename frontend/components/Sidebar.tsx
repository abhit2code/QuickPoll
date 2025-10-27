'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, BarChart3 } from 'lucide-react'
import FilterSection from './FilterSection'
import { api, TrendingData, StatsData } from '@/lib/api'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  onFilterChange?: (filters: any) => void
  refreshTrigger?: number
}

export default function Sidebar({ isOpen = true, onClose, onFilterChange, refreshTrigger }: SidebarProps) {
  const [trending, setTrending] = useState<TrendingData | null>(null)
  const [stats, setStats] = useState<StatsData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, statsData] = await Promise.all([
          api.getTrending(),
          api.getStats()
        ])
        setTrending(trendingData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching sidebar data:', error)
      }
    }

    fetchData()
    // Refresh data every 10 seconds for more responsive updates
    // const interval = setInterval(fetchData, 10000)
    // return () => clearInterval(interval)
  }, [refreshTrigger])

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-28 lg:top-16 right-0
        w-80 lg:w-[calc(30%-22px)] h-[calc(100vh-4rem)] lg:h-[calc(100vh-7.0rem)]
        glass-panel border-l lg:border border-glass-border
        transform transition-transform duration-300 ease-in-out z-40 lg:z-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        overflow-y-auto lg:overflow-hidden lg:flex lg:items-center lg:justify-center
        lg:mr-[26px] lg:mt-[26px] lg:mb-[26px] lg:rounded-lg
      `}>
        <div className="h-full w-full lg:max-w-sm lg:mx-auto flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 lg:py-6 space-y-4 lg:space-y-6">
            {/* Filter Section */}
            <FilterSection onFilterChange={onFilterChange} />

            {/* Trending Section */}
            <div className="glass-card rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold text-text-primary text-glow">Trending</h3>
              </div>
              <div className="space-y-3 text-sm">
                {trending ? (
                  <>
                    <div>
                      <div className="font-medium text-text-secondary mb-1">Most Voted</div>
                      {trending.most_voted.slice(0, 1).map((poll, index) => (
                        <div key={poll.id} className="flex items-center justify-between text-xs text-text-muted mb-1">
                          <span className="truncate flex-1 mr-2">{poll.title}</span>
                          <span className="font-medium text-text-secondary">{poll.total_votes}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-medium text-text-secondary mb-1">Most Liked</div>
                      {trending.most_liked.slice(0, 1).map((poll, index) => (
                        <div key={poll.id} className="flex items-center justify-between text-xs text-text-muted mb-1">
                          <span className="truncate flex-1 mr-2">{poll.title}</span>
                          <span className="font-medium text-text-secondary">{poll.likes}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-text-muted text-xs">Loading trending...</div>
                )}
              </div>
            </div>

            {/* Quick Stats Section */}
            <div className="glass-card rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-glass-accent" />
                <h3 className="font-semibold text-text-primary text-glow">Quick Stats</h3>
              </div>
              <div className="space-y-3 text-sm">
                {stats ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Total Polls:</span>
                      <span className="font-medium text-text-secondary">{stats.total_polls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Total Votes:</span>
                      <span className="font-medium text-text-secondary">{stats.total_votes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Total Likes:</span>
                      <span className="font-medium text-text-secondary">{stats.total_likes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Today Polls:</span>
                      <span className="font-medium text-text-secondary">{stats.polls_today}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Avg Votes:</span>
                      <span className="font-medium text-text-secondary">{stats.avg_votes_per_poll}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-text-muted text-xs">Loading stats...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
