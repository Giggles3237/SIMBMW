// Core data models for the dealership simulator

export type VehicleCondition = 'new' | 'used' | 'cpo' | 'bev';
export type VehicleStatus = 'inStock' | 'pending' | 'sold';
export type VehicleSegment = 'sedan' | 'suv' | 'coupe' | 'convertible' | 'electric';

export interface Vehicle {
  id: string;
  stockNumber: string;
  year: number;
  make: string;
  model: string;
  segment: VehicleSegment;
  cost: number;
  floor: number;
  asking: number;
  ageDays: number;
  desirability: number; // 0-100
  condition: VehicleCondition;
  reconCost: number;
  holdbackPct: number;
  pack: number;
  status: VehicleStatus;
}

export type AdvisorArchetype =
  | 'Closer'
  | 'Relationship Builder'
  | 'Tech Geek'
  | 'Grinder'
  | 'Charmer'
  | 'Rookie'
  | 'Process Pro'
  | 'High-Energy'
  | 'Finance Whisperer'
  | 'Slacker';

export interface SalesAdvisor {
  id: string;
  name: string;
  archetype: AdvisorArchetype;
  skill: {
    close: number; // 0-1
    gross: number; // 0-1
    csi: number; // 0-1
    speed: number; // 0-1
  };
  morale: number; // 0-100
  trained: string[];
  active: boolean;
}

export type TechArchetype =
  | 'Master Tech'
  | 'Flat-Rate Rocket'
  | 'Diagnostic Ace'
  | 'Apprentice'
  | 'Grumpy Veteran'
  | 'Hybrid/EV Specialist'
  | 'Warranty Wizard'
  | 'Detail-Oriented';

export interface Technician {
  id: string;
  name: string;
  archetype: TechArchetype;
  efficiency: number; // 0-2
  comebackRate: number; // 0-0.2
  morale: number; // 0-100
  active: boolean;
}

export type CustomerType =
  | 'Tire-Kicker'
  | 'Payment Buyer'
  | 'Luxury Shopper'
  | 'Internet Shopper'
  | 'Loyalist'
  | 'Grinder'
  | 'Urgent Buyer'
  | 'Fleet Buyer'
  | 'EV Curious'
  | 'Service-to-Sales';

export type CustomerChannel = 'walk-in' | 'web' | 'phone' | 'referral';

export interface Customer {
  id: string;
  type: CustomerType;
  priceSensitivity: number; // 0-1
  paymentFocus: number; // 0-1
  channel: CustomerChannel;
  loyalty: number; // 0-1
}

export interface Deal {
  id: string;
  vehicleId: string;
  advisorId: string;
  customerId: string;
  date: string;
  frontGross: number;
  backGross: number;
  totalGross: number;
  csiImpact: number;
  soldPrice: number;
}

export interface RO {
  id: string;
  techId: string;
  date: string;
  laborHours: number;
  partsRevenue: number;
  comeback: boolean;
  csiImpact: number;
}

export type Season = 'winter' | 'spring' | 'summer' | 'fall';

export interface EconomyState {
  demandIndex: number; // 0-2
  interestRate: number; // percentage
  incentiveLevel: number; // 0-1
  weatherFactor: number; // 0-1
  season: Season;
}

export interface Marketing {
  spendPerDay: number;
  leadMultiplier: number;
}

export interface Coefficients {
  lead: {
    basePerDay: number;
    marketingK: number;
    diminishingK: number;
  };
  sales: {
    baseClose: number;
    desirabilityWeight: number;
    priceGapWeight: number;
    archetypeWeight: number;
    economyWeight: number;
  };
  pricing: {
    variancePct: number;
    holdbackPct: number;
    pack: number;
    reconMean: number;
  };
  inventory: {
    minDaysSupply: number;
    bulkBuyUnits: number;
    auctionCostSpread: number;
  };
  economy: {
    volatility: number;
    incentiveImpact: number;
    interestRateBand: number;
  };
  service: {
    baseDemand: number;
    partsToLaborRatio: number;
    comebackPenalty: number;
  };
  finance: {
    avgBackGross: number;
    backGrossProb: number;
    cashLagDays: number;
  };
  morale: {
    trainingEffect: number;
    lowMoralePenalty: number;
  };
}

export interface Lead {
  id: string;
  customerId: string;
  date: string;
  status: 'new' | 'appointment' | 'closed' | 'lost';
}

export interface Appointment {
  id: string;
  leadId: string;
  advisorId: string;
  vehicleId?: string;
  date: string;
  status: 'scheduled' | 'completed' | 'no-show';
}

export interface DailyReport {
  date: string;
  sales: {
    unitsSold: number;
    avgFrontGross: number;
    avgBackGross: number;
    avgTotalGross: number;
    closingPct: number;
  };
  inventory: {
    startStock: number;
    endStock: number;
    avgDaysSupply: number;
    aged60Plus: number;
    aged90Plus: number;
  };
  service: {
    laborHours: number;
    partsRevenue: number;
    comebackPct: number;
  };
  financials: {
    cashDelta: number;
    advertisingROI: number;
    fixedCoverage: number;
  };
  hr: {
    avgMorale: number;
    trainingCompletions: number;
  };
  csi: number;
}

export interface MonthlyReport extends DailyReport {
  month: string;
}

export interface GameState {
  cash: number;
  inventory: Vehicle[];
  advisors: SalesAdvisor[];
  techs: Technician[];
  leads: Lead[];
  appointments: Appointment[];
  activeDeals: Deal[];
  serviceQueue: RO[];
  completedDeals: Deal[];
  completedROs: RO[];
  economy: EconomyState;
  marketing: Marketing;
  coefficients: Coefficients;
  dailyReports: DailyReport[];
  monthlyReports: MonthlyReport[];
  day: number;
  month: number;
  year: number;
  speed: 1 | 5 | 30;
  paused: boolean;
}

// API DTOs
export interface StateDTO {
  cash: number;
  day: number;
  month: number;
  year: number;
  speed: 1 | 5 | 30;
  paused: boolean;
  kpis: {
    unitsInStock: number;
    unitsPending: number;
    unitsSoldMTD: number;
    grossMTD: number;
    serviceHoursMTD: number;
    csiMTD: number;
  };
  recentDeals: Deal[];
  recentROs: RO[];
  inventory: Vehicle[];
  advisors: SalesAdvisor[];
  techs: Technician[];
  leads: Lead[];
  appointments: Appointment[];
  marketing: Marketing;
  economy: EconomyState;
}

export interface TickRequest {
  days?: number;
}

export interface PauseRequest {
  paused: boolean;
}

export interface SpeedRequest {
  multiplier: 1 | 5 | 30;
}

export interface AcquireInventoryRequest {
  pack: 'desirable' | 'neutral' | 'undesirable';
  qty: number;
}

export interface MarketingSpendRequest {
  perDay: number;
}

export interface HireStaffRequest {
  role: 'advisor' | 'tech';
  archetype: string;
}

export interface TrainStaffRequest {
  id: string;
  program: string;
}

export interface ConfigUpdateRequest {
  coefficients: Partial<Coefficients>;
}

export interface HealthCheckResult {
  healthy: boolean;
  warnings: string[];
}
