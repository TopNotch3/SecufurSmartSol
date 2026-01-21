'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Loader } from '@/components/buyer/common';
import { useAuthStore, toast } from '@/store/buyer';
import { authService } from '@/services/buyer';
import styles from '../auth.module.css';

type SignInMethod = 'email' | 'mobile';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const { login, setLoading, setError, setAccountLock, isLoading, error, accountLock } = useAuthStore();

  const [method, setMethod] = useState<SignInMethod>('email');
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    rememberMe: false,
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (method === 'email') {
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
      if (!formData.password.trim()) {
        errors.password = 'Password is required';
      }
    } else {
      if (!formData.mobile.trim()) {
        errors.mobile = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
        errors.mobile = 'Invalid mobile number';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (method === 'mobile' && !showOtpInput) {
        // Request OTP
        await authService.requestOTP({
          mobile: formData.mobile,
          purpose: 'signin',
        });
        setShowOtpInput(true);
        toast.success('OTP sent to your mobile number');
      } else if (method === 'mobile' && showOtpInput) {
        // Sign in with OTP
        const response = await authService.signInWithOTP(formData.mobile, otp);
        login(response.user, response.tokens);
        toast.success('Welcome back!');
        router.push(redirectTo);
      } else {
        // Sign in with email/password
        const response = await authService.signIn({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });
        login(response.user, response.tokens);
        toast.success('Welcome back!');
        router.push(redirectTo);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string; code?: string; data?: { failedAttempts?: number; maxAttempts?: number; lockedUntil?: string } };
      const errorMessage = errorObj.message || 'Failed to sign in';

      // Check for account lock
      if (errorObj.code === 'ACCOUNT_LOCKED' && errorObj.data) {
        setAccountLock({
          isLocked: true,
          lockedUntil: errorObj.data.lockedUntil,
          failedAttempts: errorObj.data.failedAttempts || 0,
          maxAttempts: errorObj.data.maxAttempts || 5,
        });
      } else if (errorObj.code === 'INVALID_CREDENTIALS' && errorObj.data) {
        setAccountLock({
          isLocked: false,
          failedAttempts: errorObj.data.failedAttempts || 0,
          maxAttempts: errorObj.data.maxAttempts || 5,
        });
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    toast.info(`${provider} login coming soon`);
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>Welcome back to LUVARTE</p>

          {/* Method Selector */}
          <div className={styles.methodSelector}>
            <button
              type="button"
              className={`${styles.methodButton} ${method === 'email' ? styles.active : ''}`}
              onClick={() => {
                setMethod('email');
                setShowOtpInput(false);
              }}
            >
              Email
            </button>
            <button
              type="button"
              className={`${styles.methodButton} ${method === 'mobile' ? styles.active : ''}`}
              onClick={() => {
                setMethod('mobile');
                setShowOtpInput(false);
              }}
            >
              Mobile OTP
            </button>
          </div>

          {/* Account Lock Warning */}
          {accountLock && !accountLock.isLocked && accountLock.failedAttempts > 0 && (
            <div className={styles.lockWarning}>
              <strong>Warning:</strong> {accountLock.failedAttempts} of {accountLock.maxAttempts}{' '}
              failed attempts. Your account will be locked after {accountLock.maxAttempts} failed
              attempts.
            </div>
          )}

          {accountLock?.isLocked && (
            <div className={styles.errorBanner}>
              Your account is temporarily locked. Please try again after{' '}
              {accountLock.lockedUntil
                ? new Date(accountLock.lockedUntil).toLocaleTimeString()
                : 'some time'}
              .
            </div>
          )}

          {error && !accountLock?.isLocked && <div className={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {method === 'email' ? (
              <>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                  required
                  fullWidth
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={formErrors.password}
                  showPasswordToggle
                  required
                  fullWidth
                />
                <div className={styles.optionsRow}>
                  <label className={styles.rememberMe}>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <span>Remember me</span>
                  </label>
                  <Link href="/buyer/forgot-password" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Input
                  label="Mobile Number"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  error={formErrors.mobile}
                  placeholder="+91 XXXXXXXXXX"
                  required
                  fullWidth
                  disabled={showOtpInput}
                />
                {showOtpInput && (
                  <Input
                    label="Enter OTP"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                    fullWidth
                  />
                )}
              </>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={accountLock?.isLocked}
            >
              {method === 'mobile' && !showOtpInput
                ? 'Get OTP'
                : method === 'mobile' && showOtpInput
                ? 'Verify & Sign In'
                : 'Sign In'}
            </Button>
          </form>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.socialButtons}>
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleSocialAuth('google')}
              leftIcon={
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              }
            >
              Continue with Google
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleSocialAuth('apple')}
              leftIcon={
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              }
            >
              Continue with Apple
            </Button>
          </div>

          <p className={styles.footer}>
            Don&apos;t have an account?{' '}
            <Link href="/buyer/sign-up" className={styles.link}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className={styles.authPage}><Loader size="lg" /></div>}>
      <SignInContent />
    </Suspense>
  );
}
