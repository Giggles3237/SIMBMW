import {
  GameState,
  Deal,
  Lead,
  Vehicle,
  SalesAdvisor,
  Customer,
  Appointment,
} from '@dealership-sim/shared';
import { generateId, randomFloat, randomBool, sigmoid, clamp } from '../../utils/random';
import { formatDate } from '../../utils/date';
import { getAdvisorMultipliers, getCustomerMultipliers } from '../balance/archetypes';
import { createCustomer } from './initialization';

function calculateCloseRate(
  advisor: SalesAdvisor,
  customer: Customer,
  vehicle: Vehicle,
  state: GameState
): number {
  const { sales } = state.coefficients;
  const advisorMult = getAdvisorMultipliers(advisor);
  const customerMult = getCustomerMultipliers(customer);

  // Normalize desirability to -1 to 1
  const desirabilityZ = (vehicle.desirability - 50) / 50;

  // Price fit: how close asking is to expected value
  const expectedPrice = vehicle.cost * 1.2;
  const priceFit = 1 - Math.abs(vehicle.asking - expectedPrice) / expectedPrice;

  // Economy factor
  const economyFactor = (state.economy.demandIndex - 1) * 0.5;

  // Morale effect
  const moraleEffect = advisor.morale < 50 ? -0.2 : 0;

  // Calculate close probability using sigmoid
  const rawScore =
    sales.baseClose +
    sales.desirabilityWeight * desirabilityZ +
    sales.priceGapWeight * priceFit +
    sales.archetypeWeight * (advisorMult.closeMultiplier - 1) +
    sales.economyWeight * economyFactor +
    moraleEffect;

  const baseProb = sigmoid(rawScore * 5 - 2.5); // Scale and shift for better distribution
  const finalProb = baseProb * customerMult.closeRateMultiplier;

  return clamp(finalProb, 0, 1);
}

function calculateDeal(
  advisor: SalesAdvisor,
  customer: Customer,
  vehicle: Vehicle,
  state: GameState,
  date: string
): Deal {
  const { pricing, finance } = state.coefficients;
  const advisorMult = getAdvisorMultipliers(advisor);
  const customerMult = getCustomerMultipliers(customer);

  // Calculate sold price with variance
  const priceVariance = randomFloat(-pricing.variancePct, pricing.variancePct);
  const incentiveDiscount = state.economy.incentiveLevel * 1000;
  const desirabilityDiscount = vehicle.desirability < 50 ? (50 - vehicle.desirability) * 20 : 0;

  const soldPrice = Math.max(
    vehicle.cost * 1.05,
    vehicle.asking * (1 + priceVariance) - incentiveDiscount - desirabilityDiscount
  );

  // Calculate front gross
  const holdback = soldPrice * vehicle.holdbackPct;
  const frontGross =
    soldPrice - vehicle.cost - vehicle.reconCost - vehicle.pack + holdback;

  // Calculate back gross (F&I)
  const backGrossBase = randomBool(finance.backGrossProb) ? finance.avgBackGross : 0;
  const backGross = backGrossBase * advisorMult.grossMultiplier;

  // Total gross adjusted by customer type
  const totalGross = (frontGross + backGross) * customerMult.grossMultiplier;

  // CSI impact
  const csiImpact =
    (advisor.skill.csi * advisorMult.csiMultiplier * customerMult.csiExpectation * 100) / 3;

  return {
    id: generateId('deal'),
    vehicleId: vehicle.id,
    advisorId: advisor.id,
    customerId: customer.id,
    date,
    frontGross: Math.round(frontGross),
    backGross: Math.round(backGross),
    totalGross: Math.round(totalGross),
    csiImpact: Math.round(csiImpact),
    soldPrice: Math.round(soldPrice),
  };
}

export function processSales(state: GameState): {
  deals: Deal[];
  updatedVehicles: Vehicle[];
  updatedLeads: Lead[];
  appointments: Appointment[];
} {
  const date = formatDate(state.year, state.month, state.day);
  const deals: Deal[] = [];
  const updatedVehicles = [...state.inventory];
  const updatedLeads = [...state.leads];
  const appointments: Appointment[] = [];

  // Get available advisors and vehicles
  const availableAdvisors = state.advisors.filter((a) => a.active);
  const availableVehicles = updatedVehicles.filter((v) => v.status === 'inStock');

  if (availableAdvisors.length === 0 || availableVehicles.length === 0) {
    return { deals, updatedVehicles, updatedLeads, appointments };
  }

  // Process leads
  const newLeads = updatedLeads.filter((l) => l.status === 'new');

  for (const lead of newLeads) {
    // Assign to random available advisor
    const advisor = availableAdvisors[Math.floor(Math.random() * availableAdvisors.length)];

    // Create customer
    const customer = createCustomer();

    // Select vehicle based on desirability
    const sortedVehicles = availableVehicles
      .filter((v) => v.status === 'inStock')
      .sort((a, b) => b.desirability - a.desirability);

    if (sortedVehicles.length === 0) break;

    // Pick from top desirable vehicles
    const vehicleIndex = Math.floor(Math.random() * Math.min(5, sortedVehicles.length));
    const vehicle = sortedVehicles[vehicleIndex];

    // Calculate close rate
    const closeRate = calculateCloseRate(advisor, customer, vehicle, state);

    // Attempt to close
    if (randomBool(closeRate)) {
      const deal = calculateDeal(advisor, customer, vehicle, state, date);
      deals.push(deal);

      // Mark vehicle as pending
      const vehicleIdx = updatedVehicles.findIndex((v) => v.id === vehicle.id);
      if (vehicleIdx !== -1) {
        updatedVehicles[vehicleIdx] = { ...vehicle, status: 'pending' };
      }

      // Mark lead as closed
      const leadIdx = updatedLeads.findIndex((l) => l.id === lead.id);
      if (leadIdx !== -1) {
        updatedLeads[leadIdx] = { ...lead, status: 'closed' };
      }
    } else {
      // Create appointment for follow-up
      appointments.push({
        id: generateId('appt'),
        leadId: lead.id,
        advisorId: advisor.id,
        vehicleId: vehicle.id,
        date,
        status: 'scheduled',
      });
    }
  }

  return { deals, updatedVehicles, updatedLeads, appointments };
}
