'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Loader } from '@/components/buyer/common';
import { toast } from '@/store/buyer';
import { authService } from '@/services/buyer';
import styles from '../auth.module.css';

type ResetMethod = 'email' | 'mobile';
type Step = 'request' | 'verify' | 'reset' | 'success';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [method, setMethod] = useState<ResetMethod>('email');
  const [step, setStep] = useState<Step>(tokenFromUrl ? 'reset' : 'request');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState(tokenFromUrl || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('One number');
    if (!/[!@#$%^&*]/.test(pwd)) errors.push('One special character');
    return errors;
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    if (method === 'email' && !email.trim()) {
      setFormErrors({ email: 'Email is required' });
      return;
    }

    if (method === 'mobile' && !mobile.trim()) {
      setFormErrors({ mobile: 'Mobile number is required' });
      return;
    }

    setIsLoading(true);

    try {
      if (method === 'email') {
        await authService.forgotPassword({ email });
        toast.success('Password reset link sent to your email');
        setStep('success');
      } else {
        await authService.requestOTP({ mobile, purpose: 'forgot_password' });
        toast.success('OTP sent to your mobile number');
        setStep('verify');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset request';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim() || otp.length !== 6) {
      setFormErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.verifyOTP({
        mobile,
        otp,
        purpose: 'forgot_password',
      });

      if (response.verified) {
        setToken(otp); // Using OTP as temporary token
        setStep('reset');
        toast.success('OTP verified successfully');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setFormErrors({ password: `Password must have: ${passwordErrors.join(', ')}` });
      return;
    }

    if (password !== confirmPassword) {
      setFormErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        token,
        password,
        confirmPassword,
      });
      toast.success('Password reset successfully!');
      setStep('success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Success State
  if (step === 'success') {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.verificationPending}>
              <svg className={styles.verificationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h2 className={styles.verificationTitle}>
                {method === 'email' ? 'Check Your Email' : 'Password Reset'}
              </h2>
              <p className={styles.verificationText}>
                {method === 'email'
                  ? `We've sent a password reset link to ${email}. Please check your inbox and follow the instructions.`
                  : 'Your password has been reset successfully. You can now sign in with your new password.'}
              </p>
              <Button onClick={() => router.push('/buyer/sign-in')}>
                {method === 'email' ? 'Back to Sign In' : 'Sign In Now'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <Link href="/buyer/sign-in" className={styles.backLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Sign In
          </Link>

          <h1 className={styles.title}>
            {step === 'request' && 'Forgot Password'}
            {step === 'verify' && 'Verify OTP'}
            {step === 'reset' && 'Reset Password'}
          </h1>
          <p className={styles.subtitle}>
            {step === 'request' && "Enter your email or mobile to reset your password"}
            {step === 'verify' && `Enter the OTP sent to ${mobile}`}
            {step === 'reset' && 'Create a new password for your account'}
          </p>

          {/* Method Selector - Only on request step */}
          {step === 'request' && (
            <div className={styles.methodSelector}>
              <button
                type="button"
                className={`${styles.methodButton} ${method === 'email' ? styles.active : ''}`}
                onClick={() => setMethod('email')}
              >
                Email
              </button>
              <button
                type="button"
                className={`${styles.methodButton} ${method === 'mobile' ? styles.active : ''}`}
                onClick={() => setMethod('mobile')}
              >
                Mobile
              </button>
            </div>
          )}

          {error && <div className={styles.errorBanner}>{error}</div>}

          {/* Request Step */}
          {step === 'request' && (
            <form onSubmit={handleRequestReset} className={styles.form}>
              {method === 'email' ? (
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={formErrors.email}
                  required
                  fullWidth
                />
              ) : (
                <Input
                  label="Mobile Number"
                  name="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  error={formErrors.mobile}
                  placeholder="+91 XXXXXXXXXX"
                  required
                  fullWidth
                />
              )}
              <Button type="submit" fullWidth isLoading={isLoading}>
                {method === 'email' ? 'Send Reset Link' : 'Send OTP'}
              </Button>
            </form>
          )}

          {/* Verify Step */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyOtp} className={styles.form}>
              <Input
                label="Enter OTP"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={formErrors.otp}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
                fullWidth
              />
              <Button type="submit" fullWidth isLoading={isLoading}>
                Verify OTP
              </Button>
              <p className={styles.footer}>
                Didn&apos;t receive OTP?{' '}
                <button
                  type="button"
                  className={styles.resendButton}
                  onClick={() => {
                    setStep('request');
                    setOtp('');
                  }}
                >
                  Resend
                </button>
              </p>
            </form>
          )}

          {/* Reset Step */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className={styles.form}>
              <Input
                label="New Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={formErrors.password}
                showPasswordToggle
                required
                fullWidth
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={formErrors.confirmPassword}
                showPasswordToggle
                required
                fullWidth
              />
              <Button type="submit" fullWidth isLoading={isLoading}>
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className={styles.authPage}><Loader size="lg" /></div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
