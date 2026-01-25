'use client';

import React from 'react';
import { useApp } from '@/context/seller/AppContext';
import { Bell, CheckCircle2, Clock, AlertTriangle, Info } from 'lucide-react';

export default function NotificationsPage() {
    const { notifications, markNotificationRead } = useApp();

    const getIcon = (type: string) => {
        switch (type) {
            case 'Urgent': return <AlertTriangle className="text-red-500" size={20} />;
            case 'Order': return <Clock className="text-orange-500" size={20} />;
            case 'Payment': return <CheckCircle2 className="text-green-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-jakarta text-slate-800">Notifications</h1>
                    <p className="text-slate-500 text-sm mt-1">Stay updated with your store updates</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <Bell size={20} className="text-slate-400" />
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3>
                        <p className="text-slate-400 text-sm">You have no new notifications.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`bg-white p-6 rounded-2xl border transition-all hover:shadow-md flex gap-4 ${notification.read ? 'border-gray-100 opacity-60' : 'border-blue-100 shadow-sm'}`}
                            onClick={() => markNotificationRead(notification.id)}
                        >
                            <div className={`p-3 rounded-xl shrink-0 h-fit ${notification.type === 'Urgent' ? 'bg-red-50' : notification.type === 'Order' ? 'bg-orange-50' : notification.type === 'Payment' ? 'bg-green-50' : 'bg-blue-50'}`}>
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold text-slate-800 ${!notification.read && 'text-[#002366]'}`}>{notification.title}</h3>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{notification.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed">{notification.message}</p>
                            </div>
                            {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
