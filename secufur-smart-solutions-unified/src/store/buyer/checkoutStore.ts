import { create } from 'zustand';
import { Address, SavedPaymentMethod } from '@/types/buyer/user';
import { DeliveryOption } from '@/types/buyer/cart';
import { PaymentMethod, PaymentStatus, Order } from '@/types/buyer/order';

export type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review' | 'confirmation';

interface PaymentState {
  method: PaymentMethod | null;
  status: PaymentStatus;
  transactionId: string | null;
  error: string | null;
  gatewayUrl: string | null;
  retryCount: number;
}

interface CheckoutState {
  // Step management
  currentStep: CheckoutStep;
  completedSteps: CheckoutStep[];

  // Address
  selectedShippingAddress: Address | null;
  selectedBillingAddress: Address | null;
  useSameAsBilling: boolean;
  deliveryInstructions: string;

  // Delivery
  selectedDeliveryOption: DeliveryOption | null;

  // Payment
  selectedPaymentMethod: SavedPaymentMethod | null;
  newPaymentMethod: PaymentMethod | null;
  payment: PaymentState;
  savePaymentMethod: boolean;

  // Order
  placedOrder: Order | null;

  // Loading states
  isProcessing: boolean;
  error: string | null;

  // Step Actions
  setCurrentStep: (step: CheckoutStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  markStepCompleted: (step: CheckoutStep) => void;
  isStepCompleted: (step: CheckoutStep) => boolean;
  canProceedToStep: (step: CheckoutStep) => boolean;

  // Address Actions
  setShippingAddress: (address: Address | null) => void;
  setBillingAddress: (address: Address | null) => void;
  setUseSameAsBilling: (useSame: boolean) => void;
  setDeliveryInstructions: (instructions: string) => void;

  // Delivery Actions
  setDeliveryOption: (option: DeliveryOption | null) => void;

  // Payment Actions
  setSelectedPaymentMethod: (method: SavedPaymentMethod | null) => void;
  setNewPaymentMethod: (method: PaymentMethod | null) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setPaymentError: (error: string | null) => void;
  setPaymentTransactionId: (transactionId: string | null) => void;
  setGatewayUrl: (url: string | null) => void;
  setSavePaymentMethod: (save: boolean) => void;
  incrementRetryCount: () => void;
  resetPayment: () => void;

  // Order Actions
  setPlacedOrder: (order: Order | null) => void;

  // Loading & Error
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;

  // Utility
  getCheckoutSummary: () => CheckoutSummary;
  reset: () => void;
}

interface CheckoutSummary {
  hasShippingAddress: boolean;
  hasBillingAddress: boolean;
  hasDeliveryOption: boolean;
  hasPaymentMethod: boolean;
  isReadyForPayment: boolean;
}

const stepOrder: CheckoutStep[] = ['address', 'delivery', 'payment', 'review', 'confirmation'];

const initialPaymentState: PaymentState = {
  method: null,
  status: 'pending',
  transactionId: null,
  error: null,
  gatewayUrl: null,
  retryCount: 0,
};

const initialState = {
  currentStep: 'address' as CheckoutStep,
  completedSteps: [] as CheckoutStep[],
  selectedShippingAddress: null as Address | null,
  selectedBillingAddress: null as Address | null,
  useSameAsBilling: true,
  deliveryInstructions: '',
  selectedDeliveryOption: null as DeliveryOption | null,
  selectedPaymentMethod: null as SavedPaymentMethod | null,
  newPaymentMethod: null as PaymentMethod | null,
  payment: initialPaymentState,
  savePaymentMethod: false,
  placedOrder: null as Order | null,
  isProcessing: false,
  error: null as string | null,
};

export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
  ...initialState,

  // Step Actions
  setCurrentStep: (step) => set({ currentStep: step }),

