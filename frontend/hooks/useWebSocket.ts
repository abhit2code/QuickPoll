import { useEffect, useState, useRef } from 'react'
import { Comment } from '@/lib/api'
import { config } from '@/lib/config'

interface WebSocketMessage {
  type: string
  poll_id?: number
  votes?: number[]
  likes?: number
  comment?: Comment
  comment_id?: number
}

// Global state - only one WebSocket per browser tab
let ws: WebSocket | null = null
let isConnected = false
let componentCount = 0
let messageHandlers: ((data: WebSocketMessage) => void)[] = []

export const useWebSocket = (onMessage: (data: WebSocketMessage) => void) => {
  const [connected, setConnected] = useState(isConnected)
  const handlerRef = useRef(onMessage)

  // Update handler ref
  useEffect(() => {
    handlerRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    componentCount++
    console.log(`Component mounted. Total: ${componentCount}`)

    // Add this component's handler
    const handler = (data: WebSocketMessage) => handlerRef.current(data)
    messageHandlers.push(handler)

    // Create WebSocket only if it doesn't exist or is closed
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      console.log('Creating new WebSocket connection')
      const wsUrl = config.wsUrl
      console.log('WebSocket URL:', wsUrl)
      ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('WebSocket opened')
        isConnected = true
        setConnected(true)
      }
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log('WebSocket message:', data)
        // Send to all handlers
        messageHandlers.forEach(h => h(data))
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code)
        isConnected = false
        setConnected(false)
        ws = null
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } else if (ws.readyState === WebSocket.OPEN) {
      console.log('Using existing open WebSocket')
      setConnected(true)
    } else {
      console.log('WebSocket connecting...')
      setConnected(false)
    }

    // Cleanup when component unmounts
    return () => {
      componentCount--
      console.log(`Component unmounted. Remaining: ${componentCount}`)
      
      // Remove this component's handler
      const index = messageHandlers.indexOf(handler)
      if (index > -1) {
        messageHandlers.splice(index, 1)
      }
      
      // Only close WebSocket if no components are left AND we're not in StrictMode double-mount
      if (componentCount === 0 && messageHandlers.length === 0) {
        // Add small delay to handle React StrictMode
        setTimeout(() => {
          if (componentCount === 0 && ws) {
            console.log('Closing WebSocket - truly no more components')
            ws.close()
          }
        }, 100)
      }
    }
  }, []) // No dependencies to prevent re-runs

  return { connected }
}
