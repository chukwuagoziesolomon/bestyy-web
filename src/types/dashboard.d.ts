import { ReactNode } from 'react';

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Dashboard component interfaces
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add any custom element types here if needed
    }
  }
}

export {};
