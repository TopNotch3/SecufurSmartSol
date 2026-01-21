import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthTokens, AccountLockInfo, SessionInfo } from '@/types/buyer/auth';

interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  accountLock: AccountLockInfo | null;
  sessions: SessionInfo[];
  sessionExpiresAt: string | null;
  verificationPending: {
    type: 'email' | 'mobile' | null;
    value: string | null;
  };

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAccountLock: (lock: AccountLockInfo | null) => void;
  setSessions: (sessions: SessionInfo[]) => void;
  setVerificationPending: (type: 'email' | 'mobile' | null, value: string | null) => void;

  // Auth actions
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  logoutAllDevices: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshSession: (tokens: AuthTokens) => void;
  setGuestMode: (isGuest: boolean) => void;

  // Utility
  isSessionExpired: () => boolean;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isGuest: true,
  isLoading: false,
  error: null,
  accountLock: null,
  sessions: [],
  sessionExpiresAt: null,
  verificationPending: {
    type: null as 'email' | 'mobile' | null,
    value: null as string | null,
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Setters
      setUser: (user) => set({ user, isAuthenticated: !!user, isGuest: !user }),
      setTokens: (tokens) => {
        if (tokens) {
          const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000).toISOString();
          set({ tokens, sessionExpiresAt: expiresAt });
        } else {
          set({ tokens: null, sessionExpiresAt: null });
        }
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setAccountLock: (accountLock) => set({ accountLock }),
      setSessions: (sessions) => set({ sessions }),
      setVerificationPending: (type, value) => set({ verificationPending: { type, value } }),

      // Auth actions
      login: (user, tokens) => {
        const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000).toISOString();
        set({
          user,
          tokens,
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
          error: null,
          sessionExpiresAt: expiresAt,
          accountLock: null,
          verificationPending: { type: null, value: null },
        });
      },

      logout: () => {
        set({
          ...initialState,
          isGuest: true,
        });
        // Clear localStorage tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },

      logoutAllDevices: () => {
        set({
          ...initialState,
          isGuest: true,
          sessions: [],
        });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates,
              fullName: updates.firstName || updates.lastName
                ? `${updates.firstName ?? currentUser.firstName} ${updates.lastName ?? currentUser.lastName}`
                : currentUser.fullName,
            },
          });
        }
      },

      refreshSession: (tokens) => {
        const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000).toISOString();
        set({ tokens, sessionExpiresAt: expiresAt });
      },

      setGuestMode: (isGuest) => set({ isGuest }),

      // Utility
      isSessionExpired: () => {
        const { sessionExpiresAt } = get();
        if (!sessionExpiresAt) return true;
        return new Date(sessionExpiresAt) <= new Date();
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        sessionExpiresAt: state.sessionExpiresAt,
      }),
    }
  )
);

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsGuest = (state: AuthState) => state.isGuest;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;
export const selectAccountLock = (state: AuthState) => state.accountLock;
