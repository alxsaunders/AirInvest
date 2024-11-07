'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signUp } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

// Configure Amplify with hardcoded values
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_6rob18eEz',
      userPoolClientId: '1s2u15tlv7uh3hv226a48ecjp5'
    }
  }
});

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const formattedPhone = formData.phone.startsWith('+1') 
        ? formData.phone 
        : `+1${formData.phone.replace(/\D/g, '')}`;
  
      const signUpResult = await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            given_name: formData.firstName,
            family_name: formData.lastName,
            phone_number: formattedPhone,
          }
        }
      });
  
      console.log('Sign up successful:', signUpResult);
      
      // Pass the email to the verification page
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.error('Error during sign up:', err);
      // Handle specific AWS Cognito errors
      if (err instanceof Error) {
        switch (err.name) {
          case 'UsernameExistsException':
            setError('An account with this email already exists.');
            break;
          case 'InvalidParameterException':
            if (err.message.includes('password')) {
              setError('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.');
            } else if (err.message.includes('phone')) {
              setError('Please enter a valid phone number in +1XXXXXXXXXX format.');
            } else {
              setError(err.message);
            }
            break;
          case 'InvalidPasswordException':
            setError('Password must meet complexity requirements.');
            break;
          default:
            setError(err.message);
        }
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <h1 className="text-5xl font-light text-gray-300">
              Watch Your Investments Soar
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="johndoe@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  minLength={8}
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Must be at least 8 characters with uppercase, lowercase, numbers, and special characters
                </p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="+1 (555) 555-5555"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Format: +1 followed by your number
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creating Account...' : 'SIGN UP'}
              </button>
            </form>

            {/* Data Sources */}
            <div className="pt-8">
              <p className="text-gray-400 mb-4">With Data From</p>
              <div className="flex items-center space-x-6">
                <Image
                  src="/airbnb-logo.png"
                  alt="Airbnb"
                  width={100}
                  height={50}
                  className="object-contain"
                />
                <Image
                  src="/zillow-logo.png"
                  alt="Zillow"
                  width={100}
                  height={50}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Column - House Image */}
          <div className="hidden lg:block">
            <Image
              src="/house-3d.png"
              alt="3D House"
              width={600}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400">
        <p>AirInvst 2024</p>
      </footer>
    </div>
  );
}