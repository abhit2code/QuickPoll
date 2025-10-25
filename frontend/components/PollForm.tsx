import { useState } from 'react'
import { api } from '@/lib/api'

interface PollFormProps {
  onPollCreated: () => void
}

export default function PollForm({ onPollCreated }: PollFormProps) {
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState(['', ''])

  const addOption = () => {
    setOptions([...options, ''])
  }

  const updateOption = (index: number, value: string) => {
    const updated = [...options]
    updated[index] = value
    setOptions(updated)
  }

  const createPoll = async () => {
    const validOptions = options.filter(opt => opt.trim())
    if (!title.trim() || validOptions.length < 2) return

    try {
      await api.createPoll(title, validOptions)
      setTitle('')
      setOptions(['', ''])
      setTimeout(onPollCreated, 100)
    } catch (error) {
      console.error('Error creating poll:', error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Poll</h2>
      
      <input
        type="text"
        placeholder="Poll title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded-md mb-4"
      />
      
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => updateOption(index, e.target.value)}
          className="w-full p-3 border rounded-md mb-2"
        />
      ))}
      
      <div className="flex gap-2">
        <button
          onClick={addOption}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Add Option
        </button>
        <button
          onClick={createPoll}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Poll
        </button>
      </div>
    </div>
  )
}
