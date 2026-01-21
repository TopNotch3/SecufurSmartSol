'use client';
import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from '@/context/seller/AppContext';
import Layout from '@/components/seller/components/Layout';
import { useRouter, usePathname } from 'next/navigation';

function SellerContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, logoutSeller } = useApp();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        // Auth protection
        if (!isAuthenticated && pathname !== '/seller/auth') {
            router.push('/seller/auth');
        } else if (isAuthenticated && pathname === '/seller/auth') {
            router.push('/seller');
        }
    }, [isAuthenticated, pathname, router, isClient]);

    if (!isClient) return null; // Avoid hydration mismatch

    if (pathname === '/seller/auth') {
        return <>{children}</>;
    }

    // If not auth page, wrap in Layout. 
    // But wait, if we are redirecting, we might flash content.
    // Ideally render null until check done.
    if (!isAuthenticated && pathname !== '/seller/auth') return null;

    return (
        <Layout onLogout={logoutSeller}>
            {children}
        </Layout>
    );
}

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppProvider>
            <SellerContent>{children}</SellerContent>
        </AppProvider>
    );
}
