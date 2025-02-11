'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID!,
    }
  }
});

export default function Register() {
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

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser();
        router.push('/dashboard');
      } catch (error) {
        // User is not logged in, stay on the sign-up page
      }
    };

    checkUser();
  }, [router]);

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
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.error('Error during sign up:', err);
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

  // Common styles
  const inputClasses = "w-full p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition duration-200 hover:bg-white/20";
  const labelClasses = "block text-sm font-medium mb-2 text-white/80";

  return (
    <div className="relative min-h-screen">
      {/* Background with blur */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/photos/homeBg2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[6px] bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto backdrop-blur-md bg-black/35 border border-white/10 shadow-2xl rounded-2xl p-8"
        >
          <h1 className="text-4xl font-light text-white/90 tracking-wide mb-8 text-center">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/50 text-red-400 px-4 py-3 rounded-xl backdrop-blur-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className={labelClasses}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  className={inputClasses}
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="lastName" className={labelClasses}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  className={inputClasses}
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className={inputClasses}
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                minLength={8}
                className={inputClasses}
                placeholder="********"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <p className="text-sm text-white/60 mt-2">
                Must be at least 8 characters with uppercase, lowercase,
                numbers, and special characters
              </p>
            </div>

            <div>
              <label htmlFor="phone" className={labelClasses}>
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                required
                className={inputClasses}
                placeholder="+1 (555) 555-5555"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <p className="text-sm text-white/60 mt-2">
                Format: +1 followed by your number
              </p>
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
                ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-[1.02]"
                }
              `}
            >
              {isLoading ? "Creating Account..." : "SIGN UP"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
              >
                Login
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}