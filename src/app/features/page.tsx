'use client'
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  const { theme } = useTheme();
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 transition-all duration-300 hover:bg-gray-700/60 hover:translate-y-[-5px]">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 mr-4">
          <Image src={`/assets/icons/${icon}.svg`} alt={title} width={24} height={24} />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default function Features() {
  const { theme } = useTheme();
  
  const features = [
    {
      icon: "chart",
      title: "Market Analysis",
      description: "Get comprehensive market insights including trends, cap rates, and rental yields for any area."
    },
    {
      icon: "calculate",
      title: "ROI Calculator",
      description: "Calculate potential returns on investment properties with customizable parameters."
    },
    {
      icon: "map",
      title: "Interactive Maps",
      description: "Explore neighborhoods with detailed property and market data overlays."
    },
    {
      icon: "compare",
      title: "Property Comparison",
      description: "Compare multiple investment opportunities side by side to make informed decisions."
    },
    {
      icon: "save",
      title: "Save & Export",
      description: "Save your analyses and export detailed reports for your investment portfolio."
    },
    {
      icon: "trends",
      title: "Trend Forecasting",
      description: "Access predictive analytics to understand potential future market performance."
    }
  ];
  
  return (
    <section className="py-16 relative">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url('/assets/patterns/grid-${theme === 'night' ? 'dark' : 'light'}.svg')`,
          backgroundSize: "cover"
        }}
      />
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Investment <span className="text-blue-400">Features</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            AirInvest provides all the tools you need to analyze, compare, and optimize your real estate investment decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
            Explore All Features
          </button>
        </div>
      </div>
      
    </section>
  );
}