'use client'

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Property } from '@/types/property';
import { Label } from "@/components/ui/label";
import { STATE_DOWN_PAYMENTS, type StateName } from '@/lib/constants/downPayments';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvestmentCalculatorProps {
  property: Property;
}

const MORTGAGE_RATES = {
  '10 Year': 6.5,
  '20 Year': 7.0,
  '30 Year': 7.5
} as const;

type MortgageTerm = keyof typeof MORTGAGE_RATES;

const STATE_INSURANCE_RATES: { [key: string]: number } = {
  'AL': 235, 'AK': 82, 'AZ': 186, 'AR': 248, 'CA': 123,
  'CO': 268, 'CT': 134, 'DE': 81, 'DC': 117, 'FL': 461,
  'GA': 168, 'HI': 100, 'ID': 107, 'IL': 201, 'IN': 143,
  'IA': 190, 'KS': 353, 'KY': 273, 'LA': 358, 'ME': 102,
  'MD': 130, 'MA': 139, 'MI': 170, 'MN': 215, 'MS': 274,
  'MO': 176, 'MT': 211, 'NE': 462, 'NV': 80, 'NH': 82,
  'NJ': 97, 'NM': 173, 'NY': 145, 'NC': 205, 'ND': 240,
  'OH': 109, 'OK': 421, 'OR': 85, 'PA': 103, 'RI': 174,
  'SC': 202, 'SD': 238, 'TN': 193, 'TX': 324, 'UT': 100,
  'VT': 67, 'VA': 127, 'WA': 119, 'WV': 83, 'WI': 100,
  'WY': 113
};

