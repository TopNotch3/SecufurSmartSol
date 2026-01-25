'use client';

import React from 'react';
import { useApp } from '@/context/seller/AppContext';
import { LogOut, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function UnderReviewPage() {
    const { logoutSeller, seller } = useApp();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-[#002366] p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), transparent 70%)' }} />
                    <div className="relative z-10 mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                        <Clock size={40} className="text-blue-200 animate-pulse" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-jakarta font-extrabold text-white mb-2 relative z-10">Application Submitted</h1>
                    <p className="text-blue-200 text-sm font-medium relative z-10">Verification in Progress</p>
                </div>

                <div className="p-8 sm:p-10 text-center">

                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        Thank you, {seller?.contactPerson || 'Seller'}!
                    </h2>

                    <div className="prose prose-sm text-slate-500 mx-auto mb-8">
                        <p className="mb-4">
                            We have received your profile and documents. Our compliance team is currently reviewing your information to ensure everything meets our security standards.
                        </p>
                        <p>
                            You will receive an email update regarding your application status shortly.
                        </p>
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mb-8 max-w-sm mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                            <p className="text-xs font-bold text-slate-700 text-left">Documents Uploaded</p>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldCheck size={20} className="text-blue-600 shrink-0" />
                            <p className="text-xs font-bold text-slate-700 text-left">Security Check in Progress</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin shrink-0"></div>
                            <p className="text-xs font-bold text-slate-700 text-left">Admin Approval Pending</p>
                        </div>
                    </div>

                    <button
                        onClick={logoutSeller}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
                    >
                        <LogOut size={16} />
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    );
}
