// Centralized configuration
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url
  console.log('🔧 getApiUrl:', { 
    env: process.env.NEXT_PUBLIC_API_URL,
    original: url, 
    cleaned: cleanUrl,
    isProduction: process.env.NODE_ENV === 'production'
  })
  return cleanUrl
}

export const config = {
  apiUrl: getApiUrl(),
  wsUrl: (() => {
    const apiUrl = getApiUrl()
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
