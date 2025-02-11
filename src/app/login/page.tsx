'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { checkAuth, isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await checkAuth();
      if (isAuthenticated) {
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      // User is not authenticated, continue showing login page
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      await checkAuth();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition duration-200 hover:bg-white/20";
  const labelClasses = "block text-sm font-medium mb-2 text-white/80";

  return (
    <div className="relative min-h-screen">
      {/* Background with blur */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/photos/loginbg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[4px] bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 p-8 backdrop-blur-md bg-black/35 border border-white/10 shadow-2xl rounded-2xl">
          <div>
            <h2 className="mt-2 text-center text-3xl font-light text-white/90 tracking-wide">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-white/60">
              Or{' '}
              <Link 
                href="/register" 
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                create a new account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/50 text-red-400 px-4 py-3 rounded-xl backdrop-blur-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className={inputClasses}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className={inputClasses}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full bg-gradient-to-r from-blue-600 to-blue-700
                text-white font-bold py-4 px-6 rounded-xl
                transition-all duration-300 shadow-lg shadow-blue-500/20
                hover:shadow-xl hover:shadow-blue-500/30
                backdrop-blur-md border border-blue-400/20
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
              `}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}