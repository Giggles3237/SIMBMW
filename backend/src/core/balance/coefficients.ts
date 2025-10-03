import { Coefficients, HealthCheckResult } from '@dealership-sim/shared';
import { DEFAULT_COEFFICIENTS } from '@dealership-sim/shared';

let currentCoefficients: Coefficients = { ...DEFAULT_COEFFICIENTS };

export function getCoefficients(): Coefficients {
  return { ...currentCoefficients };
}

export function setCoefficients(newCoefficients: Partial<Coefficients>): void {
  currentCoefficients = {
    ...currentCoefficients,
    ...newCoefficients,
    lead: { ...currentCoefficients.lead, ...newCoefficients.lead },
    sales: { ...currentCoefficients.sales, ...newCoefficients.sales },
    pricing: { ...currentCoefficients.pricing, ...newCoefficients.pricing },
    inventory: { ...currentCoefficients.inventory, ...newCoefficients.inventory },
    economy: { ...currentCoefficients.economy, ...newCoefficients.economy },
    service: { ...currentCoefficients.service, ...newCoefficients.service },
    finance: { ...currentCoefficients.finance, ...newCoefficients.finance },
    morale: { ...currentCoefficients.morale, ...newCoefficients.morale },
  };
}

export function resetCoefficients(): void {
  currentCoefficients = { ...DEFAULT_COEFFICIENTS };
}

export function healthCheck(): HealthCheckResult {
  const warnings: string[] = [];
  const coeff = currentCoefficients;

  // Check if expected gross can cover restock costs
  const avgVehicleCost = 35000; // Approximate average
  const avgAskingPrice = avgVehicleCost / coeff.inventory.auctionCostSpread;
  const avgRecon = coeff.pricing.reconMean;
  const avgPack = coeff.pricing.pack;
  const avgHoldback = avgAskingPrice * coeff.pricing.holdbackPct;

  // Expected front gross (simplified)
  const expectedFrontGross = avgAskingPrice * 0.95 - avgVehicleCost - avgRecon - avgPack + avgHoldback;
  
  // Expected back gross
  const expectedBackGross = coeff.finance.avgBackGross * coeff.finance.backGrossProb;
  
  // Total expected gross
  const expectedTotalGross = expectedFrontGross + expectedBackGross;
  
  // Target gross to replace (need to buy another vehicle)
  const targetGrossToReplace = avgVehicleCost * 1.1; // 10% buffer

  if (expectedTotalGross < targetGrossToReplace) {
    warnings.push(
      `Expected gross ($${expectedTotalGross.toFixed(0)}) may not cover restock costs ($${targetGrossToReplace.toFixed(0)}). Risk of inventory starvation.`
    );
  }

  // Check lead generation
  const expectedLeadsPerDay = coeff.lead.basePerDay;
  if (expectedLeadsPerDay < 5) {
    warnings.push('Lead generation is very low. Consider increasing basePerDay or marketing spend.');
  }

  // Check close rate
  if (coeff.sales.baseClose < 0.15) {
    warnings.push('Base close rate is very low. Sales may be difficult.');
  }

  // Check days supply
  if (coeff.inventory.minDaysSupply < 15) {
    warnings.push('Minimum days supply is low. Frequent restocking may be needed.');
  }

  // Check morale penalty
  if (coeff.morale.lowMoralePenalty > 0.5) {
    warnings.push('Low morale penalty is severe. Staff management will be critical.');
  }

  return {
    healthy: warnings.length === 0,
    warnings,
  };
}
