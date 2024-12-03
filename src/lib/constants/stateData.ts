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
    'Kansas': {
      downPayment: { percentage: 13.10, median: 18325 },
      insurance: { averageAnnual: 1150, averageMonthly: 96 }
    },
    'Kentucky': {
      downPayment: { percentage: 13.40, median: 17548 },
      insurance: { averageAnnual: 1250, averageMonthly: 104 }
    },
    'Louisiana': {
      downPayment: { percentage: 9.20, median: 6470 },
      insurance: { averageAnnual: 1900, averageMonthly: 158 }
    },
    'Maine': {
      downPayment: { percentage: 16.00, median: 40400 },
      insurance: { averageAnnual: 880, averageMonthly: 73 }
    },
    'Maryland': {
      downPayment: { percentage: 11.90, median: 25723 },
      insurance: { averageAnnual: 1100, averageMonthly: 92 }
    },
    'Massachusetts': {
      downPayment: { percentage: 18.90, median: 79206 },
      insurance: { averageAnnual: 1300, averageMonthly: 108 }
    },
    'Michigan': {
      downPayment: { percentage: 14.20, median: 23153 },
      insurance: { averageAnnual: 1100, averageMonthly: 92 }
    },
    'Minnesota': {
      downPayment: { percentage: 16.10, median: 38500 },
      insurance: { averageAnnual: 1450, averageMonthly: 121 }
    },
    'Mississippi': {
      downPayment: { percentage: 9.30, median: 5814 },
      insurance: { averageAnnual: 1600, averageMonthly: 133 }
    },
    'Missouri': {
      downPayment: { percentage: 12.90, median: 17832 },
      insurance: { averageAnnual: 1350, averageMonthly: 113 }
    },
    'Montana': {
      downPayment: { percentage: 21.00, median: 72833 },
      insurance: { averageAnnual: 1050, averageMonthly: 88 }
    },
    'Nebraska': {
      downPayment: { percentage: 15.40, median: 29617 },
      insurance: { averageAnnual: 1300, averageMonthly: 108 }
    },
    'Nevada': {
      downPayment: { percentage: 15.00, median: 33306 },
      insurance: { averageAnnual: 900, averageMonthly: 75 }
    },
    'New Hampshire': {
      downPayment: { percentage: 20.00, median: 71500 },
      insurance: { averageAnnual: 950, averageMonthly: 79 }
    },
    'New Jersey': {
      downPayment: { percentage: 18.10, median: 71547 },
      insurance: { averageAnnual: 1100, averageMonthly: 92 }
    },
    'New Mexico': {
      downPayment: { percentage: 12.60, median: 17576 },
      insurance: { averageAnnual: 1200, averageMonthly: 100 }
    },
    'New York': {
      downPayment: { percentage: 17.00, median: 50843 },
      insurance: { averageAnnual: 1300, averageMonthly: 108 }
    },
    'North Carolina': {
      downPayment: { percentage: 14.50, median: 31867 },
      insurance: { averageAnnual: 1200, averageMonthly: 100 }
    },
    'North Dakota': {
      downPayment: { percentage: 15.00, median: 24543 },
      insurance: { averageAnnual: 1100, averageMonthly: 92 }
    },
    'Ohio': {
      downPayment: { percentage: 12.30, median: 15064 },
      insurance: { averageAnnual: 850, averageMonthly: 71 }
    },
    'Oklahoma': {
      downPayment: { percentage: 12.30, median: 13177 },
      insurance: { averageAnnual: 1800, averageMonthly: 150 }
    },
    'Oregon': {
      downPayment: { percentage: 17.30, median: 55015 },
      insurance: { averageAnnual: 800, averageMonthly: 67 }
    },
    'Pennsylvania': {
      downPayment: { percentage: 13.80, median: 25402 },
      insurance: { averageAnnual: 900, averageMonthly: 75 }
    },
    'Rhode Island': {
      downPayment: { percentage: 16.60, median: 45285 },
      insurance: { averageAnnual: 1400, averageMonthly: 117 }
    },
    'South Carolina': {
      downPayment: { percentage: 15.10, median: 24357 },
      insurance: { averageAnnual: 1300, averageMonthly: 108 }
    },
    'South Dakota': {
      downPayment: { percentage: 16.80, median: 37630 },
      insurance: { averageAnnual: 1200, averageMonthly: 100 }
    },
    'Tennessee': {
      downPayment: { percentage: 14.60, median: 25969 },
      insurance: { averageAnnual: 1300, averageMonthly: 108 }
    },
    'Texas': {
      downPayment: { percentage: 12.20, median: 18780 },
      insurance: { averageAnnual: 2050, averageMonthly: 171 }
    },
    'Utah': {
      downPayment: { percentage: 16.40, median: 43488 },
      insurance: { averageAnnual: 750, averageMonthly: 63 }
    },
    'Vermont': {
      downPayment: { percentage: 17.50, median: 48354 },
      insurance: { averageAnnual: 900, averageMonthly: 75 }
    },
    'Virginia': {
      downPayment: { percentage: 13.50, median: 29704 },
      insurance: { averageAnnual: 1000, averageMonthly: 83 }
    },
    'Washington': {
      downPayment: { percentage: 18.60, median: 86752 },
      insurance: { averageAnnual: 950, averageMonthly: 79 }
    },
    'West Virginia': {
      downPayment: { percentage: 9.20, median: 6611 },
      insurance: { averageAnnual: 900, averageMonthly: 75 }
    },
    'Wisconsin': {
      downPayment: { percentage: 15.00, median: 28333 },
      insurance: { averageAnnual: 950, averageMonthly: 79 }
    },
    'Wyoming': {
      downPayment: { percentage: 16.00, median: 32389 },
      insurance: { averageAnnual: 1285, averageMonthly: 107 }
    }
  } as const;
  
  export type StateName = keyof typeof STATE_DATA;