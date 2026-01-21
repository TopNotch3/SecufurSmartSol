// Export all stores
export { useAuthStore, selectUser, selectIsAuthenticated, selectIsGuest } from './authStore';
export {
  useCartStore,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectSavedForLater,
  selectAppliedCoupon,
} from './cartStore';
export {
  useWishlistStore,
  selectWishlistItems,
  selectWishlistCount,
  selectCompareItems,
  selectCompareCount,
} from './wishlistStore';
export {
  useCheckoutStore,
  selectCurrentStep,
  selectShippingAddress,
  selectDeliveryOption,
  selectPaymentState,
  selectPlacedOrder,
  selectIsProcessing,
} from './checkoutStore';
export {
  useUIStore,
  selectToasts,
  selectActiveModal,
  selectGlobalLoading,
  selectIsMobileMenuOpen,
  selectIsSearchOpen,
  selectSearchQuery,
  toast,
} from './uiStore';
