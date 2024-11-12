'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NavBar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserName(user.signInDetails?.loginId?.split('@')[0] || null);
    } else {
      setUserName(null);
    }
    setIsLoading(false);
  }, [user, pathname]);

  const handleSignOut = async () => {
    try {
      await logout();
      setUserName(null);
      setShowDropdown(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

            {!isLoading && (
              userName ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-1 text-white hover:text-blue-400 font-medium focus:outline-none"
                  >
                    <span>Hello, {userName}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login"  
                  className="text-white hover:text-blue-400 font-medium"
                >
                  Login/SignUp
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;