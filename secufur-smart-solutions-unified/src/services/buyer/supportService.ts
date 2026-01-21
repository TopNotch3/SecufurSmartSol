import { api } from './api';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful: number;
  order: number;
}

interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  faqCount: number;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  orderId?: string;
  attachments?: string[];
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

type TicketCategory = 'order' | 'payment' | 'delivery' | 'return' | 'product' | 'account' | 'other';
type TicketStatus = 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'customer' | 'support';
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

interface CreateTicketRequest {
  category: TicketCategory;
  subject: string;
  description: string;
  orderId?: string;
  attachments?: File[];
}

interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'customer' | 'bot' | 'agent';
  message: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  userId?: string;
  status: 'active' | 'waiting' | 'closed';
  agentId?: string;
  agentName?: string;
  messages: ChatMessage[];
  startedAt: string;
  endedAt?: string;
}

export const supportService = {
  // FAQs
  getFAQCategories: async (): Promise<FAQCategory[]> => {
    const response = await api.get<FAQCategory[]>('/support/faq/categories');
    return response.data;
  },

  getFAQsByCategory: async (categorySlug: string): Promise<FAQ[]> => {
    const response = await api.get<FAQ[]>(`/support/faq/categories/${categorySlug}`);
    return response.data;
  },

  searchFAQs: async (query: string): Promise<FAQ[]> => {
    const response = await api.get<FAQ[]>('/support/faq/search', { query });
    return response.data;
  },

  markFAQHelpful: async (faqId: string, helpful: boolean): Promise<void> => {
    await api.post(`/support/faq/${faqId}/helpful`, { helpful });
  },

  // Support Tickets
  getTickets: async (params?: { page?: number; limit?: number; status?: TicketStatus }): Promise<{
    tickets: SupportTicket[];
    totalCount: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await api.get<{
      tickets: SupportTicket[];
      totalCount: number;
      page: number;
      totalPages: number;
    }>('/support/tickets', params as Record<string, unknown>);
    return response.data;
  },

  getTicketById: async (ticketId: string): Promise<SupportTicket> => {
    const response = await api.get<SupportTicket>(`/support/tickets/${ticketId}`);
    return response.data;
  },

  getTicketByNumber: async (ticketNumber: string): Promise<SupportTicket> => {
    const response = await api.get<SupportTicket>(`/support/tickets/number/${ticketNumber}`);
    return response.data;
  },

  createTicket: async (request: CreateTicketRequest): Promise<SupportTicket> => {
    const formData = new FormData();
    formData.append('category', request.category);
    formData.append('subject', request.subject);
    formData.append('description', request.description);
    if (request.orderId) formData.append('orderId', request.orderId);
    if (request.attachments) {
      request.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post<SupportTicket>('/support/tickets', formData);
    return response.data;
  },

  replyToTicket: async (ticketId: string, message: string, attachments?: File[]): Promise<TicketMessage> => {
    const formData = new FormData();
    formData.append('message', message);
    if (attachments) {
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post<TicketMessage>(`/support/tickets/${ticketId}/reply`, formData);
    return response.data;
  },

  closeTicket: async (ticketId: string): Promise<SupportTicket> => {
    const response = await api.post<SupportTicket>(`/support/tickets/${ticketId}/close`);
    return response.data;
  },

  reopenTicket: async (ticketId: string, message: string): Promise<SupportTicket> => {
    const response = await api.post<SupportTicket>(`/support/tickets/${ticketId}/reopen`, { message });
    return response.data;
  },

  // Live Chat
  startChatSession: async (): Promise<ChatSession> => {
    const response = await api.post<ChatSession>('/support/chat/start');
    return response.data;
  },

  sendChatMessage: async (sessionId: string, message: string): Promise<ChatMessage> => {
    const response = await api.post<ChatMessage>(`/support/chat/${sessionId}/message`, { message });
    return response.data;
  },

  getChatHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await api.get<ChatMessage[]>(`/support/chat/${sessionId}/history`);
    return response.data;
  },

  endChatSession: async (sessionId: string): Promise<void> => {
    await api.post(`/support/chat/${sessionId}/end`);
  },

  requestLiveAgent: async (sessionId: string): Promise<{ position: number; estimatedWait: number }> => {
    const response = await api.post<{ position: number; estimatedWait: number }>(
      `/support/chat/${sessionId}/request-agent`
    );
    return response.data;
  },

  // Contact
  submitContactForm: async (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    orderNumber?: string;
  }): Promise<{ success: boolean; ticketNumber?: string }> => {
    const response = await api.post<{ success: boolean; ticketNumber?: string }>('/support/contact', data);
    return response.data;
  },

  // Store locations
  getStoreLocations: async (): Promise<{
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    hours: string;
    coordinates: { lat: number; lng: number };
  }[]> => {
    const response = await api.get<{
      id: string;
      name: string;
      address: string;
      city: string;
      phone: string;
      email: string;
      hours: string;
      coordinates: { lat: number; lng: number };
    }[]>('/support/store-locations');
    return response.data;
  },
};

export default supportService;
