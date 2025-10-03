import {
  AdvisorArchetype,
  TechArchetype,
  CustomerType,
  SalesAdvisor,
  Technician,
  Customer,
} from '@dealership-sim/shared';

// Sales Advisor Archetypes with multipliers
export const ADVISOR_ARCHETYPES: Record<
  AdvisorArchetype,
  {
    closeMultiplier: number;
    grossMultiplier: number;
    csiMultiplier: number;
    speedMultiplier: number;
    bevAffinity: number;
  }
> = {
  Closer: {
    closeMultiplier: 1.3,
    grossMultiplier: 1.0,
    csiMultiplier: 0.8,
    speedMultiplier: 1.1,
    bevAffinity: 1.0,
  },
  'Relationship Builder': {
    closeMultiplier: 1.1,
    grossMultiplier: 1.0,
    csiMultiplier: 1.3,
    speedMultiplier: 0.9,
    bevAffinity: 1.0,
  },
  'Tech Geek': {
    closeMultiplier: 1.0,
    grossMultiplier: 1.0,
    csiMultiplier: 1.1,
    speedMultiplier: 1.0,
    bevAffinity: 1.5,
  },
  Grinder: {
    closeMultiplier: 1.0,
    grossMultiplier: 1.3,
    csiMultiplier: 0.9,
    speedMultiplier: 0.7,
    bevAffinity: 1.0,
  },
  Charmer: {
    closeMultiplier: 1.2,
    grossMultiplier: 0.95,
    csiMultiplier: 1.2,
    speedMultiplier: 1.2,
    bevAffinity: 1.0,
  },
  Rookie: {
    closeMultiplier: 0.7,
    grossMultiplier: 0.8,
    csiMultiplier: 0.85,
    speedMultiplier: 0.8,
    bevAffinity: 0.9,
  },
  'Process Pro': {
    closeMultiplier: 1.05,
    grossMultiplier: 1.05,
    csiMultiplier: 1.15,
    speedMultiplier: 1.0,
    bevAffinity: 1.0,
  },
  'High-Energy': {
    closeMultiplier: 1.15,
    grossMultiplier: 0.9,
    csiMultiplier: 1.0,
    speedMultiplier: 1.3,
    bevAffinity: 1.0,
  },
  'Finance Whisperer': {
    closeMultiplier: 1.0,
    grossMultiplier: 1.4,
    csiMultiplier: 1.0,
    speedMultiplier: 0.9,
    bevAffinity: 1.0,
  },
  Slacker: {
    closeMultiplier: 0.6,
    grossMultiplier: 0.7,
    csiMultiplier: 0.7,
    speedMultiplier: 0.6,
    bevAffinity: 0.8,
  },
};

// Technician Archetypes with multipliers
export const TECH_ARCHETYPES: Record<
  TechArchetype,
  {
    efficiencyMultiplier: number;
    comebackRateModifier: number;
    bevAffinity: number;
  }
> = {
  'Master Tech': {
    efficiencyMultiplier: 1.5,
    comebackRateModifier: -0.05,
    bevAffinity: 1.2,
  },
  'Flat-Rate Rocket': {
    efficiencyMultiplier: 1.8,
    comebackRateModifier: 0.08,
    bevAffinity: 1.0,
  },
  'Diagnostic Ace': {
    efficiencyMultiplier: 1.3,
    comebackRateModifier: -0.03,
    bevAffinity: 1.1,
  },
  Apprentice: {
    efficiencyMultiplier: 0.7,
    comebackRateModifier: 0.05,
    bevAffinity: 1.0,
  },
  'Grumpy Veteran': {
    efficiencyMultiplier: 1.2,
    comebackRateModifier: 0.0,
    bevAffinity: 0.8,
  },
  'Hybrid/EV Specialist': {
    efficiencyMultiplier: 1.1,
    comebackRateModifier: -0.02,
    bevAffinity: 1.8,
  },
  'Warranty Wizard': {
    efficiencyMultiplier: 1.0,
    comebackRateModifier: -0.01,
    bevAffinity: 1.0,
  },
  'Detail-Oriented': {
    efficiencyMultiplier: 0.9,
    comebackRateModifier: -0.08,
    bevAffinity: 1.1,
  },
};

// Customer Type Archetypes with multipliers
export const CUSTOMER_ARCHETYPES: Record<
  CustomerType,
  {
    closeRateMultiplier: number;
    grossMultiplier: number;
    csiExpectation: number;
    bevAffinity: number;
  }
> = {
  'Tire-Kicker': {
    closeRateMultiplier: 0.4,
    grossMultiplier: 0.8,
    csiExpectation: 0.8,
    bevAffinity: 0.7,
  },
  'Payment Buyer': {
    closeRateMultiplier: 0.9,
    grossMultiplier: 0.7,
    csiExpectation: 0.9,
    bevAffinity: 1.0,
  },
  'Luxury Shopper': {
    closeRateMultiplier: 0.8,
    grossMultiplier: 1.3,
    csiExpectation: 1.5,
    bevAffinity: 1.2,
  },
  'Internet Shopper': {
    closeRateMultiplier: 0.85,
    grossMultiplier: 0.75,
    csiExpectation: 1.0,
    bevAffinity: 1.1,
  },
  Loyalist: {
    closeRateMultiplier: 1.4,
    grossMultiplier: 1.1,
    csiExpectation: 1.2,
    bevAffinity: 1.0,
  },
  Grinder: {
    closeRateMultiplier: 0.7,
    grossMultiplier: 0.6,
    csiExpectation: 0.7,
    bevAffinity: 0.9,
  },
  'Urgent Buyer': {
    closeRateMultiplier: 1.5,
    grossMultiplier: 1.2,
    csiExpectation: 0.9,
    bevAffinity: 1.0,
  },
  'Fleet Buyer': {
    closeRateMultiplier: 1.2,
    grossMultiplier: 0.5,
    csiExpectation: 0.8,
    bevAffinity: 0.8,
  },
  'EV Curious': {
    closeRateMultiplier: 1.0,
    grossMultiplier: 1.0,
    csiExpectation: 1.1,
    bevAffinity: 2.0,
  },
  'Service-to-Sales': {
    closeRateMultiplier: 1.3,
    grossMultiplier: 1.0,
    csiExpectation: 1.3,
    bevAffinity: 1.0,
  },
};

export function getAdvisorMultipliers(advisor: SalesAdvisor) {
  return ADVISOR_ARCHETYPES[advisor.archetype];
}

export function getTechMultipliers(tech: Technician) {
  return TECH_ARCHETYPES[tech.archetype];
}

export function getCustomerMultipliers(customer: Customer) {
  return CUSTOMER_ARCHETYPES[customer.type];
}
