import { useEffect, useCallback, useRef } from 'react';
import { webSocketService } from '../services/websocketService';

export function useWebSocket(token: string, path: string, callbacks: {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onMessage?: (message: any) => void;
} = {}) {
  const { onOpen, onClose, onError, onMessage } = callbacks;
  const callbacksRef = useRef({ onOpen, onClose, onError, onMessage });

  // Update callbacks ref when dependencies change
  useEffect(() => {
    callbacksRef.current = { onOpen, onClose, onError, onMessage };
  }, [onOpen, onClose, onError, onMessage]);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (!token || !path) return;

    console.log('Setting up WebSocket connection for:', path);

    // Set up event listeners
    const handleOpen = (event: Event) => {
      console.log('WebSocket opened for path:', path);
      callbacksRef.current.onOpen?.(event);
    };

    const handleClose = (event: CloseEvent) => {
      console.log('WebSocket closed for path:', path);
      callbacksRef.current.onClose?.(event);
    };

    const handleError = (error: Event) => {
      console.error('WebSocket error for path:', path, error);
      callbacksRef.current.onError?.(error);
    };

    const handleMessage = (message: any) => {
      callbacksRef.current.onMessage?.(message);
    };

    // Register callbacks
    webSocketService.on('onOpen', handleOpen);
    webSocketService.on('onClose', handleClose);
    webSocketService.on('onError', handleError);
    webSocketService.on('onMessage', handleMessage);

    // Connect to WebSocket
    webSocketService.connect(path, token);

    // Cleanup function
    return () => {
      console.log('Cleaning up WebSocket connection for:', path);

      // Remove event listeners
      webSocketService.off('onOpen', handleOpen);
      webSocketService.off('onClose', handleClose);
      webSocketService.off('onError', handleError);
      webSocketService.off('onMessage', handleMessage);

      // Note: Don't disconnect here as other components might be using the same WebSocket
      // The WebSocket service should handle connection management
    };
  }, [token, path]);

  return webSocketService;
}