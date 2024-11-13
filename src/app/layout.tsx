'use client';

import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import '@/lib/auth-config';
import { AuthProvider } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import './globals.css';
import { metadata } from './metadata';
import './globals.css'


const inter = Inter({ subsets: ['latin'] });

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];



function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      await getCurrentUser();
    } catch (error) {
      if (protectedRoutes.includes(pathname)) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <head>
          <meta name="description" content={metadata.description} />
          <title>{metadata.title}</title>
        </head>
      <body className={inter.className}>
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}