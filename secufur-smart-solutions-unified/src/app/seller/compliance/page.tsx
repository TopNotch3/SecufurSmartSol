'use client';
import React from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle, FileText, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CompliancePage() {
    const router = useRouter();

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    ← Back
                </button>
                <div>
                    <h1 className="text-2xl font-jakarta font-black text-slate-900">Compliance & Verification</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your business documents and regulatory compliance.</p>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-yellow-600 shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-yellow-900">Verification Pending</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                        Your account is currently under review. Please ensure all required documents are uploaded and valid.
                        Our team will verify your details within 24-48 hours.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        Required Documents
                    </h3>

                    <div className="space-y-4">
                        {[
                            { label: 'GST Certificate', status: 'Uploaded', date: '21 Jan 2026' },
                            { label: 'PAN Card', status: 'Uploaded', date: '21 Jan 2026' },
                            { label: 'Cancelled Cheque', status: 'Uploaded', date: '21 Jan 2026' },
                            { label: 'Address Proof', status: 'Pending Review', date: '21 Jan 2026' },
                        ].map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                                        <FileText size={16} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{doc.label}</p>
                                        <p className="text-[10px] text-slate-400">Uploaded on {doc.date}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-lg border border-green-100">
                                    {doc.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-3 border-2 border-dashed border-blue-200 rounded-xl text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                        <Upload size={16} /> Upload Additional Documents
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                            <ShieldCheck size={20} className="text-green-600" />
                            Compliance Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">GST Filing Status</span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">COMPLIANT</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">TDS Deduction</span>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">NOT APPLICABLE</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">Bank Account Status</span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">VERIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
