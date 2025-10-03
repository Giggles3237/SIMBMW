import { GameState, Vehicle, VehicleSegment, VehicleCondition } from '@dealership-sim/shared';
import { generateId, randomInt, randomFloat, randomChoice } from '../../utils/random';
import { VEHICLE_MAKES, VEHICLE_MODELS } from '@dealership-sim/shared';

export function ageInventory(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.map((vehicle) => {
    if (vehicle.status === 'inStock') {
      const ageDays = vehicle.ageDays + 1;
      
      // Apply depreciation based on age
      let depreciationRate = 0.001; // 0.1% per day base
      if (ageDays > 60) depreciationRate = 0.002;
      if (ageDays > 90) depreciationRate = 0.003;
      
      // Undesirable cars depreciate faster
      if (vehicle.desirability < 50) {
        depreciationRate *= 1.5;
      }

      const newAsking = Math.max(
        vehicle.cost * 1.05,
        vehicle.asking * (1 - depreciationRate)
      );

      return {
        ...vehicle,
        ageDays,
        asking: newAsking,
      };
    }
    return vehicle;
  });
}

export function calculateDaysSupply(state: GameState): number {
  const inStockCount = state.inventory.filter((v) => v.status === 'inStock').length;
  
  // Calculate average daily sales from recent history
  const recentDeals = state.dailyReports.slice(-7);
  const avgDailySales = recentDeals.length > 0
    ? recentDeals.reduce((sum, r) => sum + r.sales.unitsSold, 0) / recentDeals.length
    : 3;

  return avgDailySales > 0 ? inStockCount / avgDailySales : inStockCount / 3;
}

function createAcquiredVehicle(
  pack: 'desirable' | 'neutral' | 'undesirable',
  index: number,
  auctionCostSpread: number
): Vehicle {
  const make = randomChoice(VEHICLE_MAKES);
  const models = VEHICLE_MODELS[make as keyof typeof VEHICLE_MODELS];
  const model = randomChoice(models);
  const year = randomInt(2020, 2024);
  const isNew = year >= 2024;
  const isBEV = model.includes('i4') || model.includes('iX') || model.includes('SE');

  const segments: VehicleSegment[] = ['sedan', 'suv', 'coupe', 'convertible', 'electric'];
  const segment = isBEV ? 'electric' : randomChoice(segments.filter((s) => s !== 'electric'));

  let desirability: number;
  let costMultiplier: number;

  switch (pack) {
    case 'desirable':
      desirability = randomInt(70, 95);
      costMultiplier = auctionCostSpread * 1.1; // Pay more for desirable
      break;
    case 'neutral':
      desirability = randomInt(50, 70);
      costMultiplier = auctionCostSpread;
      break;
    case 'undesirable':
      desirability = randomInt(20, 50);
      costMultiplier = auctionCostSpread * 0.85; // Pay less for undesirable
      break;
  }

  const baseCost = randomInt(25000, 60000);
  const cost = Math.round(baseCost * costMultiplier);
  const asking = cost * randomFloat(1.15, 1.35);
  const reconCost = isNew ? 0 : randomInt(500, 2500);

  const conditions: VehicleCondition[] = isNew ? ['new'] : ['used', 'cpo'];
  const condition = isBEV ? 'bev' : randomChoice(conditions);

  return {
    id: generateId('veh'),
    stockNumber: `ACQ${Date.now()}-${index}`,
    year,
    make,
    model,
    segment,
    cost,
    floor: cost * 1.02,
    asking,
    ageDays: 0,
    desirability,
    condition,
    reconCost,
    holdbackPct: 0.03,
    pack: 500,
    status: 'inStock',
  };
}

export function acquireInventory(
  state: GameState,
  pack: 'desirable' | 'neutral' | 'undesirable',
  qty: number
): { vehicles: Vehicle[]; cost: number } {
  const newVehicles: Vehicle[] = [];
  let totalCost = 0;

  for (let i = 0; i < qty; i++) {
    const vehicle = createAcquiredVehicle(pack, i, state.coefficients.inventory.auctionCostSpread);
    newVehicles.push(vehicle);
    totalCost += vehicle.cost + vehicle.reconCost;
  }

  return { vehicles: newVehicles, cost: totalCost };
}

export function autoRestockIfNeeded(state: GameState): {
  vehicles: Vehicle[];
  cost: number;
  restocked: boolean;
} {
  const daysSupply = calculateDaysSupply(state);
  const { minDaysSupply, bulkBuyUnits } = state.coefficients.inventory;

  if (daysSupply < minDaysSupply) {
    const { vehicles, cost } = acquireInventory(state, 'neutral', bulkBuyUnits);
    
    if (cost <= state.cash) {
      return { vehicles, cost, restocked: true };
    }
  }

  return { vehicles: [], cost: 0, restocked: false };
}
