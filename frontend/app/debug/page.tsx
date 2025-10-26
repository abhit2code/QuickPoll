'use client'

import { config } from '@/lib/config'

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Debug</h1>
      <div className="space-y-2">
        <p><strong>API URL:</strong> {config.apiUrl}</p>
        <p><strong>WebSocket URL:</strong> {config.wsUrl}</p>
        <p><strong>Environment Variable:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
        <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  )
}
