import React from 'react';

export default function GSTCompliancePage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8 font-sans">
            <h1 className="text-3xl font-black text-[#002366] mb-8 font-jakarta">GST Compliance Guide</h1>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                <p>At Secufur Smart Solutions, we are committed to ensuring full compliance with the Goods and Services Tax (GST) regulations in India.</p>

                <h2 className="text-xl font-bold text-slate-800">1. GST Registration</h2>
                <p>All sellers on our platform must be registered under GST if their turnover exceeds the prescribed threshold or if they are selling inter-state. You must provide your GSTIN during onboarding.</p>

                <h2 className="text-xl font-bold text-slate-800">2. Tax Collection at Source (TCS)</h2>
                <p>As an e-commerce operator, we are required to collect Tax Collected at Source (TCS) at 1% on the net value of taxable supplies made through our platform and deposit it with the government.</p>

                <h2 className="text-xl font-bold text-slate-800">3. Invoicing</h2>
                <p>Sellers must issue GST-compliant invoices for all taxable supplies. Our platform assists in generating these invoices based on the order details.</p>

                <h2 className="text-xl font-bold text-slate-800">4. Return Filing</h2>
                <p>Sellers are responsible for filing their own GST returns (GSTR-1, GSTR-3B, etc.) regularly. We provide reports to assist with your reconciliation.</p>
            </div>
        </div>
    );
}