  goToNextStep: () => {
    const state = get();
    const currentIndex = stepOrder.indexOf(state.currentStep);
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      set({
        currentStep: nextStep,
        completedSteps: state.completedSteps.includes(state.currentStep)
          ? state.completedSteps
          : [...state.completedSteps, state.currentStep],
      });
    }
  },

  goToPreviousStep: () => {
    const state = get();
    const currentIndex = stepOrder.indexOf(state.currentStep);
    if (currentIndex > 0) {
      set({ currentStep: stepOrder[currentIndex - 1] });
    }
  },

  markStepCompleted: (step) => {
    const state = get();
    if (!state.completedSteps.includes(step)) {
      set({ completedSteps: [...state.completedSteps, step] });
    }
  },

  isStepCompleted: (step) => get().completedSteps.includes(step),

  canProceedToStep: (step) => {
    const state = get();
    const targetIndex = stepOrder.indexOf(step);

    // Can always go back
    const currentIndex = stepOrder.indexOf(state.currentStep);
    if (targetIndex <= currentIndex) return true;

    // Check prerequisites
    switch (step) {
      case 'delivery':
        return !!state.selectedShippingAddress;
      case 'payment':
        return !!state.selectedShippingAddress && !!state.selectedDeliveryOption;
      case 'review':
        return (
          !!state.selectedShippingAddress &&
          !!state.selectedDeliveryOption &&
          (!!state.selectedPaymentMethod || !!state.newPaymentMethod)
        );
      case 'confirmation':
        return state.payment.status === 'success';
      default:
        return true;
    }
  },

  // Address Actions
  setShippingAddress: (address) => set({ selectedShippingAddress: address }),
  setBillingAddress: (address) => set({ selectedBillingAddress: address }),
  setUseSameAsBilling: (useSame) => set({ useSameAsBilling: useSame }),
  setDeliveryInstructions: (instructions) => set({ deliveryInstructions: instructions }),

  // Delivery Actions
  setDeliveryOption: (option) => set({ selectedDeliveryOption: option }),

  // Payment Actions
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method, newPaymentMethod: null }),
  setNewPaymentMethod: (method) => set({ newPaymentMethod: method, selectedPaymentMethod: null }),

  setPaymentStatus: (status) =>
    set((state) => ({
      payment: { ...state.payment, status },
    })),

  setPaymentError: (error) =>
    set((state) => ({
      payment: { ...state.payment, error, status: error ? 'failed' : state.payment.status },
    })),

  setPaymentTransactionId: (transactionId) =>
    set((state) => ({
      payment: { ...state.payment, transactionId },
    })),

  setGatewayUrl: (url) =>
    set((state) => ({
      payment: { ...state.payment, gatewayUrl: url },
    })),

  setSavePaymentMethod: (save) => set({ savePaymentMethod: save }),

  incrementRetryCount: () =>
    set((state) => ({
      payment: { ...state.payment, retryCount: state.payment.retryCount + 1 },
    })),

  resetPayment: () => set({ payment: initialPaymentState }),

  // Order Actions
  setPlacedOrder: (order) => set({ placedOrder: order }),

  // Loading & Error
  setProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),

  // Utility
  getCheckoutSummary: () => {
    const state = get();
    const hasShippingAddress = !!state.selectedShippingAddress;
    const hasBillingAddress = state.useSameAsBilling || !!state.selectedBillingAddress;
    const hasDeliveryOption = !!state.selectedDeliveryOption;
    const hasPaymentMethod = !!state.selectedPaymentMethod || !!state.newPaymentMethod;

    return {
      hasShippingAddress,
      hasBillingAddress,
      hasDeliveryOption,
      hasPaymentMethod,
      isReadyForPayment: hasShippingAddress && hasBillingAddress && hasDeliveryOption && hasPaymentMethod,
    };
  },

  reset: () => set(initialState),
}));

// Selectors
export const selectCurrentStep = (state: CheckoutState) => state.currentStep;
export const selectShippingAddress = (state: CheckoutState) => state.selectedShippingAddress;
export const selectDeliveryOption = (state: CheckoutState) => state.selectedDeliveryOption;
export const selectPaymentState = (state: CheckoutState) => state.payment;
export const selectPlacedOrder = (state: CheckoutState) => state.placedOrder;
export const selectIsProcessing = (state: CheckoutState) => state.isProcessing;
