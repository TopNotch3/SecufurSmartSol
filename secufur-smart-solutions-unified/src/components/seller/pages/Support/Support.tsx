import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/seller/AppContext';
import { Send, Search, Paperclip, Menu, X, ChevronLeft, User, Clock, CheckCheck, AlertCircle } from 'lucide-react';

const Support: React.FC = () => {
  const { conversations, activeConversation, setActiveConversation, sendMessage, addLog } = useApp();
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === activeConversation);
  
  const filteredConversations = conversations.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    sendMessage(activeConversation, message);
    setMessage('');
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      {/* Sidebar - Conversation List */}
      <div className={`
        ${showSidebar ? 'flex' : 'hidden md:flex'} 
        w-full md:w-80 lg:w-96 border-r border-gray-100 flex-col bg-gray-50/30 
        absolute md:relative inset-0 z-20 md:z-0
      `}>
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-jakarta font-extrabold text-slate-800">Messages</h3>
            <button 
              onClick={() => setShowSidebar(false)} 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#002366]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => handleSelectConversation(conv.id)}
                className={`p-4 sm:p-6 cursor-pointer border-l-4 transition-all ${
                  activeConversation === conv.id 
                    ? 'bg-white border-[#002366] shadow-sm' 
                    : 'border-transparent hover:bg-white/50'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${
                    activeConversation === conv.id 
                      ? 'bg-[#002366] text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {getInitials(conv.customerName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{conv.customerName}</p>
                      <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 shrink-0 ml-2">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    {conv.orderId && (
                      <p className="text-[9px] sm:text-[10px] text-blue-500 font-bold uppercase mb-1">
                        {conv.orderId}
                      </p>
                    )}
                    <p className="text-[10px] sm:text-xs text-slate-500 truncate font-medium">
                      {conv.messages[conv.messages.length - 1]?.text || 'No messages'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-[#002366] text-white text-[9px] font-bold rounded-full">
                        {conv.unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto mb-4 text-gray-300" size={32} />
              <p className="text-sm text-slate-400">No conversations found</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider">
            {conversations.length} Total Conversations
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  onClick={() => setShowSidebar(true)} 
                  className="md:hidden p-2 -ml-2 hover:bg-gray-50 rounded-lg"
                >
                  <Menu size={20} className="text-[#002366]" />
                </button>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#002366] text-white flex items-center justify-center font-bold shadow-lg shadow-blue-900/20 text-sm">
                  {getInitials(currentConversation.customerName)}
                </div>
                <div>
                  <h4 className="font-jakarta font-bold text-slate-800 text-sm sm:text-base">
                    {currentConversation.customerName}
                  </h4>
                  <div className="flex items-center gap-2">
                    {currentConversation.orderId && (
                      <span className="text-[9px] sm:text-[10px] text-blue-500 font-bold uppercase">
                        {currentConversation.orderId}
                      </span>
                    )}
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase flex items-center gap-1 ${
                      currentConversation.status === 'Active' ? 'text-green-500' : 'text-gray-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        currentConversation.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                      }`} />
                      {currentConversation.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 bg-[#FDFDFD]">
              {currentConversation.messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'Seller' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 rounded-2xl shadow-sm ${
                    m.sender === 'Seller' 
                      ? 'bg-[#002366] text-white rounded-tr-none' 
                      : m.sender === 'System'
                      ? 'bg-gray-100 text-gray-600 border border-gray-200 rounded-tl-none'
                      : 'bg-white border border-gray-100 text-slate-700 rounded-tl-none'
                  }`}>
                    <p className="text-xs sm:text-sm leading-relaxed">{m.text}</p>
                    <div className={`flex items-center justify-end gap-2 mt-2 ${
                      m.sender === 'Seller' ? 'text-blue-300' : 'text-gray-400'
                    }`}>
                      <span className="text-[9px] font-bold uppercase">{m.time}</span>
                      {m.sender === 'Seller' && (
                        <CheckCheck size={12} className={m.read ? 'text-blue-300' : 'text-blue-400/50'} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 sm:p-6 bg-white border-t border-gray-100">
              <div className="relative flex items-center gap-2 sm:gap-3">
                <button 
                  type="button" 
                  className="p-2 sm:p-3 text-slate-400 hover:text-[#002366] transition-all"
                >
                  <Paperclip size={18} />
                </button>
                <input 
                  type="text" 
                  placeholder="Type your reply here..."
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#002366] transition-all"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="p-3 sm:p-4 bg-[#002366] text-white rounded-xl sm:rounded-2xl hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <button 
                onClick={() => setShowSidebar(true)} 
                className="md:hidden mb-6 p-3 bg-[#002366] text-white rounded-xl"
              >
                <Menu size={20} />
              </button>
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Select a Conversation</h3>
              <p className="text-sm text-slate-400">Choose from your message list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
