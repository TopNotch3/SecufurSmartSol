import { api, setTokens, clearTokens } from './api';
import {
  User,
  AuthTokens,
  SignUpCredentials,
  SignInCredentials,
  OTPRequest,
  OTPVerification,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangeEmailRequest,
  ChangeMobileRequest,
  SocialAuthProvider,
  SessionInfo,
} from '@/types/buyer/auth';

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

interface OTPResponse {
  sent: boolean;
  expiresIn: number;
  message: string;
}

interface VerificationResponse {
  verified: boolean;
  user?: User;
  tokens?: AuthTokens;
}

export const authService = {
  // Sign Up
  signUp: async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    if (response.data.tokens) {
      setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    return response.data;
  },

  // Sign In with Email/Password
  signIn: async (credentials: SignInCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin', credentials);
    if (response.data.tokens) {
      setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    return response.data;
  },

  // Sign In with OTP
  signInWithOTP: async (mobile: string, otp: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin/otp', { mobile, otp });
    if (response.data.tokens) {
      setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    return response.data;
  },

  // Social Auth
  socialAuth: async (provider: SocialAuthProvider): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/social', provider);
    if (response.data.tokens) {
      setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    return response.data;
  },

  // Request OTP
  requestOTP: async (request: OTPRequest): Promise<OTPResponse> => {
    const response = await api.post<OTPResponse>('/auth/otp/request', request);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (verification: OTPVerification): Promise<VerificationResponse> => {
    const response = await api.post<VerificationResponse>('/auth/otp/verify', verification);
    if (response.data.tokens) {
      setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (request: ForgotPasswordRequest): Promise<{ sent: boolean; message: string }> => {
    const response = await api.post<{ sent: boolean; message: string }>('/auth/forgot-password', request);
    return response.data;
  },

  // Reset Password
  resetPassword: async (request: ResetPasswordRequest): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>('/auth/reset-password', request);
    return response.data;
  },

  // Verify Reset Token
  verifyResetToken: async (token: string): Promise<{ valid: boolean; email?: string }> => {
    const response = await api.get<{ valid: boolean; email?: string }>(`/auth/reset-password/verify/${token}`);
    return response.data;
  },

  // Change Password (logged in)
  changePassword: async (request: ChangePasswordRequest): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>('/auth/change-password', request);
    return response.data;
  },

  // Change Email
  changeEmail: async (request: ChangeEmailRequest): Promise<{ verificationSent: boolean; message: string }> => {
    const response = await api.post<{ verificationSent: boolean; message: string }>('/auth/change-email', request);
    return response.data;
  },

  // Change Mobile
  changeMobile: async (request: ChangeMobileRequest): Promise<{ otpSent: boolean; message: string }> => {
    const response = await api.post<{ otpSent: boolean; message: string }>('/auth/change-mobile', request);
    return response.data;
  },

  // Get Current User
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>('/auth/refresh', { refreshToken });
    if (response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearTokens();
    }
  },

  // Logout All Devices
  logoutAllDevices: async (): Promise<void> => {
    try {
      await api.post('/auth/logout-all');
    } finally {
      clearTokens();
    }
  },

  // Get Sessions
  getSessions: async (): Promise<SessionInfo[]> => {
    const response = await api.get<SessionInfo[]>('/auth/sessions');
    return response.data;
  },

  // Revoke Session
  revokeSession: async (sessionId: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  // Verify Email Token
  verifyEmail: async (token: string): Promise<{ verified: boolean; message: string }> => {
    const response = await api.get<{ verified: boolean; message: string }>(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend Verification Email
  resendVerificationEmail: async (): Promise<{ sent: boolean; message: string }> => {
    const response = await api.post<{ sent: boolean; message: string }>('/auth/resend-verification');
    return response.data;
  },

  // Check if email exists
  checkEmail: async (email: string): Promise<{ exists: boolean }> => {
    const response = await api.get<{ exists: boolean }>('/auth/check-email', { email });
    return response.data;
  },

  // Check if mobile exists
  checkMobile: async (mobile: string): Promise<{ exists: boolean }> => {
    const response = await api.get<{ exists: boolean }>('/auth/check-mobile', { mobile });
    return response.data;
  },
};

export default authService;
