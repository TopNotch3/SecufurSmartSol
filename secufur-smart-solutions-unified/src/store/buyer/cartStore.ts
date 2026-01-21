import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Cart,
  CartItem,
  SavedItem,
  AppliedCoupon,
  DeliveryOption,
  CartValidation,
  CartValidationError,
  CartValidationWarning,
} from '@/types/buyer/cart';
import { SelectedCustomization } from '@/types/buyer/product';

interface CartState {
  // State
  items: CartItem[];
  savedForLater: SavedItem[];
  appliedCoupon: AppliedCoupon | null;
  deliveryPincode: string | null;
  deliveryAvailable: boolean | null;
  selectedDeliveryOption: DeliveryOption | null;
  deliveryOptions: DeliveryOption[];
  validation: CartValidation | null;
  isLoading: boolean;
  error: string | null;

  // Computed values
  itemCount: number;
  subtotal: number;
  customizationCost: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;

  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;

  // Save for later
  saveForLater: (itemId: string) => void;
  moveToCart: (savedItemId: string) => void;
  removeSavedItem: (savedItemId: string) => void;

  // Coupon
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;

  // Delivery
  setDeliveryPincode: (pincode: string | null) => void;
  setDeliveryAvailable: (available: boolean) => void;
  setDeliveryOptions: (options: DeliveryOption[]) => void;
  setSelectedDeliveryOption: (option: DeliveryOption | null) => void;

  // Validation
  setValidation: (validation: CartValidation | null) => void;
  addValidationError: (error: CartValidationError) => void;
  addValidationWarning: (warning: CartValidationWarning) => void;
  clearValidation: () => void;

  // Loading & Error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility
  getItemById: (itemId: string) => CartItem | undefined;
  getItemByProductId: (productId: string, customization?: SelectedCustomization) => CartItem | undefined;
  recalculateTotals: () => void;
  reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const calculateTotals = (items: CartItem[], appliedCoupon: AppliedCoupon | null, shippingCost: number) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const customizationCost = items.reduce((sum, item) => {
    if (item.customization) {
      return sum + ((item.customization.totalPrice - item.product.price) * item.quantity);
    }
    return sum;
  }, 0);

  const taxRate = 0.18; // 18% GST
  const taxAmount = (subtotal + customizationCost) * taxRate;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = ((subtotal + customizationCost) * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const total = subtotal + customizationCost + taxAmount + shippingCost - discountAmount;

  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    customizationCost,
    taxAmount,
    shippingCost,
    discountAmount,
    total: Math.max(0, total),
  };
};

