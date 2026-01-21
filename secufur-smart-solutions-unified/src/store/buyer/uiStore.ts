import { create } from 'zustand';
import { Toast } from '@/types/buyer/common';

interface ModalConfig {
  id: string;
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  onClose?: () => void;
}

interface UIState {
  // Toast notifications
  toasts: Toast[];

  // Modal management
  modals: ModalConfig[];
  activeModal: string | null;

  // Loading states
  globalLoading: boolean;
  loadingText: string | null;
  pageLoading: boolean;

  // Sidebar/Menu
  isMobileMenuOpen: boolean;
  isSidebarOpen: boolean;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;

  // Scroll
  scrollPosition: number;
  isScrolledPast: (threshold: number) => boolean;

  // Toast Actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modal Actions
  openModal: (config: Omit<ModalConfig, 'isOpen'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Loading Actions
  setGlobalLoading: (loading: boolean, text?: string) => void;
  setPageLoading: (loading: boolean) => void;

  // Menu Actions
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // Search Actions
  toggleSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Scroll Actions
  setScrollPosition: (position: number) => void;

  // Utility
  reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialState = {
  toasts: [] as Toast[],
  modals: [] as ModalConfig[],
  activeModal: null as string | null,
  globalLoading: false,
  loadingText: null as string | null,
  pageLoading: false,
  isMobileMenuOpen: false,
  isSidebarOpen: false,
  isSearchOpen: false,
  searchQuery: '',
  scrollPosition: 0,
};

export const useUIStore = create<UIState>()((set, get) => ({
  ...initialState,

  // Scroll computed
  isScrolledPast: (threshold) => get().scrollPosition > threshold,

  // Toast Actions
  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => set({ toasts: [] }),

  // Modal Actions
  openModal: (config) => {
    const modalConfig: ModalConfig = {
      ...config,
      isOpen: true,
      closable: config.closable ?? true,
    };
    set((state) => ({
      modals: [...state.modals.filter((m) => m.id !== config.id), modalConfig],
      activeModal: config.id,
    }));
  },

  closeModal: (id) => {
    const state = get();
    const modal = state.modals.find((m) => m.id === id);
    if (modal?.onClose) {
      modal.onClose();
    }
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
      activeModal: state.activeModal === id ? null : state.activeModal,
    }));
  },

  closeAllModals: () => {
    const state = get();
    state.modals.forEach((modal) => {
      if (modal.onClose) modal.onClose();
    });
    set({ modals: [], activeModal: null });
  },

  // Loading Actions
  setGlobalLoading: (loading, text) => {
    set({ globalLoading: loading, loadingText: text ?? null });
  },

  setPageLoading: (loading) => set({ pageLoading: loading }),

  // Menu Actions
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Search Actions
  toggleSearch: () =>
    set((state) => ({
      isSearchOpen: !state.isSearchOpen,
      searchQuery: state.isSearchOpen ? '' : state.searchQuery,
    })),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: '' }),

  // Scroll Actions
  setScrollPosition: (position) => set({ scrollPosition: position }),

  // Utility
  reset: () => set(initialState),
}));

// Selectors
export const selectToasts = (state: UIState) => state.toasts;
export const selectActiveModal = (state: UIState) => state.activeModal;
export const selectGlobalLoading = (state: UIState) => state.globalLoading;
export const selectIsMobileMenuOpen = (state: UIState) => state.isMobileMenuOpen;
export const selectIsSearchOpen = (state: UIState) => state.isSearchOpen;
export const selectSearchQuery = (state: UIState) => state.searchQuery;

// Toast helper functions for convenience
export const toast = {
  success: (message: string, duration?: number) => {
    useUIStore.getState().addToast({ type: 'success', message, duration });
  },
  error: (message: string, duration?: number) => {
    useUIStore.getState().addToast({ type: 'error', message, duration });
  },
  warning: (message: string, duration?: number) => {
    useUIStore.getState().addToast({ type: 'warning', message, duration });
  },
  info: (message: string, duration?: number) => {
    useUIStore.getState().addToast({ type: 'info', message, duration });
  },
};
