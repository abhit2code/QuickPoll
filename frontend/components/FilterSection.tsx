'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Filter } from 'lucide-react'

interface FilterSectionProps {
  onFilterChange?: (filters: any) => void
}

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [filters, setFilters] = useState({
    view: 'All Polls',
    timePeriod: 'All Time',
    sortBy: 'Newest First'
  })

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filterOptions = {
    view: ['All Polls', 'My Polls', 'Polls I Voted', 'Polls I Haven\'t Voted', 'Liked Polls'],
    timePeriod: ['All Time', 'Today', 'This Week', 'This Month'],
    sortBy: ['Newest First', 'Oldest First', 'Most Popular', 'Most Voted', 'Most Comments']
  }

  const handleFilterChange = (category: string, value: string) => {
    const newFilters = { ...filters, [category]: value }
    setFilters(newFilters)
    setOpenDropdown(null)
    onFilterChange?.(newFilters)
  }

  const clearFilter = (category: string) => {
    const defaults = { view: 'All Polls', timePeriod: 'All Time', sortBy: 'Newest First' }
    const newFilters = { ...filters, [category]: defaults[category as keyof typeof defaults] }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearAll = () => {
    const defaultFilters = {
      view: 'All Polls',
      timePeriod: 'All Time',
      sortBy: 'Newest First'
    }
    setFilters(defaultFilters)
    onFilterChange?.(defaultFilters)
  }

  const applyFilters = () => {
    onFilterChange?.(filters)
  }

  const isFilterActive = (category: string) => {
    const defaults = { view: 'All Polls', timePeriod: 'All Time', sortBy: 'Newest First' }
    return filters[category as keyof typeof filters] !== defaults[category as keyof typeof defaults]
  }

  return (
    <div className="glass-card rounded-lg p-4 mt-5 relative z-[100]" ref={dropdownRef}>
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-glass-accent"/>
        <h3 className="font-semibold text-text-primary text-glow">Filters</h3>
      </div>

      <div className="space-y-3">
        {/* TIME PERIOD */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-text-muted">TIME PERIOD</label>
            {isFilterActive('timePeriod') && (
              <button
                onClick={() => clearFilter('timePeriod')}
                className="text-xs text-glass-accent hover:text-text-primary transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'timePeriod' ? null : 'timePeriod')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm glass-card rounded-lg hover:bg-glass-button-hover transition-colors ${
              isFilterActive('timePeriod') ? 'border-glass-accent bg-glass-button' : ''
            }`}
          >
            <span className="text-text-secondary">{filters.timePeriod}</span>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>
          {openDropdown === 'timePeriod' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-section-gradient border border-glass-border rounded-lg z-[50] shadow-lg max-h-48 overflow-y-auto">
              {filterOptions.timePeriod.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange('timePeriod', option)}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-glass-button-hover first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SORT BY */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-text-muted">SORT BY</label>
            {isFilterActive('sortBy') && (
              <button
                onClick={() => clearFilter('sortBy')}
                className="text-xs text-glass-accent hover:text-text-primary transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sortBy' ? null : 'sortBy')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm glass-card rounded-lg hover:bg-glass-button-hover transition-colors ${
              isFilterActive('sortBy') ? 'border-glass-accent bg-glass-button' : ''
            }`}
          >
            <span className="text-text-secondary">{filters.sortBy}</span>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>
          {openDropdown === 'sortBy' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-section-gradient border border-glass-border rounded-lg z-[50] shadow-lg max-h-48 overflow-y-auto">
              {filterOptions.sortBy.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange('sortBy', option)}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-glass-button-hover first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={clearAll}
          className="flex-1 px-3 py-2 text-sm glass-button rounded-lg hover:bg-glass-button-hover transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 px-3 py-2 text-sm glass-button rounded-lg hover:bg-glass-button-hover transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  )
}
