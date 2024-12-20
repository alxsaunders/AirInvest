'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import Image from 'next/image';

const NavBar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    getUserAttributes();
  }, [user, pathname]);

  const getUserAttributes = async () => {
    if (user) {
      try {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setFirstName(attributes.given_name || attributes.name?.split(' ')[0] || null);
      } catch (error) {
        console.error('Error fetching user attributes:', error);
        setFirstName(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFirstName(null);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setFirstName(null);
      setShowDropdown(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative">
      <nav className="relative z-50 backdrop-blur-md bg-black/25 border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
            >
              <div className="flex items-center">
                <span className="text-white text-2xl font-bold tracking-tight">Air Invest</span>
                <span className="text-blue-400 ml-2">
                  <Image
                    src="/assets/icons/NAVLOGO2.png"
                    alt="Navigation Logo"
                    width={40}
                    height={40}
                    className="transform hover:-rotate-12 transition-transform duration-300"
                  />
                </span>
              </div>
            </Link>

            {/* Navigation Items + Auth - Fixed width container */}
            <div className="flex items-center">
              {/* Navigation Links - Always visible */}
              <div className="flex items-center space-x-6 mr-6">
                <Link
                  href={user ? "/dashboard" : "/"}
                  className={`text-white/90 hover:text-blue-400 font-medium transition-colors duration-200 px-3 py-2 border-b-2 ${
                    pathname === '/' || pathname === '/dashboard' ? 'border-blue-400 text-blue-400' : 'border-transparent'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/features"
                  className={`text-white/90 hover:text-blue-400 font-medium transition-colors duration-200 px-3 py-2 border-b-2 ${
                    pathname === '/features' ? 'border-blue-400 text-blue-400' : 'border-transparent'
                  }`}
                >
                  Features
                </Link>
                <Link
                  href="/about"
                  className={`text-white/90 hover:text-blue-400 font-medium transition-colors duration-200 px-3 py-2 border-b-2 ${
                    pathname === '/about' ? 'border-blue-400 text-blue-400' : 'border-transparent'
                  }`}
                >
                  About
                </Link>
              </div>

              {/* Auth Section - Fixed width */}
              <div className="w-32">
                {!isLoading && (
                  firstName ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 text-white/90 hover:text-blue-400 font-medium focus:outline-none transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/5"
                      >
                        <span className="truncate">Hello, {firstName}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                            showDropdown ? "rotate-180" : ""
                          }`}
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
                        <div className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-black/40 rounded-lg shadow-lg py-1 z-[9999] border border-white/10">
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-blue-400 transition-colors duration-200 first:rounded-t-lg"
                            onClick={() => setShowDropdown(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/saved-analyses"
                            className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-blue-400 transition-colors duration-200"
                            onClick={() => setShowDropdown(false)}
                          >
                            Saves
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-blue-400 transition-colors duration-200 last:rounded-b-lg"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="text-white/90 hover:text-blue-400 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                      Login/SignUp
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="absolute w-full h-8 bg-gradient-to-b from-black/25 to-transparent"></div>
    </div>
  );
};

export default NavBar;