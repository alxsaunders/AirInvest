'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import '@/lib/auth-config';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import NavBar from '@/components/NavBar';
import VideoLoader from '@/components/loaders/DefaultLoader';
import ThemedLayout from '@/components/layout/ThemedLayout';
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
const protectedRoutes = [
  '/dashboard', 
  '/profile', 
  '/settings', 
  '/results', 
  '/singleresult',
  '/investdetails',
  '/saved-analyses'
];

// Pages that should have themed background
const themedPages = [
  '/dashboard',
  '/results',
  '/singleresult',
  '/investdetails',
  '/saved-analyses',
  '/profile',
  '/settings',
  '/verify-email'
];

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

  // Check if current path should have themed background
  const shouldApplyTheme = themedPages.some(page => pathname.startsWith(page));

  return (
    <div className="min-h-screen flex flex-col font-body">
      <NavBar />
      {isLoading ? (
        <>
          {shouldApplyTheme ? (
            // Themed loading state
            <div className="flex-1">
              <ThemedLayout>
                <div className="relative min-h-[calc(100vh-64px)]">
                  <VideoLoader />
                </div>
              </ThemedLayout>
            </div>
          ) : (
            // Default day theme loading state
            <div className="flex-1 relative">
              <div className="fixed inset-0 z-0">
                <div
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    backgroundImage: "url('/assets/photos/Daylight.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 backdrop-blur-[4px] bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
              </div>
              <div className="relative z-10 min-h-[calc(100vh-64px)]">
                <VideoLoader />
              </div>
            </div>
          )}
        </>
      ) : (
        <main className="flex-1">
          <ThemedLayout>
            {children}
          </ThemedLayout>
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
          <ThemeProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </ThemeProvider>
        </AuthProvider>
        <Script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        />
      </body>
    </html>
  );
}