import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, Home, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const MarketAnalysis = () => {
  const [cities, setCities] = useState<Array<{ name: string; id: string }>>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cityData, setCityData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [filteredCities, setFilteredCities] = useState<Array<{ name: string; id: string }>>([]);

  // Load cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch('/api/market-data/cities');
        const data = await response.json();
        setCities(data);
        setFilteredCities(data);
        setSelectedCity(data[0]?.name || '');
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };

    loadCities();
  }, []);

  // Filter cities based on search term and filter type
  useEffect(() => {
    let filtered = cities;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filter !== 'all') {
      // This is a placeholder - you'll need to adjust based on your actual data structure
      filtered = filtered.filter(city => {
        switch (filter) {
          case 'metro':
            return city.name.includes('Metro');
          case 'city':
            return !city.name.includes('Metro');
          default:
            return true;
        }
      });
    }

    setFilteredCities(filtered);
  }, [searchTerm, filter, cities]);

  // Load city data when selection changes
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
        <div className="space-y-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Market Analysis
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Filter Dropdown */}
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="metro">Metro Areas</SelectItem>
                <SelectItem value="city">Cities</SelectItem>
              </SelectContent>
            </Select>

            {/* City Selection */}
            <Select 
              value={selectedCity} 
              onValueChange={setSelectedCity}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {filteredCities.map(city => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {cityData && (
          <div className="space-y-6">
            {/* Current Home Value */}
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

            {/* Price Trend Chart */}
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

            {/* Price Forecast */}
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