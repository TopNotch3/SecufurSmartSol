import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Secufur Admin',
  description: 'Admin Portal',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`admin-root min-h-screen bg-gray-50 ${inter.className}`}>
      {children}
    </div>
  );
}
