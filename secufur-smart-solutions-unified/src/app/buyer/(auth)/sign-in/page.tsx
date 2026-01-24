'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Loader } from '@/components/buyer/common';
import { useAuthStore, toast } from '@/store/buyer';
import { authService } from '@/services/buyer';
import styles from '../auth.module.css';



function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const { login, setLoading, setError, setAccountLock, isLoading, error, accountLock } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
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
      // Sign in with email/password
      const response = await authService.signIn({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      login(response.user, response.tokens);
      toast.success('Welcome back!');
      router.push(redirectTo);
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
          <p className={styles.subtitle}>Welcome back to Secufur Smart Solutions</p>

          {error && !accountLock?.isLocked && <div className={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
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

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={accountLock?.isLocked}
            >
              Sign In
            </Button>
          </form>

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