export function InvestmentCalculator({ property }: InvestmentCalculatorProps) {
    const [paymentType, setPaymentType] = useState('Mortgage');
    const [mortgageTerm, setMortgageTerm] = useState<MortgageTerm>('30 Year');
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [renovationCost, setRenovationCost] = useState('0');
    const [customRate, setCustomRate] = useState<number>(MORTGAGE_RATES[mortgageTerm]);
    const [yearlyRateIncrease, setYearlyRateIncrease] = useState(0.25);
    const [insuranceAdjustment, setInsuranceAdjustment] = useState(0);

  const calculateMortgage = () => {
    const downPayment = (property.price * downPaymentPercent) / 100;
    const loanAmount = property.price - downPayment;
    const effectiveRate = (customRate + yearlyRateIncrease) / 100 / 12;
    const terms = parseInt(mortgageTerm) * 12;
    
    const monthlyPayment = 
      (loanAmount * effectiveRate * Math.pow(1 + effectiveRate, terms)) / 
      (Math.pow(1 + effectiveRate, terms) - 1);
    
    return monthlyPayment;
  };

  const getMonthlyInsurance = () => {
    const baseRate = STATE_INSURANCE_RATES[property.state] || 200;
    const adjustmentFactor = property.price / 300000;
    const adjustedRate = baseRate * adjustmentFactor;
    return adjustedRate + insuranceAdjustment;
  };

  const getTotalMonthlyPayment = () => {
    const mortgagePayment = paymentType === 'Mortgage' ? calculateMortgage() : 0;
    const insurancePayment = getMonthlyInsurance();
    return mortgagePayment + insurancePayment;
  };

  return (
    <div className="space-y-8">
      {/* Investment Summary Card */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Investment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-gray-300">
            <div>Purchase Price:</div>
            <div className="text-right">${property.price.toLocaleString()}</div>

            {paymentType === "Mortgage" && (
              <>
                <div>Down Payment:</div>
                <div className="text-right">
                  ${((property.price * downPaymentPercent) / 100).toLocaleString()}{" "}
                  ({downPaymentPercent}%)
                </div>
                <div>Principal & Interest:</div>
                <div className="text-right">${calculateMortgage().toFixed(2)}</div>
                <div>Effective Rate:</div>
                <div className="text-right">
                  {(customRate + yearlyRateIncrease).toFixed(2)}%
                </div>
              </>
            )}

            <div>Est. Monthly Insurance:</div>
            <div className="text-right">${getMonthlyInsurance().toFixed(2)}</div>

            <div className="font-semibold">Total Monthly Payment:</div>
            <div className="text-right font-semibold">
              ${getTotalMonthlyPayment().toFixed(2)}
            </div>

            {parseInt(renovationCost) > 0 && (
              <>
                <div className="text-black font-medium">Renovation Cost:</div>
                <div className="text-right text-black font-medium">
                  ${parseInt(renovationCost).toLocaleString()}
                </div>
                <div className="text-black font-medium">Total Investment:</div>
                <div className="text-right text-black font-medium">
                  ${(property.price + parseInt(renovationCost)).toLocaleString()}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calculator Controls */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select value={paymentType} onValueChange={setPaymentType}>
            <SelectTrigger className="w-full bg-white text-black border border-gray-200">
              <SelectValue placeholder="Select Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='text-black' value="Cash">CASH PURCHASE</SelectItem>
              <SelectItem className='text-black' value="Mortgage">MORTGAGE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {paymentType === "Mortgage" && (
          <>
            <div className="space-y-2">
              <Label>Mortgage Term</Label>
              <Select
                value={mortgageTerm}
                onValueChange={(value) => {
                  setMortgageTerm(value as MortgageTerm);
                  setCustomRate(MORTGAGE_RATES[value as MortgageTerm]);
                }}
              >
                <SelectTrigger className="w-full bg-white text-black border border-gray-200">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(MORTGAGE_RATES) as MortgageTerm[]).map(
                    (term) => (
                      <SelectItem key={term} value={term} className="text-black">
                        {term.toUpperCase()} (Default: {MORTGAGE_RATES[term]}%)
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Custom Interest Rate (%)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={customRate}
                  onChange={(e) => setCustomRate(Number(e.target.value))}
                  step="0.1"
                  className="w-full bg-white text-black border border-gray-200"
                />
                <button
                  onClick={() => setCustomRate(MORTGAGE_RATES[mortgageTerm])}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Yearly Rate Increase (%)</Label>
              <Input
                type="number"
                value={yearlyRateIncrease}
                onChange={(e) => setYearlyRateIncrease(Number(e.target.value))}
                step="0.05"
                className="w-full bg-white text-black border border-gray-200"
              />
            </div>

            <div className="space-y-2">
  <Label>Down Payment</Label>
  <Select
    value={downPaymentPercent.toString()}
    onValueChange={(value) => setDownPaymentPercent(Number(value))}
  >
    <SelectTrigger className="w-full bg-white text-black border border-gray-200">
      <SelectValue placeholder="Select Down Payment %" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem className="text-black" value="3.5">
        3.5% - FHA MINIMUM
      </SelectItem>
      <SelectItem className="text-black" value={STATE_DOWN_PAYMENTS[property.state as StateName].percentage.toString()}>
        {STATE_DOWN_PAYMENTS[property.state as StateName].percentage}% - STATE AVERAGE
      </SelectItem>
      <SelectItem className="text-black" value="10">
        10% - MINIMUM
      </SelectItem>
      <SelectItem className="text-black" value="20">
        20% - CONVENTIONAL
      </SelectItem>
      <SelectItem className="text-black" value="25">
        25% - LOWER RATE
      </SelectItem>
      <SelectItem className="text-black" value="30">
        30% - BEST RATE
      </SelectItem>
    </SelectContent>
  </Select>
</div>
          </>
        )}

        <div className="space-y-2">
          <Label>Additional Monthly Insurance ($)</Label>
          <Input
            type="number"
            value={insuranceAdjustment}
            onChange={(e) => setInsuranceAdjustment(Number(e.target.value))}
            step="1"
            placeholder="Enter additional amount"
            className="w-full bg-white text-black border border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label>Renovation Budget</Label>
          <Input
            type="number"
            placeholder="Renovation Cost"
            value={renovationCost}
            onChange={(e) => setRenovationCost(e.target.value)}
            className="w-full bg-white text-black border border-gray-200"
          />
        </div>
      </div>
    </div>
  );
}