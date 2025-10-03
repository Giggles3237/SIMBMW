import {
  GameState,
  Vehicle,
  SalesAdvisor,
  Technician,
  Customer,
  EconomyState,
  DailyReport,
  GAME_CONSTANTS,
  DEFAULT_COEFFICIENTS,
  VEHICLE_MAKES,
  VEHICLE_MODELS,
  ADVISOR_NAMES,
  TECH_NAMES,
  MONTH_TO_SEASON,
  AdvisorArchetype,
  TechArchetype,
  CustomerType,
  VehicleSegment,
  VehicleCondition,
} from '@dealership-sim/shared';
import { generateId, randomInt, randomFloat, randomChoice } from '../../utils/random';

const ADVISOR_ARCHETYPES: AdvisorArchetype[] = [
  'Closer',
  'Relationship Builder',
  'Tech Geek',
  'Grinder',
  'Charmer',
  'Rookie',
  'Process Pro',
  'High-Energy',
  'Finance Whisperer',
  'Slacker',
];

const TECH_ARCHETYPES: TechArchetype[] = [
  'Master Tech',
  'Flat-Rate Rocket',
  'Diagnostic Ace',
  'Apprentice',
  'Grumpy Veteran',
  'Hybrid/EV Specialist',
  'Warranty Wizard',
  'Detail-Oriented',
];

const CUSTOMER_TYPES: CustomerType[] = [
  'Tire-Kicker',
  'Payment Buyer',
  'Luxury Shopper',
  'Internet Shopper',
  'Loyalist',
  'Grinder',
  'Urgent Buyer',
  'Fleet Buyer',
  'EV Curious',
  'Service-to-Sales',
];

function createVehicle(index: number): Vehicle {
  const make = randomChoice(VEHICLE_MAKES);
  const models = VEHICLE_MODELS[make as keyof typeof VEHICLE_MODELS];
  const model = randomChoice(models);
  const year = randomInt(2020, 2024);
  const isNew = year >= 2024;
  const isBEV = model.includes('i4') || model.includes('iX') || model.includes('SE');

  const segments: VehicleSegment[] = ['sedan', 'suv', 'coupe', 'convertible', 'electric'];
  const segment = isBEV ? 'electric' : randomChoice(segments.filter((s) => s !== 'electric'));

  const baseCost = randomInt(25000, 60000);
  const cost = baseCost;
  const asking = cost * randomFloat(1.15, 1.35);
  const reconCost = isNew ? 0 : randomInt(500, 2500);
  const desirability = randomInt(30, 95);

  const conditions: VehicleCondition[] = isNew ? ['new'] : ['used', 'cpo'];
  const condition = isBEV ? 'bev' : randomChoice(conditions);

  return {
    id: generateId('veh'),
    stockNumber: `STK${String(index + 1).padStart(4, '0')}`,
    year,
    make,
    model,
    segment,
    cost,
    floor: cost * 1.02,
    asking,
    ageDays: randomInt(0, 30),
    desirability,
    condition,
    reconCost,
    holdbackPct: DEFAULT_COEFFICIENTS.pricing.holdbackPct,
    pack: DEFAULT_COEFFICIENTS.pricing.pack,
    status: 'inStock',
  };
}

function createAdvisor(index: number): SalesAdvisor {
  const archetype = ADVISOR_ARCHETYPES[index % ADVISOR_ARCHETYPES.length];
  const name = ADVISOR_NAMES[index % ADVISOR_NAMES.length];

  return {
    id: generateId('adv'),
    name,
    archetype,
    skill: {
      close: randomFloat(0.5, 0.9),
      gross: randomFloat(0.5, 0.9),
      csi: randomFloat(0.5, 0.9),
      speed: randomFloat(0.5, 0.9),
    },
    morale: randomInt(60, 90),
    trained: [],
    active: true,
  };
}

function createTechnician(index: number): Technician {
  const archetype = TECH_ARCHETYPES[index % TECH_ARCHETYPES.length];
  const name = TECH_NAMES[index % TECH_NAMES.length];

  return {
    id: generateId('tech'),
    name,
    archetype,
    efficiency: randomFloat(0.8, 1.5),
    comebackRate: randomFloat(0.02, 0.15),
    morale: randomInt(60, 90),
    active: true,
  };
}

