import { GameState, EconomyState } from '@dealership-sim/shared';
import { randomFloat, randomBool, clamp } from '../../utils/random';
import { MONTH_TO_SEASON } from '@dealership-sim/shared';

export function updateEconomy(state: GameState): {
  economy: EconomyState;
  events: string[];
} {
  const { volatility, incentiveImpact, interestRateBand } = state.coefficients.economy;
  const events: string[] = [];

  let { demandIndex, interestRate, incentiveLevel, weatherFactor } = state.economy;

  // Update season
  const season = MONTH_TO_SEASON(state.month);

  // Random demand fluctuation
  const demandChange = randomFloat(-volatility, volatility);
  demandIndex = clamp(demandIndex + demandChange, 0.5, 2.0);

  // Interest rate drift
  const rateChange = randomFloat(-interestRateBand * 0.1, interestRateBand * 0.1);
  interestRate = clamp(interestRate + rateChange, 2.0, 10.0);

  // Random events
  if (randomBool(0.05)) {
    // Factory incentive change
    const incentiveChange = randomFloat(-0.2, 0.3);
    incentiveLevel = clamp(incentiveLevel + incentiveChange, 0, 1);
    if (incentiveChange > 0) {
      events.push(`Factory incentive increased! Demand up ${Math.round(incentiveImpact * 100)}%`);
      demandIndex = clamp(demandIndex + incentiveImpact, 0.5, 2.0);
    } else {
      events.push('Factory incentive reduced. Demand may soften.');
      demandIndex = clamp(demandIndex - incentiveImpact * 0.5, 0.5, 2.0);
    }
  }

  if (randomBool(0.03)) {
    // Weather event
    const weatherChange = randomFloat(-0.3, 0.2);
    weatherFactor = clamp(weatherFactor + weatherChange, 0.5, 1.0);
    if (weatherChange < -0.2) {
      events.push('Severe weather impacting foot traffic!');
    }
  }

  if (randomBool(0.02)) {
    // Economic news
    const economicShock = randomFloat(-0.15, 0.15);
    demandIndex = clamp(demandIndex + economicShock, 0.5, 2.0);
    if (economicShock > 0.1) {
      events.push('Positive economic news boosts consumer confidence!');
    } else if (economicShock < -0.1) {
      events.push('Economic uncertainty dampens demand.');
    }
  }

  if (randomBool(0.01)) {
    // Fleet deal opportunity
    events.push('Fleet buyer inquiry received! Check leads.');
  }

  return {
    economy: {
      demandIndex,
      interestRate,
      incentiveLevel,
      weatherFactor,
      season,
    },
    events,
  };
}
