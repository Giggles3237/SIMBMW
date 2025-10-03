import { GameState, DailyReport, MonthlyReport, Deal, RO } from '@dealership-sim/shared';
import { formatDate, formatMonth } from '../../utils/date';

export function generateDailyReport(
  state: GameState,
  deals: Deal[],
  ros: RO[],
  cashDelta: number
): DailyReport {
  const date = formatDate(state.year, state.month, state.day);

  // Sales metrics
  const unitsSold = deals.length;
  const avgFrontGross = unitsSold > 0
    ? deals.reduce((sum, d) => sum + d.frontGross, 0) / unitsSold
    : 0;
  const avgBackGross = unitsSold > 0
    ? deals.reduce((sum, d) => sum + d.backGross, 0) / unitsSold
    : 0;
  const avgTotalGross = unitsSold > 0
    ? deals.reduce((sum, d) => sum + d.totalGross, 0) / unitsSold
    : 0;

  // Calculate closing percentage
  const totalLeads = state.leads.filter((l) => l.date === date).length;
  const closingPct = totalLeads > 0 ? unitsSold / totalLeads : 0;

  // Inventory metrics
  const inStock = state.inventory.filter((v) => v.status === 'inStock').length;
  const aged60Plus = state.inventory.filter(
    (v) => v.status === 'inStock' && v.ageDays >= 60
  ).length;
  const aged90Plus = state.inventory.filter(
    (v) => v.status === 'inStock' && v.ageDays >= 90
  ).length;

  const avgAge = state.inventory
    .filter((v) => v.status === 'inStock')
    .reduce((sum, v) => sum + v.ageDays, 0) / Math.max(1, inStock);
  const avgDaysSupply = avgAge / 3; // Simplified

  // Service metrics
  const laborHours = ros.reduce((sum, ro) => sum + ro.laborHours, 0);
  const partsRevenue = ros.reduce((sum, ro) => sum + ro.partsRevenue, 0);
  const comebacks = ros.filter((ro) => ro.comeback).length;
  const comebackPct = ros.length > 0 ? comebacks / ros.length : 0;

  // Financial metrics
  const advertisingROI = state.marketing.spendPerDay > 0
    ? (avgTotalGross * unitsSold) / state.marketing.spendPerDay
    : 0;
  const fixedCoverage = 1.0; // Simplified

  // HR metrics
  const avgMorale =
    [...state.advisors, ...state.techs].reduce((sum, s) => sum + s.morale, 0) /
    (state.advisors.length + state.techs.length);
  const trainingCompletions = 0; // Simplified

  // CSI
  const csiFromDeals = deals.reduce((sum, d) => sum + d.csiImpact, 0);
  const csiFromService = ros.reduce((sum, ro) => sum + ro.csiImpact, 0);
  const csi = Math.round(
    ((csiFromDeals + csiFromService) / Math.max(1, deals.length + ros.length)) * 0.8 + 75
  );

  return {
    date,
    sales: {
      unitsSold,
      avgFrontGross: Math.round(avgFrontGross),
      avgBackGross: Math.round(avgBackGross),
      avgTotalGross: Math.round(avgTotalGross),
      closingPct: Math.round(closingPct * 100) / 100,
    },
    inventory: {
      startStock: inStock,
      endStock: inStock,
      avgDaysSupply: Math.round(avgDaysSupply),
      aged60Plus,
      aged90Plus,
    },
    service: {
      laborHours: Math.round(laborHours * 10) / 10,
      partsRevenue: Math.round(partsRevenue),
      comebackPct: Math.round(comebackPct * 100) / 100,
    },
    financials: {
      cashDelta: Math.round(cashDelta),
      advertisingROI: Math.round(advertisingROI * 10) / 10,
      fixedCoverage: Math.round(fixedCoverage * 100) / 100,
    },
    hr: {
      avgMorale: Math.round(avgMorale),
      trainingCompletions,
    },
    csi: Math.min(100, Math.max(0, csi)),
  };
}

export function generateMonthlyReport(state: GameState): MonthlyReport | null {
  const currentMonth = formatMonth(state.year, state.month);
  const dailyReportsThisMonth = state.dailyReports.filter((r) =>
    r.date.startsWith(currentMonth)
  );

  if (dailyReportsThisMonth.length === 0) {
    return null;
  }

  // Aggregate daily reports
  const totalUnitsSold = dailyReportsThisMonth.reduce((sum, r) => sum + r.sales.unitsSold, 0);
  const avgFrontGross = totalUnitsSold > 0
    ? dailyReportsThisMonth.reduce((sum, r) => sum + r.sales.avgFrontGross * r.sales.unitsSold, 0) / totalUnitsSold
    : 0;
  const avgBackGross = totalUnitsSold > 0
    ? dailyReportsThisMonth.reduce((sum, r) => sum + r.sales.avgBackGross * r.sales.unitsSold, 0) / totalUnitsSold
    : 0;
  const avgTotalGross = totalUnitsSold > 0
    ? dailyReportsThisMonth.reduce((sum, r) => sum + r.sales.avgTotalGross * r.sales.unitsSold, 0) / totalUnitsSold
    : 0;

  const avgClosingPct =
    dailyReportsThisMonth.reduce((sum, r) => sum + r.sales.closingPct, 0) /
    dailyReportsThisMonth.length;

  const lastReport = dailyReportsThisMonth[dailyReportsThisMonth.length - 1];

  return {
    month: currentMonth,
    date: currentMonth,
    sales: {
      unitsSold: totalUnitsSold,
      avgFrontGross: Math.round(avgFrontGross),
      avgBackGross: Math.round(avgBackGross),
      avgTotalGross: Math.round(avgTotalGross),
      closingPct: Math.round(avgClosingPct * 100) / 100,
    },
    inventory: lastReport.inventory,
    service: {
      laborHours: dailyReportsThisMonth.reduce((sum, r) => sum + r.service.laborHours, 0),
      partsRevenue: dailyReportsThisMonth.reduce((sum, r) => sum + r.service.partsRevenue, 0),
      comebackPct:
        dailyReportsThisMonth.reduce((sum, r) => sum + r.service.comebackPct, 0) /
        dailyReportsThisMonth.length,
    },
    financials: {
      cashDelta: dailyReportsThisMonth.reduce((sum, r) => sum + r.financials.cashDelta, 0),
      advertisingROI:
        dailyReportsThisMonth.reduce((sum, r) => sum + r.financials.advertisingROI, 0) /
        dailyReportsThisMonth.length,
      fixedCoverage:
        dailyReportsThisMonth.reduce((sum, r) => sum + r.financials.fixedCoverage, 0) /
        dailyReportsThisMonth.length,
    },
    hr: lastReport.hr,
    csi: Math.round(
      dailyReportsThisMonth.reduce((sum, r) => sum + r.csi, 0) / dailyReportsThisMonth.length
    ),
  };
}
