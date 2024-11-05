'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
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
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400"
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
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400"
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
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400"
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
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-3 rounded-lg bg-gray-600 text-white placeholder-gray-400"
                  placeholder="432-875-9864"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                SIGN UP
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