import React from 'react';

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8 font-sans">
            <h1 className="text-3xl font-black text-[#002366] mb-8 font-jakarta">Terms of Service</h1>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                <p>Last updated: January 21, 2026</p>
                <p>Welcome to Secufur Smart Solutions. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>

                <h2 className="text-xl font-bold text-slate-800">1. Acceptance of Terms</h2>
                <p>By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

                <h2 className="text-xl font-bold text-slate-800">2. Seller Responsibilities</h2>
                <p>As a seller, you agree to provide accurate information about your products and business. You are responsible for maintaining the confidentiality of your account credentials.</p>

                <h2 className="text-xl font-bold text-slate-800">3. Product Listings</h2>
                <p>All products listed must comply with our prohibited items policy and applicable laws. We reserve the right to remove any listing that violates these policies.</p>

                <h2 className="text-xl font-bold text-slate-800">4. Payments and Fees</h2>
                <p>We charge fees for our services as described in our fee schedule. You are responsible for paying all fees and applicable taxes in a timely manner.</p>

                <h2 className="text-xl font-bold text-slate-800">5. Termination</h2>
                <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </div>
        </div>
    );
}
