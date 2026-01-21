// Authentication Types

export interface User {
  id: string;
  email: string;
  mobile?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImage?: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiresAt: string | null;
}

export interface SignUpCredentials {
  email?: string;
  mobile?: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

export interface SignInCredentials {
  email?: string;
  mobile?: string;
  password?: string;
  otp?: string;
  rememberMe?: boolean;
}

export interface OTPRequest {
  mobile?: string;
  email?: string;
  purpose: 'signup' | 'signin' | 'forgot_password' | 'verify_mobile' | 'verify_email';
}

export interface OTPVerification {
  mobile?: string;
  email?: string;
  otp: string;
  purpose: 'signup' | 'signin' | 'forgot_password' | 'verify_mobile' | 'verify_email';
}

export interface ForgotPasswordRequest {
  email?: string;
  mobile?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  password: string;
}

export interface ChangeMobileRequest {
  newMobile: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SocialAuthProvider {
  provider: 'google' | 'apple';
  token: string;
}

export interface PasswordRules {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface AccountLockInfo {
  isLocked: boolean;
  lockedUntil?: string;
  failedAttempts: number;
  maxAttempts: number;
}

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  location?: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}
