'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Menu } from 'lucide-react'
import { api } from '@/lib/api'
import { config } from '@/lib/config'

interface HeaderProps {
  onNewPoll: () => void
  onToggleSidebar?: () => void
  onSearch?: (query: string) => void
  connected: boolean
}

export default function Header({ onNewPoll, onToggleSidebar, onSearch, connected }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [connectionCount, setConnectionCount] = useState(0)

  useEffect(() => {
    console.log('🔧 Header - API Config:', config.apiUrl)
    
    const fetchConnections = async () => {
      try {
        const data = await api.getConnections()
        setConnectionCount(data.active_connections)
      } catch (error) {
        console.error('Error fetching connections:', error)
      }
    }

    fetchConnections()
    const interval = setInterval(fetchConnections, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-glass-border">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-text-primary" style={{textShadow: '0 0 8px rgba(255, 255, 255, 0.4)'}}>QuickPoll</h1>
            <div className={`text-sm px-2 py-1 rounded flex items-center space-x-2 glass-card ${connected ? 'border-green-400/30' : 'border-red-400/30'}`}>
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-xs font-medium text-text-secondary">{connectionCount + ' Online'}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 glass-card rounded-lg text-text-primary placeholder-text-muted focus:border-glass-accent focus:ring-1 focus:ring-glass-accent"
              />
            </form>
            <button 
              onClick={onNewPoll}
              className="flex items-center space-x-2 px-4 py-2 glass-button rounded-lg hover:bg-glass-button-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Poll</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-2">
            <button 
              onClick={onToggleSidebar}
              className="p-2 glass-button rounded-lg hover:bg-glass-button-hover transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={onNewPoll}
              className="p-2 glass-button rounded-lg hover:bg-glass-button-hover transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 glass-card rounded-lg text-text-primary placeholder-text-muted focus:border-glass-accent focus:ring-1 focus:ring-glass-accent"
            />
          </form>
        </div>
      </div>
    </header>
  )
}
