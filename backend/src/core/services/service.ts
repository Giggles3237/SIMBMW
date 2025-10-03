import { GameState, RO, Technician } from '@dealership-sim/shared';
import { generateId, randomInt, randomFloat, randomBool, randomChoice } from '../../utils/random';
import { formatDate } from '../../utils/date';
import { getTechMultipliers } from '../balance/archetypes';

export function generateServiceDemand(state: GameState): number {
  const { baseDemand } = state.coefficients.service;
  const { season, demandIndex } = state.economy;

  // Seasonal adjustments
  const seasonalMultiplier = season === 'winter' ? 1.2 : season === 'summer' ? 0.9 : 1.0;

  return Math.round(baseDemand * demandIndex * seasonalMultiplier);
}

export function processService(state: GameState): {
  ros: RO[];
  revenue: number;
} {
  const date = formatDate(state.year, state.month, state.day);
  const demand = generateServiceDemand(state);
  const availableTechs = state.techs.filter((t) => t.active);

  if (availableTechs.length === 0) {
    return { ros: [], revenue: 0 };
  }

  const ros: RO[] = [];
  let totalRevenue = 0;

  for (let i = 0; i < demand; i++) {
    const tech = randomChoice(availableTechs);
    const techMult = getTechMultipliers(tech);

    // Base labor hours for this RO
    const baseLaborHours = randomFloat(1, 6);
    const actualLaborHours = baseLaborHours * tech.efficiency * techMult.efficiencyMultiplier;

    // Parts revenue
    const partsRevenue =
      actualLaborHours * 100 * state.coefficients.service.partsToLaborRatio;

    // Labor revenue (assuming $100/hour)
    const laborRevenue = actualLaborHours * 100;

    // Comeback probability
    const comebackProb = tech.comebackRate + techMult.comebackRateModifier;
    const isComeback = randomBool(Math.max(0, Math.min(0.3, comebackProb)));

    // CSI impact
    const csiImpact = isComeback ? -10 : randomInt(5, 15);

    const ro: RO = {
      id: generateId('ro'),
      techId: tech.id,
      date,
      laborHours: Math.round(actualLaborHours * 10) / 10,
      partsRevenue: Math.round(partsRevenue),
      comeback: isComeback,
      csiImpact,
    };

    ros.push(ro);
    totalRevenue += laborRevenue + partsRevenue;
  }

  return { ros, revenue: Math.round(totalRevenue) };
}
