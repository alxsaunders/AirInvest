'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();


  return (
    <div className="relative min-h-screen w-full overflow-hidden">
    {/* Video Background - positioned fixed to go under navbar */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed top-0 left-0 w-full h-full object-cover z-0 blur-[6px]"
    >
      
      <source src="assets/videos/AirInvest.m4v" type="video/mp4" />
    </video>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/45 z-10" />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white/90 tracking-wide mb-8 px-4">
            Watch Your Investments Soar
          </h1>

          <button
            onClick={() => router.push('/register')}
            className="bg-gradient-to-r from-blue-400 to-blue-500
              hover:from-blue-600 hover:to-blue-700
              text-white font-bold py-4 px-14 rounded-xl
              transition-all duration-300 shadow-lg shadow-blue-500/20
              hover:shadow-xl hover:shadow-blue-500/30
              hover:scale-[1.02] backdrop-blur-md border border-blue-400/20"
          >
            SIGN UP
          </button>
        </motion.div>

        {/* Data Sources Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="backdrop-blur-md bg-black/25 border border-white/20 shadow-2xl rounded-2xl p-6 text-center max-w-xl mx-auto"
        >
          <p className="text-gray-300 mb-4 font-light text-center">With Data From</p>
          <div className="flex items-center justify-center space-x-14">
            <Image
              src="/assets/photos/airbnblogo.png"
              alt="Airbnb"
              width={120}
              height={60}
              className="object-contain"
            />
            <Image
              src="/assets/photos/zillowlogo.png"
              alt="Zillow"
              width={120}
              height={60}
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute bottom-0 w-full text-center py-8 text-gray-400 z-20"
      >
        <p>AirInvest 2024</p>
      </motion.footer>
    </div>
  );
}