export function createCustomer(): Customer {
  const type = randomChoice(CUSTOMER_TYPES);
  const channels: Array<'walk-in' | 'web' | 'phone' | 'referral'> = [
    'walk-in',
    'web',
    'phone',
    'referral',
  ];

  return {
    id: generateId('cust'),
    type,
    priceSensitivity: randomFloat(0.3, 0.9),
    paymentFocus: randomFloat(0.2, 0.8),
    channel: randomChoice(channels),
    loyalty: randomFloat(0.1, 0.9),
  };
}

function createInitialEconomy(): EconomyState {
  return {
    demandIndex: 1.0,
    interestRate: 5.5,
    incentiveLevel: 0.5,
    weatherFactor: 0.9,
    season: MONTH_TO_SEASON(GAME_CONSTANTS.STARTING_MONTH),
  };
}

function generateHistoricalReports(days: number): DailyReport[] {
  const reports: DailyReport[] = [];
  const startDay = GAME_CONSTANTS.STARTING_DAY - days;

  for (let i = 0; i < days; i++) {
    const day = startDay + i;
    const date = `${GAME_CONSTANTS.STARTING_YEAR}-${String(GAME_CONSTANTS.STARTING_MONTH).padStart(2, '0')}-${String(Math.max(1, day)).padStart(2, '0')}`;

    reports.push({
      date,
      sales: {
        unitsSold: randomInt(2, 8),
        avgFrontGross: randomInt(2000, 4000),
        avgBackGross: randomInt(1500, 2500),
        avgTotalGross: randomInt(3500, 6500),
        closingPct: randomFloat(0.2, 0.35),
      },
      inventory: {
        startStock: randomInt(35, 45),
        endStock: randomInt(35, 45),
        avgDaysSupply: randomInt(25, 40),
        aged60Plus: randomInt(2, 8),
        aged90Plus: randomInt(0, 3),
      },
      service: {
        laborHours: randomInt(40, 80),
        partsRevenue: randomInt(3000, 6000),
        comebackPct: randomFloat(0.05, 0.15),
      },
      financials: {
        cashDelta: randomInt(-5000, 15000),
        advertisingROI: randomFloat(1.5, 3.5),
        fixedCoverage: randomFloat(0.7, 1.2),
      },
      hr: {
        avgMorale: randomInt(65, 85),
        trainingCompletions: randomInt(0, 2),
      },
      csi: randomInt(75, 92),
    });
  }

  return reports;
}

export function initializeGameState(): GameState {
  const inventory: Vehicle[] = [];
  for (let i = 0; i < GAME_CONSTANTS.INITIAL_INVENTORY_SIZE; i++) {
    inventory.push(createVehicle(i));
  }

  const advisors: SalesAdvisor[] = [];
  for (let i = 0; i < GAME_CONSTANTS.INITIAL_ADVISORS; i++) {
    advisors.push(createAdvisor(i));
  }

  const techs: Technician[] = [];
  for (let i = 0; i < GAME_CONSTANTS.INITIAL_TECHS; i++) {
    techs.push(createTechnician(i));
  }

  return {
    cash: GAME_CONSTANTS.STARTING_CASH,
    inventory,
    advisors,
    techs,
    leads: [],
    appointments: [],
    activeDeals: [],
    serviceQueue: [],
    completedDeals: [],
    completedROs: [],
    economy: createInitialEconomy(),
    marketing: {
      spendPerDay: 1000,
      leadMultiplier: 1.0,
    },
    coefficients: { ...DEFAULT_COEFFICIENTS },
    dailyReports: generateHistoricalReports(30),
    monthlyReports: [],
    day: GAME_CONSTANTS.STARTING_DAY,
    month: GAME_CONSTANTS.STARTING_MONTH,
    year: GAME_CONSTANTS.STARTING_YEAR,
    speed: GAME_CONSTANTS.DEFAULT_SPEED as 1,
    paused: false,
  };
}
