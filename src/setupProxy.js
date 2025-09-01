const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding to backend
      },
      onProxyReq: (proxyReq) => {
        // Add any custom headers here if needed
        if (process.env.NODE_ENV === 'development') {
          // For development, you might want to add some debug headers
          proxyReq.setHeader('X-Forwarded-For', '127.0.0.1');
        }
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy error', details: err.message });
      },
      logLevel: 'debug', // Enable for debugging proxy issues
    })
  );

  // WebSocket proxy for development
  app.use(
    '/ws',
    createProxyMiddleware({
      target: process.env.REACT_APP_WS_URL || 'ws://localhost:8000',
      ws: true,
      changeOrigin: true,
      logLevel: 'debug', // Enable for debugging WebSocket issues
    })
  );
};
