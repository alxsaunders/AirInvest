'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, Home, ChevronDown } from 'lucide-react';

interface MarketData {
  RegionID: string;
  RegionName: string;
  RegionType: string;
  StateName: string;
  values: Array<{
    date: string;
    value: number;
  }>;
  forecasts: Array<{
    date: string;
    value: number;
  }>;
}

interface MarketAnalysisProps {
  onCityChange: (city: string) => Promise<void>;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ onCityChange }) => {
  const [cities, setCities] = useState<Array<{ name: string; id: string }>>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cityData, setCityData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch('/api/market-data/cities');
        const data = await response.json();
        setCities(data);
        if (data[0]?.name) {
          await handleSelectCity(data[0].name);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };

    loadCities();
  }, []);

  useEffect(() => {
    const loadCityData = async () => {
      if (!selectedCity) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/market-data/city?name=${encodeURIComponent(selectedCity)}`);
        const data = await response.json();
        setCityData(data);
      } catch (error) {
        console.error('Error loading city data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCityData();
  }, [selectedCity]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSelectCity = async (cityName: string) => {
    setSelectedCity(cityName);
    setDisplayValue(cityName);
    setSearchTerm('');
    setIsOpen(false);
    await onCityChange(cityName);
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSearchTerm('');
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="w-full h-96">
        <CardContent className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  const currentValue = cityData?.values[cityData.values.length - 1]?.value || 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Market Analysis
          </CardTitle>
          <div className="relative w-64">
            <div 
              className="flex items-center w-full p-2 border rounded-md bg-white cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <input
                type="text"
                value={isOpen ? searchTerm : displayValue}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onClick={handleInputClick}
                placeholder="Search cities..."
                className="w-full outline-none border-none p-0 m-0"
              />
              <ChevronDown className="h-4 w-4 text-gray-500 ml-2" />
            </div>
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                {cities
                  .filter(city => 
                    city.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(city => (
                    <div
                      key={city.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectCity(city.name)}
                    >
                      {city.name}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {cityData && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Home className="w-5 h-5" />
                <h3 className="font-semibold">Current Home Value</h3>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(currentValue)}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {selectedCity}
              </p>
            </div>

            <div className="h-64">
              <h3 className="text-sm font-semibold mb-2">Price Trend</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cityData.values.slice(-12)}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                      month: 'short',
                      year: '2-digit'
                    })}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                      month: 'long',
                      year: 'numeric'
                    })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {cityData.forecasts.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-semibold">Price Forecast</h3>
                </div>
                <div className="space-y-2">
                  {cityData.forecasts.map(forecast => (
                    <div key={forecast.date} className="flex justify-between items-center">
                      <span>
                        {new Date(forecast.date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className={`font-semibold ${
                        forecast.value >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {forecast.value > 0 ? '+' : ''}{forecast.value.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketAnalysis;