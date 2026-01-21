'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SessionExpiredModal.module.css';

export function SessionExpiredModal() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsVisible(true);
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const handleSignIn = () => {
    setIsVisible(false);
    router.push('/buyer/sign-in');
  };

  const handleContinue = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className={styles.title}>Session Expired</h2>
        <p className={styles.message}>
          Your session has expired for security reasons. Please sign in again to continue.
        </p>
        <div className={styles.actions}>
          <button onClick={handleSignIn} className={styles.primaryButton}>
            Sign In
          </button>
          <button onClick={handleContinue} className={styles.secondaryButton}>
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionExpiredModal;
