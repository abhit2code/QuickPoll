'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Plus, X } from 'lucide-react'

interface PollFormProps {
  onPollCreated: () => void
}

export default function PollForm({ onPollCreated }: PollFormProps) {
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const updated = [...options]
    updated[index] = value
    setOptions(updated)
  }

  const createPoll = async () => {
    const validOptions = options.filter(opt => opt.trim())
    if (!title.trim() || validOptions.length < 2) return

    setIsSubmitting(true)
    try {
      await api.createPoll(title, validOptions)
      setTitle('')
      setOptions(['', ''])
      onPollCreated()
    } catch (error) {
      console.error('Error creating poll:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="What's your question?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 glass-card rounded-lg text-text-primary placeholder-text-muted focus:border-glass-accent focus:ring-1 focus:ring-glass-accent"
      />
      
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-1 p-3 glass-card rounded-lg text-text-primary placeholder-text-muted focus:border-glass-accent focus:ring-1 focus:ring-glass-accent"
            />
            {options.length > 2 && (
              <button
                onClick={() => removeOption(index)}
                className="p-2 text-text-muted hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={addOption}
          className="flex items-center space-x-2 px-4 py-2 glass-button border border-glass-border rounded-lg hover:bg-glass-button-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Option</span>
        </button>
        
        <button
          onClick={createPoll}
          disabled={!title.trim() || options.filter(opt => opt.trim()).length < 2 || isSubmitting}
          className="px-6 py-2 glass-button rounded-lg hover:bg-glass-button-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </button>
      </div>
    </div>
  )
}
