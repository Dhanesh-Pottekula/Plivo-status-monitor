export const envDefaults = {
    nodeApiUrl: import.meta.env.VITE_NODE_API_URL || 'https://plivo-status-monitor.onrender.com',
    wsUrl: import.meta.env.VITE_WS_URL || 'wss://plivo-status-monitor.onrender.com',
    // nodeApiUrl: import.meta.env.VITE_NODE_API_URL || 'http://localhost:8000',
    // wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8765/',
}