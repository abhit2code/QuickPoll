// Centralized configuration
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  wsUrl: (() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return apiUrl.replace('http', 'ws') + '/ws'
  })()
}

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔧 Frontend Config:', {
    apiUrl: config.apiUrl,
    wsUrl: config.wsUrl,
    env: process.env.NEXT_PUBLIC_API_URL
  })
}
