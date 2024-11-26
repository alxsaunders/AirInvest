'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PriceHistoryItem } from '@/types/property';

interface PriceHistoryProps {
  priceHistory: PriceHistoryItem[];
}

export function PriceHistory({ priceHistory }: PriceHistoryProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPriceChange = (rate: number): string => {
    const percentage = (rate * 100).toFixed(1);
    const sign = rate > 0 ? '+' : '';
    return `${sign}${percentage}%`;
  };

  const data = priceHistory
    .sort((a, b) => a.time - b.time)
    .map(item => ({
      date: formatDate(item.date),
      price: item.price,
      pricePerSqFt: item.pricePerSquareFoot,
      change: item.priceChangeRate
    }));

  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#9CA3AF' }}
            />
            <YAxis 
              tickFormatter={formatPrice}
              width={100}
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#9CA3AF' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.375rem',
                color: '#E5E7EB'
              }}
              formatter={(value: number) => formatPrice(value)}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center text-gray-300 py-2 border-b border-gray-700"
          >
            <div className="text-sm">{item.date}</div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                {formatPrice(item.pricePerSqFt)}/sqft
              </div>
              <div 
                className={`text-sm ${
                  item.change > 0 
                    ? 'text-green-400' 
                    : item.change < 0 
                    ? 'text-red-400' 
                    : 'text-gray-400'
                }`}
              >
                {formatPriceChange(item.change)}
              </div>
              <div className="font-medium">
                {formatPrice(item.price)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}