// Game constants and configuration

export const GAME_CONSTANTS = {
  STARTING_CASH: 500000,
  STARTING_DAY: 1,
  STARTING_MONTH: 1,
  STARTING_YEAR: 2024,
  DAYS_IN_MONTH: 30,
  MONTHS_IN_YEAR: 12,
  
  // Inventory
  INITIAL_INVENTORY_SIZE: 40,
  MIN_DESIRABILITY: 0,
  MAX_DESIRABILITY: 100,
  
  // Staff
  INITIAL_ADVISORS: 10,
  INITIAL_TECHS: 8,
  MIN_MORALE: 0,
  MAX_MORALE: 100,
  
  // Time
  DEFAULT_SPEED: 1,
  SPEED_OPTIONS: [1, 5, 30] as const,
  
  // Thresholds
  AGED_60_THRESHOLD: 60,
  AGED_90_THRESHOLD: 90,
  LOW_MORALE_THRESHOLD: 40,
  HIGH_DESIRABILITY_THRESHOLD: 70,
  LOW_DESIRABILITY_THRESHOLD: 30,
};

export const VEHICLE_MAKES = ['BMW', 'MINI'];

export const VEHICLE_MODELS = {
  BMW: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', 'i4', 'iX'],
  MINI: ['Cooper', 'Countryman', 'Clubman', 'Cooper SE'],
};

export const ADVISOR_NAMES = [
  'Alex Johnson',
  'Maria Garcia',
  'James Smith',
  'Sarah Lee',
  'Michael Brown',
  'Emily Davis',
  'David Wilson',
  'Jessica Martinez',
  'Robert Taylor',
  'Jennifer Anderson',
  'William Thomas',
  'Lisa Jackson',
];

export const TECH_NAMES = [
  'John Mechanic',
  'Susan Wrench',
  'Tom Toolman',
  'Nancy Nuts',
  'Frank Fixer',
  'Betty Bolt',
  'Carl Clutch',
  'Diana Diesel',
];

export const TRAINING_PROGRAMS = [
  'Customer Service Excellence',
  'Advanced Sales Techniques',
  'EV Certification',
  'Finance & Insurance',
  'Diagnostic Mastery',
  'Hybrid Systems',
  'Warranty Processing',
];

export const SEASONS: Array<'winter' | 'spring' | 'summer' | 'fall'> = [
  'winter',
  'spring',
  'summer',
  'fall',
];

export const MONTH_TO_SEASON = (month: number): 'winter' | 'spring' | 'summer' | 'fall' => {
  if (month >= 12 || month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'fall';
};

export const DEFAULT_COEFFICIENTS = {
  lead: {
    basePerDay: 15,
    marketingK: 0.5,
    diminishingK: 0.001,
  },
  sales: {
    baseClose: 0.25,
    desirabilityWeight: 0.3,
    priceGapWeight: 0.2,
    archetypeWeight: 0.25,
    economyWeight: 0.2,
  },
  pricing: {
    variancePct: 0.05,
    holdbackPct: 0.03,
    pack: 500,
    reconMean: 1500,
  },
  inventory: {
    minDaysSupply: 30,
    bulkBuyUnits: 10,
    auctionCostSpread: 0.85, // auction cost is 85% of asking price on average
  },
  economy: {
    volatility: 0.02,
    incentiveImpact: 0.1,
    interestRateBand: 0.5,
  },
  service: {
    baseDemand: 20,
    partsToLaborRatio: 1.5,
    comebackPenalty: 0.1,
  },
  finance: {
    avgBackGross: 2000,
    backGrossProb: 0.7,
    cashLagDays: 3,
  },
  morale: {
    trainingEffect: 5,
    lowMoralePenalty: 0.3,
  },
};

export const PRESET_COEFFICIENTS = {
  Easy: {
    ...DEFAULT_COEFFICIENTS,
    lead: { ...DEFAULT_COEFFICIENTS.lead, basePerDay: 20 },
    sales: { ...DEFAULT_COEFFICIENTS.sales, baseClose: 0.35 },
    pricing: { ...DEFAULT_COEFFICIENTS.pricing, holdbackPct: 0.04 },
    finance: { ...DEFAULT_COEFFICIENTS.finance, avgBackGross: 2500 },
  },
  Balanced: DEFAULT_COEFFICIENTS,
  Hard: {
    ...DEFAULT_COEFFICIENTS,
    lead: { ...DEFAULT_COEFFICIENTS.lead, basePerDay: 10 },
    sales: { ...DEFAULT_COEFFICIENTS.sales, baseClose: 0.18 },
    pricing: { ...DEFAULT_COEFFICIENTS.pricing, holdbackPct: 0.02 },
    finance: { ...DEFAULT_COEFFICIENTS.finance, avgBackGross: 1500 },
  },
  Wild: {
    ...DEFAULT_COEFFICIENTS,
    economy: { ...DEFAULT_COEFFICIENTS.economy, volatility: 0.1 },
    sales: { ...DEFAULT_COEFFICIENTS.sales, baseClose: 0.3 },
  },
};
