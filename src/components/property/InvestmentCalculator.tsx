// components/property/InvestmentCalculator.tsx
'use client'

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { STATE_DOWN_PAYMENTS, type StateName } from '@/lib/constants/downPayments';
import { MORTGAGE_RATES, type MortgageTerm } from '@/lib/constants/mortgageRates';
import { Property } from '@/types/property';

interface InvestmentCalculatorProps {
  property: Property;
}

export function InvestmentCalculator({ property }: InvestmentCalculatorProps) {
  const [paymentType, setPaymentType] = useState('mortgage');
  const [downPaymentOption, setDownPaymentOption] = useState('percentage');
  const [mortgageTerm, setMortgageTerm] = useState<MortgageTerm>('30 Year');
  const [renovationCost, setRenovationCost] = useState('0');
  // Change the type to regular number instead of literal types
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(() => {
    const stateDownPayment = STATE_DOWN_PAYMENTS[property.state as StateName]?.percentage;
    return stateDownPayment || 20;
  });

  const calculateMortgage = () => {
    const downPayment = (property.price * downPaymentPercent) / 100;
    const loanAmount = property.price - downPayment;
    const rate = MORTGAGE_RATES[mortgageTerm] / 100 / 12;
    const terms = parseInt(mortgageTerm) * 12;
    
    const monthlyPayment = 
      (loanAmount * rate * Math.pow(1 + rate, terms)) / 
      (Math.pow(1 + rate, terms) - 1);
    
    return monthlyPayment;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <Select value={paymentType} onValueChange={setPaymentType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash Purchase</SelectItem>
            <SelectItem value="mortgage">Mortgage</SelectItem>
          </SelectContent>
        </Select>

        {paymentType === 'mortgage' && (
          <>
            <Select 
              value={mortgageTerm} 
              onValueChange={(value) => setMortgageTerm(value as MortgageTerm)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mortgage Term" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(MORTGAGE_RATES) as MortgageTerm[]).map((term) => (
                  <SelectItem key={term} value={term}>
                    {term} ({MORTGAGE_RATES[term]}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={downPaymentOption} onValueChange={setDownPaymentOption}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Down Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage Based</SelectItem>
                <SelectItem value="state">
                  State Average ({STATE_DOWN_PAYMENTS[property.state as StateName]?.percentage}%)
                </SelectItem>
                <SelectItem value="custom">Custom Amount</SelectItem>
              </SelectContent>
            </Select>

            {downPaymentOption === 'percentage' && (
              <Select 
                value={downPaymentPercent.toString()} 
                onValueChange={(value) => setDownPaymentPercent(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Down Payment %" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.5">3.5% - FHA Minimum</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="20">20% - Conventional</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="30">30%</SelectItem>
                </SelectContent>
              </Select>
            )}
          </>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Renovation Budget</h3>
        <Input
          type="number"
          placeholder="Renovation Cost"
          value={renovationCost}
          onChange={(e) => setRenovationCost(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Investment Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-gray-300">
          <div>Purchase Price:</div>
          <div className="text-right">${property.price.toLocaleString()}</div>
          
          {paymentType === 'mortgage' && (
            <>
              <div>Down Payment:</div>
              <div className="text-right">
                ${((property.price * downPaymentPercent) / 100).toLocaleString()} ({downPaymentPercent}%)
              </div>
              <div>Monthly Payment:</div>
              <div className="text-right">${calculateMortgage().toFixed(2)}</div>
            </>
          )}
          
          {parseInt(renovationCost) > 0 && (
            <>
              <div>Renovation Cost:</div>
              <div className="text-right">${parseInt(renovationCost).toLocaleString()}</div>
              <div>Total Investment:</div>
              <div className="text-right">
                ${(property.price + parseInt(renovationCost)).toLocaleString()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}