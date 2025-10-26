'use client'

import { TrendingUp, BarChart3 } from 'lucide-react'
import FilterSection from './FilterSection'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
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
        fixed lg:sticky top-16 right-0 lg:right-auto
        w-80 lg:w-full h-[calc(100vh-4rem)] lg:h-auto
        bg-white border-l lg:border-l-0 lg:border-r border-gray-200
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        overflow-hidden
      `}>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Filter Section */}
            <FilterSection />

            {/* Trending Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Trending</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Most voted</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Most liked</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Polls:</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active:</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Votes:</span>
                  <span className="font-medium">23</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Space - Fixed at bottom */}
          <div className="p-6 pt-0">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Ad space / Info</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
