import { tick } from '../core/engine/loop';
import { initializeGameState } from '../core/services/initialization';
import { healthCheck } from '../core/balance/coefficients';

describe('Game Engine', () => {
  test('tick advances game state by one day', () => {
    const initialState = initializeGameState();
    const { state } = tick(initialState, 1);

    expect(state.day).toBe(initialState.day + 1);
  });

  test('tick processes multiple days', () => {
    const initialState = initializeGameState();
    const { state } = tick(initialState, 5);

    expect(state.day).toBe(initialState.day + 5);
  });

  test('inventory ages each day', () => {
    const initialState = initializeGameState();
    const initialAge = initialState.inventory[0].ageDays;
    
    const { state } = tick(initialState, 1);
    const newAge = state.inventory[0].ageDays;

    expect(newAge).toBe(initialAge + 1);
  });

  test('cash changes based on operations', () => {
    const initialState = initializeGameState();
    const initialCash = initialState.cash;
    
    const { state } = tick(initialState, 1);

    expect(state.cash).not.toBe(initialCash);
  });
});

describe('Health Check', () => {
  test('health check runs without errors', () => {
    const result = healthCheck();

    expect(result).toHaveProperty('healthy');
    expect(result).toHaveProperty('warnings');
    expect(Array.isArray(result.warnings)).toBe(true);
  });
});

describe('Initialization', () => {
  test('initializes game state with correct structure', () => {
    const state = initializeGameState();

    expect(state).toHaveProperty('cash');
    expect(state).toHaveProperty('inventory');
    expect(state).toHaveProperty('advisors');
    expect(state).toHaveProperty('techs');
    expect(state).toHaveProperty('day');
    expect(state).toHaveProperty('month');
    expect(state).toHaveProperty('year');
    expect(state.inventory.length).toBeGreaterThan(0);
    expect(state.advisors.length).toBeGreaterThan(0);
    expect(state.techs.length).toBeGreaterThan(0);
  });
});
