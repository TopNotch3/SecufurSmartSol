'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#FAF9F6',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '500px',
          padding: '48px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #000000',
          textAlign: 'center'
        }}>
          <svg
            style={{ width: '64px', height: '64px', color: '#DC2626', marginBottom: '24px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 style={{
            fontFamily: 'Oswald, sans-serif',
            fontSize: '24px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '#1A1A1A',
            margin: '0 0 16px 0'
          }}>
            Critical Error
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666666',
            margin: '0 0 32px 0',
            lineHeight: '1.6'
          }}>
            A critical error occurred. Please try again or contact support if the problem persists.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div style={{
              marginBottom: '32px',
              padding: '16px',
              backgroundColor: '#FAF9F6',
              border: '1px solid #000000',
              textAlign: 'left'
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#DC2626',
                margin: '0 0 8px 0'
              }}>
                {error.name}
              </p>
              <p style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#666666',
                margin: 0,
                wordBreak: 'break-word'
              }}>
                {error.message}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button
              onClick={reset}
              style={{
                padding: '12px 32px',
                backgroundColor: '#1E3A8A',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '12px 32px',
                backgroundColor: 'transparent',
                color: '#1A1A1A',
                border: '1px solid #000000',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
