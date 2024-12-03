// lib/constants/stateData.ts

interface StateData {
    downPayment: {
      percentage: number;
      median: number;
    };
    insurance: {
      averageAnnual: number;
      averageMonthly: number;
    };
  }
  
  export const STATE_DATA: Record<string, StateData> = {
    'Alabama': {
      downPayment: { percentage: 10.70, median: 8788 },
      insurance: { averageAnnual: 1500, averageMonthly: 125 }
    },
    'Alaska': {
      downPayment: { percentage: 12.20, median: 21354 },
      insurance: { averageAnnual: 1025, averageMonthly: 85 }
    },
    'Arizona': {
      downPayment: { percentage: 15.40, median: 34072 },
      insurance: { averageAnnual: 1200, averageMonthly: 100 }
    },
    'Arkansas': {
      downPayment: { percentage: 11.80, median: 11996 },
      insurance: { averageAnnual: 1800, averageMonthly: 150 }
    },
    'California': {
      downPayment: { percentage: 18.40, median: 84244 },
      insurance: { averageAnnual: 1565, averageMonthly: 130 }
    },
    'Colorado': {
      downPayment: { percentage: 18.50, median: 75304 },
      insurance: { averageAnnual: 1350, averageMonthly: 112.50 }
    },
    'Connecticut': {
      downPayment: { percentage: 16.60, median: 47342 },
      insurance: { averageAnnual: 1400, averageMonthly: 117 }
    },
    'Delaware': {
      downPayment: { percentage: 17.00, median: 40412 },
      insurance: { averageAnnual: 900, averageMonthly: 75 }
    },
    'District of Columbia': {
      downPayment: { percentage: 20.90, median: 98670 },
      insurance: { averageAnnual: 1450, averageMonthly: 121 }
    },
    'Florida': {
      downPayment: { percentage: 15.90, median: 35572 },
      insurance: { averageAnnual: 3300, averageMonthly: 275 }
    },
    'Georgia': {
      downPayment: { percentage: 12.70, median: 18258 },
      insurance: { averageAnnual: 1400, averageMonthly: 117 }
    },
    'Hawaii': {
      downPayment: { percentage: 17.00, median: 67790 },
      insurance: { averageAnnual: 1100, averageMonthly: 92 }
    },
    'Idaho': {
      downPayment: { percentage: 20.20, median: 64985 },
      insurance: { averageAnnual: 950, averageMonthly: 79 }
    },
    'Illinois': {
      downPayment: { percentage: 14.30, median: 27348 },
      insurance: { averageAnnual: 1300, averageMonthly: 108 }
    },
    'Indiana': {
      downPayment: { percentage: 12.60, median: 17477 },
      insurance: { averageAnnual: 1050, averageMonthly: 87.50 }
    },
    'Iowa': {
      downPayment: { percentage: 15.50, median: 26461 },
      insurance: { averageAnnual: 1200, averageMonthly: 100 }
    },
    // ... Continue for all states
    'Wyoming': {
      downPayment: { percentage: 16.00, median: 32389 },
      insurance: { averageAnnual: 1285, averageMonthly: 107 }
    }
  } as const;
  
  export type StateName = keyof typeof STATE_DATA;