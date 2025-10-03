import { GameState } from '@dealership-sim/shared';
import { advanceDate, isNewMonth } from '../../utils/date';
import { generateLeads } from '../services/leads';
import { processSales } from '../services/sales';
import { ageInventory, autoRestockIfNeeded } from '../services/inventory';
import { processService } from '../services/service';
import { updateEconomy } from '../services/economy';
import { generateDailyReport, generateMonthlyReport } from '../services/reporting';

export interface TickResult {
  state: GameState;
  events: string[];
}

export function tick(state: GameState, days: number = 1): TickResult {
  let currentState = { ...state };
  const allEvents: string[] = [];

  for (let i = 0; i < days; i++) {
    const events: string[] = [];

    // 1. Update economy and handle random events
    const { economy, events: economyEvents } = updateEconomy(currentState);
    currentState.economy = economy;
    events.push(...economyEvents);

    // 2. Generate leads
    const newLeads = generateLeads(currentState);
    currentState.leads = [...currentState.leads, ...newLeads];
    if (newLeads.length > 0) {
      events.push(`Generated ${newLeads.length} new leads`);
    }

    // 3. Process sales
    const { deals, updatedVehicles, updatedLeads, appointments } = processSales(currentState);
    currentState.inventory = updatedVehicles;
    currentState.leads = updatedLeads;
    currentState.appointments = [...currentState.appointments, ...appointments];
    currentState.completedDeals = [...currentState.completedDeals, ...deals];

    // Calculate revenue from deals
    const salesRevenue = deals.reduce((sum, d) => sum + d.soldPrice, 0);
    const salesCost = deals.reduce((sum, d) => {
      const vehicle = state.inventory.find((v) => v.id === d.vehicleId);
      return sum + (vehicle ? vehicle.cost + vehicle.reconCost : 0);
    }, 0);

    if (deals.length > 0) {
      events.push(`Closed ${deals.length} deals for $${salesRevenue.toLocaleString()}`);
    }

    // 4. Age inventory
    currentState.inventory = ageInventory(currentState.inventory);

    // 5. Process service
    const { ros, revenue: serviceRevenue } = processService(currentState);
    currentState.completedROs = [...currentState.completedROs, ...ros];
    if (ros.length > 0) {
      events.push(`Completed ${ros.length} service ROs for $${serviceRevenue.toLocaleString()}`);
    }

    // 6. Update cash
    const marketingCost = currentState.marketing.spendPerDay;
    const cashDelta = salesRevenue - salesCost + serviceRevenue - marketingCost;
    currentState.cash += cashDelta;

    // 7. Auto-restock if needed
    const { vehicles: newVehicles, cost: restockCost, restocked } = autoRestockIfNeeded(currentState);
    if (restocked) {
      currentState.inventory = [...currentState.inventory, ...newVehicles];
      currentState.cash -= restockCost;
      events.push(`Auto-restocked ${newVehicles.length} vehicles for $${restockCost.toLocaleString()}`);
    }

    // 8. Generate daily report
    const dailyReport = generateDailyReport(currentState, deals, ros, cashDelta);
    currentState.dailyReports = [...currentState.dailyReports, dailyReport];

    // Keep only last 90 days of reports
    if (currentState.dailyReports.length > 90) {
      currentState.dailyReports = currentState.dailyReports.slice(-90);
    }

    // 9. Advance date
    const oldMonth = currentState.month;
    const { day, month, year } = advanceDate(
      currentState.day,
      currentState.month,
      currentState.year,
      1
    );
    currentState.day = day;
    currentState.month = month;
    currentState.year = year;

    // 10. Generate monthly report if month changed
    if (isNewMonth(oldMonth, month)) {
      const monthlyReport = generateMonthlyReport(currentState);
      if (monthlyReport) {
        currentState.monthlyReports = [...currentState.monthlyReports, monthlyReport];
        events.push(`Month ended: ${monthlyReport.sales.unitsSold} units sold, $${monthlyReport.sales.avgTotalGross.toLocaleString()} avg gross`);
      }
    }

    allEvents.push(...events);
  }

  return {
    state: currentState,
    events: allEvents,
  };
}
