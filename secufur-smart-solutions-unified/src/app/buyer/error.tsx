'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={styles.errorPage}>
      <div className={styles.container}>
        <div className={styles.content}>
          <svg
            className={styles.errorIcon}
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
          <h1 className={styles.title}>Something Went Wrong</h1>
          <p className={styles.description}>
            We apologize for the inconvenience. An unexpected error has occurred.
            Please try again or contact our support team if the problem persists.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className={styles.errorDetails}>
              <p className={styles.errorName}>{error.name}</p>
              <p className={styles.errorMessage}>{error.message}</p>
              {error.digest && (
                <p className={styles.errorDigest}>Error ID: {error.digest}</p>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button onClick={reset} className={styles.primaryButton}>
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className={styles.secondaryButton}
            >
              Go to Home
            </button>
          </div>
        </div>

        <div className={styles.helpSection}>
          <h3 className={styles.helpTitle}>Need Help?</h3>
          <p className={styles.helpText}>
            If this error keeps occurring, please reach out to our support team.
          </p>
          <div className={styles.helpLinks}>
            <a href="/buyer/help">Help Center</a>
            <a href="/buyer/contact">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
