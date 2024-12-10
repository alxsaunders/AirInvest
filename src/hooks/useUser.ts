'use client'

import { useEffect, useState } from 'react';
import { checkAuthStatus } from '@/lib/auth-config';
import { AuthUser } from '@aws-amplify/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export const useUser = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await checkAuthStatus();
        setAuthState(auth);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading
  };
};