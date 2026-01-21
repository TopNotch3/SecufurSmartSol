'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Modal } from '@/components/buyer/common';
import { toast } from '@/store/buyer';
import styles from './tickets.module.css';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Battery not charging properly',
    category: 'technical',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:00:00Z',
    messages: [
      { id: 'm1', sender: 'user', message: 'My battery pack is not charging beyond 80%. It stops there and shows fully charged.', timestamp: '2024-01-15T10:30:00Z' },
      { id: 'm2', sender: 'support', message: 'Thank you for reaching out. Could you please provide the order ID and the model number of your battery?', timestamp: '2024-01-15T11:00:00Z' },
      { id: 'm3', sender: 'user', message: 'Order ID: ORD-ABC123, Model: LUV-BAT-48V-100AH', timestamp: '2024-01-15T11:30:00Z' },
      { id: 'm4', sender: 'support', message: 'We are looking into this issue. It might be a BMS calibration issue. Our technical team will reach out shortly.', timestamp: '2024-01-16T14:00:00Z' },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Request for invoice copy',
    category: 'orders',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T15:00:00Z',
    messages: [
      { id: 'm1', sender: 'user', message: 'I need a copy of the invoice for order ORD-DEF456 for warranty registration.', timestamp: '2024-01-10T09:00:00Z' },
      { id: 'm2', sender: 'support', message: 'The invoice has been sent to your registered email. Please check your inbox.', timestamp: '2024-01-10T15:00:00Z' },
    ],
  },
];

const categories = [
  { value: '', label: 'Select category' },
  { value: 'orders', label: 'Orders & Shipping' },
  { value: 'returns', label: 'Returns & Refunds' },
  { value: 'payments', label: 'Payments & Billing' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'account', label: 'Account Issues' },
  { value: 'other', label: 'Other' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
  });
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const ticket: Ticket = {
      id: `TKT-${Date.now().toString().slice(-6)}`,
      subject: newTicket.subject,
      category: newTicket.category,
      status: 'open',
      priority: newTicket.priority as 'low' | 'medium' | 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'm1',
          sender: 'user',
          message: newTicket.message,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setTickets([ticket, ...tickets]);
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    setNewTicket({ subject: '', category: '', priority: 'medium', message: '' });
    toast.success('Ticket created successfully');
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newMessage: TicketMessage = {
      id: `m${Date.now()}`,
      sender: 'user',
      message: replyMessage,
      timestamp: new Date().toISOString(),
    };

    setTickets(
      tickets.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
    });

    setReplyMessage('');
    setIsSubmitting(false);
    toast.success('Reply sent');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return styles.statusOpen;
      case 'in_progress':
        return styles.statusProgress;
      case 'resolved':
        return styles.statusResolved;
      case 'closed':
        return styles.statusClosed;
      default:
        return '';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  return (
    <div className={styles.ticketsPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Support Tickets</h1>
            <p className={styles.subtitle}>
              View and manage your support requests
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Ticket
          </Button>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({tickets.length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'open' ? styles.active : ''}`}
            onClick={() => setFilter('open')}
          >
            Open ({tickets.filter((t) => t.status === 'open').length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'in_progress' ? styles.active : ''}`}
            onClick={() => setFilter('in_progress')}
          >
            In Progress ({tickets.filter((t) => t.status === 'in_progress').length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'resolved' ? styles.active : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved ({tickets.filter((t) => t.status === 'resolved').length})
          </button>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <h3>No tickets found</h3>
            <p>You haven&apos;t created any support tickets yet.</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>Create Your First Ticket</Button>
          </div>
        ) : (
          <div className={styles.ticketsList}>
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={styles.ticketCard}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className={styles.ticketHeader}>
                  <span className={styles.ticketId}>{ticket.id}</span>
                  <div className={styles.ticketBadges}>
                    <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <h3 className={styles.ticketSubject}>{ticket.subject}</h3>
                <p className={styles.ticketExcerpt}>
                  {ticket.messages[ticket.messages.length - 1].message.substring(0, 100)}...
                </p>
                <div className={styles.ticketMeta}>
                  <span>{ticket.category}</span>
                  <span>Updated: {formatDate(ticket.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Ticket"
      >
        <div className={styles.createForm}>
          <Input
            label="Subject"
            value={newTicket.subject}
            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
            placeholder="Brief description of your issue"
            required
          />
          <div className={styles.formRow}>
            <Select
              label="Category"
              value={newTicket.category}
              onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
              options={categories}
              required
            />
            <Select
              label="Priority"
              value={newTicket.priority}
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
              options={priorities}
            />
          </div>
          <div className={styles.textareaGroup}>
            <label className={styles.textareaLabel}>
              Message <span>*</span>
            </label>
            <textarea
              className={styles.textarea}
              value={newTicket.message}
              onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
              placeholder="Please describe your issue in detail..."
              rows={6}
              required
            />
          </div>
          <div className={styles.modalActions}>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} isLoading={isSubmitting}>
              Create Ticket
            </Button>
          </div>
        </div>
      </Modal>

      {/* Ticket Detail Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket?.id || ''}
      >
        {selectedTicket && (
          <div className={styles.ticketDetail}>
            <div className={styles.ticketDetailHeader}>
              <h3>{selectedTicket.subject}</h3>
              <div className={styles.ticketBadges}>
                <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(selectedTicket.priority)}`}>
                  {selectedTicket.priority}
                </span>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(selectedTicket.status)}`}>
                  {selectedTicket.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className={styles.ticketDetailMeta}>
              <span>Category: {selectedTicket.category}</span>
              <span>Created: {formatDate(selectedTicket.createdAt)}</span>
            </div>

            <div className={styles.messages}>
              {selectedTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.supportMessage}`}
                >
                  <div className={styles.messageSender}>
                    {msg.sender === 'user' ? 'You' : 'Support Team'}
                  </div>
                  <p className={styles.messageText}>{msg.message}</p>
                  <span className={styles.messageTime}>{formatDate(msg.timestamp)}</span>
                </div>
              ))}
            </div>

            {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
              <div className={styles.replySection}>
                <textarea
                  className={styles.textarea}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                />
                <Button onClick={handleReply} isLoading={isSubmitting} disabled={!replyMessage.trim()}>
                  Send Reply
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
