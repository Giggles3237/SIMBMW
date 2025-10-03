import { GameState, Lead } from '@dealership-sim/shared';
import { generateId } from '../../utils/random';
import { formatDate } from '../../utils/date';
import { createCustomer } from './initialization';

export function generateLeads(state: GameState): Lead[] {
  const { economy, marketing, coefficients, day, month, year } = state;
  const { basePerDay, marketingK, diminishingK } = coefficients.lead;

  // Lead generation formula with diminishing returns
  const marketingEffect = marketingK * Math.log(1 + marketing.spendPerDay * diminishingK);
  const leadsCount = Math.round(
    basePerDay * economy.demandIndex * (1 + marketingEffect) * economy.weatherFactor
  );

  const newLeads: Lead[] = [];
  const date = formatDate(year, month, day);

  for (let i = 0; i < leadsCount; i++) {
    const customer = createCustomer();
    newLeads.push({
      id: generateId('lead'),
      customerId: customer.id,
      date,
      status: 'new',
    });
  }

  return newLeads;
}
