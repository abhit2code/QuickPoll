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
    <div className="bg-gray-50 rounded-lg p-4" ref={dropdownRef}>
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-blue-500"/>
        <h3 className="font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="space-y-3">
        {/* VIEW */}
        {/* <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-600">VIEW</label>
            {isFilterActive('view') && (
              <button
                onClick={() => clearFilter('view')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'view' ? null : 'view')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg hover:bg-white ${
              isFilterActive('view') ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
          >
            <span>{filters.view}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {openDropdown === 'view' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {filterOptions.view.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange('view', option)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div> */}

        {/* TIME PERIOD */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-600">TIME PERIOD</label>
            {isFilterActive('timePeriod') && (
              <button
                onClick={() => clearFilter('timePeriod')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'timePeriod' ? null : 'timePeriod')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg hover:bg-white ${
              isFilterActive('timePeriod') ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
          >
            <span>{filters.timePeriod}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {openDropdown === 'timePeriod' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {filterOptions.timePeriod.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange('timePeriod', option)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
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
            <label className="block text-xs font-medium text-gray-600">SORT BY</label>
            {isFilterActive('sortBy') && (
              <button
                onClick={() => clearFilter('sortBy')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sortBy' ? null : 'sortBy')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg hover:bg-white ${
              isFilterActive('sortBy') ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
          >
            <span>{filters.sortBy}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {openDropdown === 'sortBy' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {filterOptions.sortBy.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange('sortBy', option)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
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
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Clear All
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </div>
  )
}
