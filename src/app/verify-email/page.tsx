'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Get email from URL params when component mounts
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      
      // Redirect to login page after successful verification
      router.push('/login');
    } catch (err) {
      console.error('Verification error:', err);
      if (err instanceof Error) {
        switch (err.name) {
          case 'CodeMismatchException':
            setError('Invalid verification code. Please try again.');
            break;
          case 'ExpiredCodeException':
            setError('Verification code has expired. Please request a new one.');
            break;
          default:
            setError(err.message);
        }
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setResendLoading(true);
    setError('');

    try {
      await resendSignUpCode({
        username: email
      });
      alert('A new verification code has been sent to your email');
    } catch (err) {
      console.error('Resend code error:', err);
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Please check your email for the verification code
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-300">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1"
              placeholder="Enter the 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              {resendLoading ? 'Sending...' : 'Resend verification code'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white text-sm"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}