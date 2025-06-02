"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Property, PropertyPhoto } from "@/types/property";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import InvestLoader from "@/components/loaders/InvestLoader";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AirbnbListing {
  pricing: {
    price: string;
  };
}

interface SaveStatus {
  type: "idle" | "success" | "error";
  message?: string;
}

interface SavedAnalysis {
  id: string;
  propertyId: string;
  airbnbRate: number;
  purchasePrice: number;
  annualRevenue: number;
  roi: number;
  monthlyRevenue: number;
  propertyDetails: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    images: string[];
  };
  createdAt: string;
}

export default function InvestDetails() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [listing, setListing] = useState<AirbnbListing | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ type: "idle" });
  const [isViewingMode, setIsViewingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "projections" | "expenses"
  >("overview");

  useEffect(() => {
    setIsLoading(true);

    const loadingTimer = setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get("mode");

      if (mode === "view") {
        setIsViewingMode(true);
        const savedAnalysisData = localStorage.getItem("savedAnalysis");
        if (savedAnalysisData) {
          try {
            const savedAnalysis: SavedAnalysis = JSON.parse(savedAnalysisData);
            setProperty({
              zpid: parseInt(savedAnalysis.propertyId),
              price: savedAnalysis.purchasePrice,
              bedrooms: savedAnalysis.propertyDetails.bedrooms,
              bathrooms: savedAnalysis.propertyDetails.bathrooms,
              livingArea: savedAnalysis.propertyDetails.sqft,
              address: {
                streetAddress: savedAnalysis.propertyDetails.address,
                city: "",
                state: "",
                zipcode: "",
                neighborhood: null,
                community: null,
              },
              city: "",
              state: "",
              homeStatus: "",
              streetAddress: savedAnalysis.propertyDetails.address,
              zipcode: "",
              latitude: 0,
              longitude: 0,
              homeType: "",
              yearBuilt: 0,
              priceHistory: [],
              originalPhotos: savedAnalysis.propertyDetails.images.map(
                (url) => ({
                  caption: "",
                  mixedSources: {
                    jpeg: [
                      {
                        url,
                        width: 0,
                      },
                    ],
                    webp: [],
                  },
                })
              ) as PropertyPhoto[],
            });

            setListing({
              pricing: {
                price: `$${savedAnalysis.airbnbRate}`,
              },
            });
          } catch (error) {
            console.error("Error parsing saved analysis:", error);
            router.push("/saved-analyses");
          }
        }
      } else {
        const airbnbData = localStorage.getItem("selectedAirbnb");
        const propertyData = localStorage.getItem("zillowProperty");

        if (airbnbData && propertyData) {
          try {
            const parsedListing = JSON.parse(airbnbData);
            const parsedProperty = JSON.parse(propertyData);
            setListing(parsedListing);
            setProperty(parsedProperty);
          } catch (error) {
            console.error("Error parsing data:", error);
          }
        }
      }

      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, [router]);

  const handleSave = async () => {
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    if (!property || !listing) {
      setSaveStatus({
        type: "error",
        message: "Missing property or listing data",
      });
      return;
    }

    setSaving(true);
    setSaveStatus({ type: "idle" });

    try {
      const nightlyRate = parseFloat(listing.pricing.price.replace("$", ""));
      const annualRevenue = nightlyRate * 365 * 0.75;
      const roi =
        ((annualRevenue - property.price * 0.1) / property.price) * 100;

      const images =
        property.originalPhotos?.map(
          (photo) => photo.mixedSources.jpeg[0].url
        ) || [];

      const analysis = {
        propertyId: property.zpid,
        airbnbRate: nightlyRate,
        purchasePrice: property.price,
        annualRevenue,
        roi,
        monthlyRevenue: nightlyRate * 30 * 0.75,
        propertyDetails: {
          address: property.address.streetAddress,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: property.livingArea,
          images,
        },
      };

      const response = await fetch("/api/investment-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis,
          userId: user.userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save analysis");
      }

      setSaveStatus({
        type: "success",
        message: "Analysis saved successfully!",
      });

      setTimeout(() => {
        router.push("/saved-analyses");
      }, 1500);
    } catch (error) {
      console.error("Error saving analysis:", error);
      setSaveStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to save analysis",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    window.scrollTo(0, 0);
    return <InvestLoader />;
  }

  if (!listing || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading investment details...</div>
      </div>
    );
  }

  // Calculate investment metrics
  const nightlyRate = parseFloat(listing.pricing.price.replace("$", ""));
  const monthlyRevenue = nightlyRate * 30 * 0.75;
  const annualRevenue = nightlyRate * 365 * 0.75;

  // Estimated expenses (adjust these based on actual data)
  const monthlyMortgage = property.price * 0.004; // Assuming 30-year mortgage at ~5%
  const monthlyPropertyTax = (property.price * 0.01) / 12;
  const monthlyInsurance = 150;
  const monthlyUtilities = 200;
  const monthlyMaintenance = (property.price * 0.01) / 12;
  const monthlyManagement = monthlyRevenue * 0.1; // 10% property management fee
  const monthlyCleaning = 400;

  const totalMonthlyExpenses =
    monthlyMortgage +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyUtilities +
    monthlyMaintenance +
    monthlyManagement +
    monthlyCleaning;

  const monthlyCashFlow = monthlyRevenue - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCashReturn = (annualCashFlow / (property.price * 0.2)) * 100; // Assuming 20% down
  const capRate =
    ((annualRevenue - (totalMonthlyExpenses - monthlyMortgage) * 12) /
      property.price) *
    100;
  const roi =
    ((annualRevenue - totalMonthlyExpenses * 12) / property.price) * 100;

  // Data for charts
  const monthlyProjectionData = Array.from({ length: 12 }, (_, i) => ({
    month: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][i],
    revenue: monthlyRevenue,
    expenses: totalMonthlyExpenses,
    cashFlow: monthlyCashFlow,
  }));

  const expenseBreakdown = [
    {
      name: "Mortgage",
      value: monthlyMortgage,
      percentage: ((monthlyMortgage / totalMonthlyExpenses) * 100).toFixed(1),
    },
    {
      name: "Property Tax",
      value: monthlyPropertyTax,
      percentage: ((monthlyPropertyTax / totalMonthlyExpenses) * 100).toFixed(
        1
      ),
    },
    {
      name: "Insurance",
      value: monthlyInsurance,
      percentage: ((monthlyInsurance / totalMonthlyExpenses) * 100).toFixed(1),
    },
    {
      name: "Utilities",
      value: monthlyUtilities,
      percentage: ((monthlyUtilities / totalMonthlyExpenses) * 100).toFixed(1),
    },
    {
      name: "Maintenance",
      value: monthlyMaintenance,
      percentage: ((monthlyMaintenance / totalMonthlyExpenses) * 100).toFixed(
        1
      ),
    },
    {
      name: "Management",
      value: monthlyManagement,
      percentage: ((monthlyManagement / totalMonthlyExpenses) * 100).toFixed(1),
    },
    {
      name: "Cleaning",
      value: monthlyCleaning,
      percentage: ((monthlyCleaning / totalMonthlyExpenses) * 100).toFixed(1),
    },
  ];

  const yearlyProjectionData = Array.from({ length: 5 }, (_, i) => ({
    year: `Year ${i + 1}`,
    revenue: annualRevenue * (1 + i * 0.03), // 3% annual growth
    expenses: totalMonthlyExpenses * 12 * (1 + i * 0.02), // 2% expense growth
    equity: property.price * 0.2 + monthlyMortgage * 12 * (i + 1) * 0.3, // Rough equity buildup
  }));

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6366F1",
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isViewingMode && (
          <button
            onClick={() => router.push("/saved-analyses")}
            className="mb-6 text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Saved Analyses
          </button>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {property.address.streetAddress}
            </h1>
            <p className="text-gray-400">
              Purchase Price: ${property.price.toLocaleString()}
            </p>
          </div>
          {!isViewingMode && (
            <div className="flex items-center gap-4">
              {saveStatus.type !== "idle" && (
                <span
                  className={`${
                    saveStatus.type === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {saveStatus.message}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-6 py-3 rounded-lg transition-all ${
                  saving
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                }`}
              >
                {saving ? "Saving..." : "Save Analysis"}
              </button>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">ROI</p>
            <p className="text-2xl font-bold text-green-400">
              {roi.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Cash on Cash Return</p>
            <p className="text-2xl font-bold text-blue-400">
              {cashOnCashReturn.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Cap Rate</p>
            <p className="text-2xl font-bold text-yellow-400">
              {capRate.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">Monthly Cash Flow</p>
            <p
              className={`text-2xl font-bold ${
                monthlyCashFlow > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              $
              {monthlyCashFlow.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "overview"
                ? "bg-blue-500 text-white"
                : "bg-gray-800/50 text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("projections")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "projections"
                ? "bg-blue-500 text-white"
                : "bg-gray-800/50 text-gray-400 hover:text-white"
            }`}
          >
            Projections
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "expenses"
                ? "bg-blue-500 text-white"
                : "bg-gray-800/50 text-gray-400 hover:text-white"
            }`}
          >
            Expenses
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details with Image Gallery */}
            <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Gallery */}
                <div>
                  <div className="relative aspect-video mb-3">
                    <Image
                      src={
                        property.originalPhotos?.[selectedImageIndex]
                          ?.mixedSources.jpeg[0].url || "/placeholder-house.jpg"
                      }
                      alt="Property"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {property.originalPhotos
                      ?.slice(0, 4)
                      .map((photo, index) => (
                        <div
                          key={index}
                          className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden ${
                            selectedImageIndex === index
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <Image
                            src={photo.mixedSources.jpeg[0].url}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Property Info */}
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Property Specs</p>
                    <div className="space-y-1">
                      <p className="text-white">{property.bedrooms} Bedrooms</p>
                      <p className="text-white">
                        {property.bathrooms} Bathrooms
                      </p>
                      <p className="text-white">{property.livingArea} sqft</p>
                      <p className="text-white">
                        Built in {property.yearBuilt}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Location</p>
                    <p className="text-white">
                      {property.address.city}, {property.address.state}
                    </p>
                    <p className="text-white">{property.address.zipcode}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">
                      Airbnb Performance
                    </p>
                    <p className="text-white">Nightly Rate: ${nightlyRate}</p>
                    <p className="text-white">Est. Occupancy: 75%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Financial Summary
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Monthly Revenue</p>
                  <p className="text-xl text-green-400">
                    $
                    {monthlyRevenue
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Monthly Expenses</p>
                  <p className="text-xl text-red-400">
                    $
                    {totalMonthlyExpenses
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Net Cash Flow</p>
                  <p
                    className={`text-xl ${
                      monthlyCashFlow > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    $
                    {monthlyCashFlow
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Annual Cash Flow</p>
                  <p
                    className={`text-xl ${
                      annualCashFlow > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    $
                    {annualCashFlow
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "projections" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Cash Flow Chart */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Monthly Cash Flow Projection
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                    }}
                    labelStyle={{ color: "#F3F4F6" }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 5-Year Projection */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                5-Year Growth Projection
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearlyProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                    }}
                    labelStyle={{ color: "#F3F4F6" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    name="Revenue"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    name="Expenses"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="equity"
                    stroke="#3B82F6"
                    name="Equity"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Investment Metrics Over Time */}
            <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Key Metrics Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">Break-even Point</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {monthlyCashFlow > 0
                      ? "Immediate"
                      : `${Math.ceil(
                          Math.abs((property.price * 0.2) / monthlyCashFlow)
                        )} months`}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 mb-2">5-Year Total Return</p>
                  <p className="text-2xl font-bold text-green-400">
                    $
                    {(annualCashFlow * 5 + property.price * 0.15)
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 mb-2">Payback Period</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {(property.price / annualRevenue).toFixed(1)} years
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Expense Breakdown Pie Chart */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Monthly Expense Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                    }}
                    formatter={(value: number) => `$${value.toFixed(0)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Expense List */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Detailed Monthly Expenses
              </h2>
              <div className="space-y-3">
                {expenseBreakdown.map((expense, index) => (
                  <div
                    key={expense.name}
                    className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-white">{expense.name}</span>
                    </div>
                    <span className="text-gray-300">
                      ${expense.value.toFixed(0)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">
                      Total Monthly Expenses
                    </span>
                    <span className="text-red-400 font-semibold">
                      $
                      {totalMonthlyExpenses
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Expense Ratios */}
            <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Operating Ratios
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">
                    Operating Expense Ratio
                  </p>
                  <p className="text-xl text-yellow-400">
                    {(
                      ((totalMonthlyExpenses - monthlyMortgage) /
                        monthlyRevenue) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">
                    Debt Service Ratio
                  </p>
                  <p className="text-xl text-blue-400">
                    {((monthlyMortgage / monthlyRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">
                    Management Fee Ratio
                  </p>
                  <p className="text-xl text-purple-400">
                    {((monthlyManagement / monthlyRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">Net Margin</p>
                  <p className="text-xl text-green-400">
                    {((monthlyCashFlow / monthlyRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
