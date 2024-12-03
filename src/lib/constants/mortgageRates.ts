export const MORTGAGE_RATES = {
    '10 Year': 6.5,
    '20 Year': 7.0,
    '30 Year': 7.5
  } as const;
  
  export type MortgageTerm = keyof typeof MORTGAGE_RATES;