const initialState = {
  items: [] as CartItem[],
  savedForLater: [] as SavedItem[],
  appliedCoupon: null as AppliedCoupon | null,
  deliveryPincode: null as string | null,
  deliveryAvailable: null as boolean | null,
  selectedDeliveryOption: null as DeliveryOption | null,
  deliveryOptions: [] as DeliveryOption[],
  validation: null as CartValidation | null,
  isLoading: false,
  error: null as string | null,
  itemCount: 0,
  subtotal: 0,
  customizationCost: 0,
  taxAmount: 0,
  shippingCost: 0,
  discountAmount: 0,
  total: 0,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (item) => {
        const state = get();
        const existingItem = state.items.find(
          (i) => i.productId === item.productId &&
            JSON.stringify(i.customization) === JSON.stringify(item.customization)
        );

        let newItems: CartItem[];
        if (existingItem) {
          newItems = state.items.map((i) =>
            i.id === existingItem.id
              ? {
                  ...i,
                  quantity: i.quantity + item.quantity,
                  totalPrice: (i.quantity + item.quantity) * i.unitPrice,
                }
              : i
          );
        } else {
          const newItem: CartItem = {
            ...item,
            id: generateId(),
            addedAt: new Date().toISOString(),
          };
          newItems = [...state.items, newItem];
        }

        const totals = calculateTotals(newItems, state.appliedCoupon, state.shippingCost);
        set({ items: newItems, ...totals });
      },

      updateItemQuantity: (itemId, quantity) => {
        const state = get();
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const newItems = state.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                totalPrice: quantity * item.unitPrice,
              }
            : item
        );

        const totals = calculateTotals(newItems, state.appliedCoupon, state.shippingCost);
        set({ items: newItems, ...totals });
      },

      removeItem: (itemId) => {
        const state = get();
        const newItems = state.items.filter((item) => item.id !== itemId);
        const totals = calculateTotals(newItems, state.appliedCoupon, state.shippingCost);
        set({ items: newItems, ...totals });
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          customizationCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: 0,
          appliedCoupon: null,
          validation: null,
        });
      },

      saveForLater: (itemId) => {
        const state = get();
        const item = state.items.find((i) => i.id === itemId);
        if (!item) return;

        const savedItem: SavedItem = {
          id: generateId(),
          productId: item.productId,
          product: item.product,
          customization: item.customization,
          savedAt: new Date().toISOString(),
        };

        const newItems = state.items.filter((i) => i.id !== itemId);
        const totals = calculateTotals(newItems, state.appliedCoupon, state.shippingCost);

        set({
          items: newItems,
          savedForLater: [...state.savedForLater, savedItem],
          ...totals,
        });
      },

      moveToCart: (savedItemId) => {
        const state = get();
        const savedItem = state.savedForLater.find((i) => i.id === savedItemId);
        if (!savedItem) return;

        const cartItem: CartItem = {
          id: generateId(),
          productId: savedItem.productId,
          product: savedItem.product,
          quantity: 1,
          customization: savedItem.customization,
          unitPrice: savedItem.customization?.totalPrice ?? savedItem.product.price,
          totalPrice: savedItem.customization?.totalPrice ?? savedItem.product.price,
          addedAt: new Date().toISOString(),
        };

        const newItems = [...state.items, cartItem];
        const newSavedForLater = state.savedForLater.filter((i) => i.id !== savedItemId);
        const totals = calculateTotals(newItems, state.appliedCoupon, state.shippingCost);

        set({
          items: newItems,
          savedForLater: newSavedForLater,
          ...totals,
        });
      },

      removeSavedItem: (savedItemId) => {
        const state = get();
        set({
          savedForLater: state.savedForLater.filter((i) => i.id !== savedItemId),
        });
      },

      applyCoupon: (coupon) => {
        const state = get();
        const totals = calculateTotals(state.items, coupon, state.shippingCost);
        set({ appliedCoupon: coupon, ...totals });
      },

      removeCoupon: () => {
        const state = get();
        const totals = calculateTotals(state.items, null, state.shippingCost);
        set({ appliedCoupon: null, ...totals });
      },

      setDeliveryPincode: (pincode) => set({ deliveryPincode: pincode }),
      setDeliveryAvailable: (available) => set({ deliveryAvailable: available }),
      setDeliveryOptions: (options) => set({ deliveryOptions: options }),

      setSelectedDeliveryOption: (option) => {
        const state = get();
        const newShippingCost = option?.cost ?? 0;
        const totals = calculateTotals(state.items, state.appliedCoupon, newShippingCost);
        set({ selectedDeliveryOption: option, ...totals });
      },

      setValidation: (validation) => set({ validation }),

      addValidationError: (error) => {
        const state = get();
        const currentValidation = state.validation ?? { isValid: true, errors: [], warnings: [] };
        set({
          validation: {
            ...currentValidation,
            isValid: false,
            errors: [...currentValidation.errors, error],
          },
        });
      },

      addValidationWarning: (warning) => {
        const state = get();
        const currentValidation = state.validation ?? { isValid: true, errors: [], warnings: [] };
        set({
          validation: {
            ...currentValidation,
            warnings: [...currentValidation.warnings, warning],
          },
        });
      },

      clearValidation: () => set({ validation: null }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      getItemById: (itemId) => get().items.find((i) => i.id === itemId),

      getItemByProductId: (productId, customization) => {
        return get().items.find(
          (i) =>
            i.productId === productId &&
            JSON.stringify(i.customization) === JSON.stringify(customization)
        );
      },

      recalculateTotals: () => {
        const state = get();
        const totals = calculateTotals(state.items, state.appliedCoupon, state.shippingCost);
        set(totals);
      },

      reset: () => set(initialState),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        savedForLater: state.savedForLater,
        appliedCoupon: state.appliedCoupon,
        deliveryPincode: state.deliveryPincode,
      }),
    }
  )
);

// Selectors
export const selectCartItems = (state: CartState) => state.items;
export const selectCartItemCount = (state: CartState) => state.itemCount;
export const selectCartTotal = (state: CartState) => state.total;
export const selectSavedForLater = (state: CartState) => state.savedForLater;
export const selectAppliedCoupon = (state: CartState) => state.appliedCoupon;
export const selectDeliveryOptions = (state: CartState) => state.deliveryOptions;
