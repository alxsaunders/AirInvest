'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar: React.FC = () => {
  const pathname = usePathname();

  const isActive = React.useCallback((path: string): string => {
    return pathname === path ? 'text-blue-400' : '';
  }, [pathname]);

  return (
    <nav className="bg-[#1E1E1E] p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-white text-2xl font-bold">AirInvst</span>
              <span className="text-blue-400 ml-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C7 4 3 7 3 12H7C7 9 9 7 12 7C15 7 17 9 17 12H21C21 7 17 4 12 4Z" fill="currentColor"/>
                </svg>
              </span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-white hover:text-blue-400 font-medium ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              href="/features" 
              className={`text-white hover:text-blue-400 font-medium ${isActive('/features')}`}
            >
              Features
            </Link>
            <Link 
              href="/about" 
              className={`text-white hover:text-blue-400 font-medium ${isActive('/about')}`}
            >
              About
            </Link>
            <Link 
              href="/login" 
              className="text-white hover:text-blue-400 font-medium"
            >
              Login/SignUp
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;