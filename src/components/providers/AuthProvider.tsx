'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';

type User = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      setUser({
        email: attributes.email ?? '',
        firstName: attributes.given_name ?? '',
        lastName: attributes.family_name ?? '',
        phoneNumber: attributes.phone_number ?? '',
      });
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignIn = async (username: string, password: string) => {
    try {
      await signIn({ username, password });
      const attributes = await fetchUserAttributes();
      
      setUser({
        email: attributes.email ?? '',
        firstName: attributes.given_name ?? '',
        lastName: attributes.family_name ?? '',
        phoneNumber: attributes.phone_number ?? '',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signIn: handleSignIn, 
      signOut: handleSignOut 
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};