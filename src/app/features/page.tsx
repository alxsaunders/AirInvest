"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  comingSoon?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  comingSoon,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`${
        theme === "night" ? "bg-gray-800/50" : "bg-white/90"
      } backdrop-blur-md rounded-lg p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl relative`}
    >
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-xs px-2 py-1 rounded-full font-semibold text-black">
          Coming Soon
        </div>
      )}
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 flex items-center justify-center rounded-full ${
            theme === "night" ? "bg-blue-600" : "bg-blue-500"
          } mb-4`}
        >
          {icon}
        </div>
        <h3
          className={`text-xl font-semibold mb-3 ${
            theme === "night" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm ${
            theme === "night" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default function Features() {
  const { theme } = useTheme();

  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Market Analysis",
      description:
        "Get comprehensive market insights including trends, cap rates, and rental yields for any area.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "ROI Calculator",
      description:
        "Calculate potential returns on investment properties with customizable parameters.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
      title: "Interactive Maps",
      description:
        "Explore neighborhoods with detailed property and market data overlays.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Property Comparison",
      description:
        "Compare multiple investment opportunities side by side to make informed decisions.",
      comingSoon: true,
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
      ),
      title: "Save",
      description:
        "Save your analyses and export detailed reports for your investment portfolio.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      title: "Trend Forecasting",
      description:
        "Access predictive analytics to understand potential future market performance.",
    },
  ];

  return (
    <section className="relative min-h-screen py-16">
      {/* Background Image based on theme */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundImage: `url('/assets/photos/${
              theme === "night" ? "CityNight.jpg" : "Daylight.jpg"
            }')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className={`absolute inset-0 ${
            theme === "night"
              ? "backdrop-blur-[2px] bg-gradient-to-br from-black/60 via-black/50 to-black/60"
              : "backdrop-blur-[1px] bg-gradient-to-br from-white/30 via-transparent to-white/20"
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === "night" ? "text-white" : "text-gray-900"
            }`}
          >
            Powerful Investment <span className="text-blue-500">Features</span>
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto ${
              theme === "night" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            AirInvest provides all the tools you need to analyze, compare, and
            optimize your real estate investment decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              comingSoon={feature.comingSoon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
