'use client';

import { useEffect, useState } from 'react';
import styles from './NetworkStatus.module.css';

export function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [showNetworkError, setShowNetworkError] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOffline(!navigator.onLine);

    // Handle online/offline events
    const handleOnline = () => {
      setIsOffline(false);
      setShowNetworkError(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    // Handle API network errors
    const handleNetworkError = () => {
      setShowNetworkError(true);
      setTimeout(() => {
        setShowNetworkError(false);
      }, 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('network-error', handleNetworkError);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('network-error', handleNetworkError);
    };
  }, []);

  if (!isOffline && !showNetworkError) {
    return null;
  }

  return (
    <div className={`${styles.banner} ${isOffline ? styles.offline : styles.error}`}>
      <div className={styles.content}>
        <svg
          className={styles.icon}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOffline ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          )}
        </svg>
        <span className={styles.message}>
          {isOffline
            ? 'You are offline. Please check your internet connection.'
            : 'Network error. Please try again.'}
        </span>
        {!isOffline && (
          <button
            onClick={() => setShowNetworkError(false)}
            className={styles.dismiss}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default NetworkStatus;
