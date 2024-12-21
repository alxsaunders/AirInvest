// components/layout/ThemedLayout.tsx
'use client';

import { useTheme } from '@/context/ThemeContext';
import { usePathname } from 'next/navigation';

interface ThemedLayoutProps {
  children: React.ReactNode;
}

export default function ThemedLayout({ children }: ThemedLayoutProps) {
  const { theme } = useTheme();
  const pathname = usePathname();

  // Pages that should NOT have the themed background
  const excludedPages = ['/', '/features', '/about', '/login'];

  // Pages that SHOULD have the themed background (for explicit clarity)
  const themedPages = [
    '/dashboard',
    '/results',         
    '/singleresult',
    '/investdetails',
    '/saves',
    '/saved-analyses',
    '/profile',
    '/settings',
    '/verify-email'
  ];

  // Check if current path starts with any themed page path
  const shouldApplyTheme = themedPages.some(page => pathname.startsWith(page));
  
  // Don't apply themed background to excluded pages
  if (excludedPages.includes(pathname) || !shouldApplyTheme) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Dynamic background with blur */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundImage: `url('/assets/photos/${theme === 'night' ? 'CityNight.jpg' : 'Daylight.jpg'}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[4px] bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}