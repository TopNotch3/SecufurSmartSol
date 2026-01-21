'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Loader } from '@/components/buyer/common';
import { toast } from '@/store/buyer';
import { authService } from '@/services/buyer';
import styles from '../auth.module.css';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type') || 'email';

  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please request a new one.');
      return;
    }

    const verifyToken = async () => {
      try {
        if (type === 'email') {
          const response = await authService.verifyEmail(token);
          if (response.verified) {
            setStatus('success');
            setMessage('Your email has been verified successfully!');
            toast.success('Email verified successfully!');
          } else {
            setStatus('error');
            setMessage(response.message || 'Verification failed');
          }
        } else if (type === 'reset') {
          const response = await authService.verifyResetToken(token);
          if (response.valid) {
            // Redirect to reset password page with token
            router.push(`/buyer/forgot-password?token=${token}`);
          } else {
            setStatus('expired');
            setMessage('This password reset link has expired. Please request a new one.');
          }
        }
      } catch (err: unknown) {
        const error = err as { message?: string; code?: string };
        if (error.code === 'TOKEN_EXPIRED') {
          setStatus('expired');
          setMessage('This verification link has expired. Please request a new one.');
        } else {
          setStatus('error');
          setMessage(error.message || 'Verification failed. Please try again.');
        }
      }
    };

    verifyToken();
  }, [token, type, router]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await authService.resendVerificationEmail();
      toast.success('Verification email sent!');
      setMessage('A new verification email has been sent. Please check your inbox.');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend verification email';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // Loading State
  if (status === 'loading') {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.verificationPending}>
              <Loader size="lg" />
              <p className={styles.verificationText}>Verifying your {type}...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (status === 'success') {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.verificationPending}>
              <svg
                className={styles.verificationIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: 'var(--color-success)' }}
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h2 className={styles.verificationTitle}>Verified!</h2>
              <p className={styles.verificationText}>{message}</p>
              <Button onClick={() => router.push('/buyer')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expired State
  if (status === 'expired') {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.verificationPending}>
              <svg
                className={styles.verificationIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: 'var(--color-warning)' }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h2 className={styles.verificationTitle}>Link Expired</h2>
              <p className={styles.verificationText}>{message}</p>
              {type === 'email' ? (
                <Button onClick={handleResendVerification} isLoading={isResending}>
                  Resend Verification Email
                </Button>
              ) : (
                <Button onClick={() => router.push('/buyer/forgot-password')}>
                  Request New Reset Link
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.verificationPending}>
            <svg
              className={styles.verificationIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--color-error)' }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <h2 className={styles.verificationTitle}>Verification Failed</h2>
            <p className={styles.verificationText}>{message}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {type === 'email' && (
                <Button onClick={handleResendVerification} isLoading={isResending}>
                  Resend Verification Email
                </Button>
              )}
              <Link href="/buyer/sign-in">
                <Button variant="outline" fullWidth>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className={styles.authPage}><Loader size="lg" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
