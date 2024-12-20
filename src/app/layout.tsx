'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import '@/lib/auth-config';
import { AuthProvider } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import VideoLoader from '@/components/loaders/DefaultLoader';
import Script from 'next/script';
import './globals.css';
import { metadata } from './metadata';
import localFont from 'next/font/local';

// Define your custom fonts
const titleFont = localFont({
  src: [
    {
      path: './fonts/title.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/title.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-title'
});

const bodyFont = localFont({
  src: './fonts/body.ttf',
  variable: '--font-body'
});

const footerFont = localFont({
  src: './fonts/footer.otf',
  variable: '--font-footer'
});

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/results', '/singleresult'];

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

  return (
    <div className="min-h-screen flex flex-col font-body">
      <NavBar />
      {isLoading ? (
        <div className="flex-1 relative">
          <VideoLoader />
        </div>
      ) : (
        <main className="flex-1">
          {children}
        </main>
      )}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${titleFont.variable} ${bodyFont.variable} ${footerFont.variable}`}>
      <head>
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>
      <body className="font-body">
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AuthProvider>
        <Script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        />
      </body>
    </html>
  );
}