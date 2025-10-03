import { Router } from 'express';
import { gameRepository } from '../core/repository/repository';
import { StateDTO } from '@dealership-sim/shared';
import { formatMonth } from '../utils/date';

const router = Router();

// GET /api/state - Get current game state summary
router.get('/', (req, res) => {
  try {
    const state = gameRepository.getState();

    // Calculate KPIs
    const unitsInStock = state.inventory.filter((v) => v.status === 'inStock').length;
    const unitsPending = state.inventory.filter((v) => v.status === 'pending').length;

    const currentMonth = formatMonth(state.year, state.month);
    const dealsThisMonth = state.completedDeals.filter((d) => d.date.startsWith(currentMonth));
    const unitsSoldMTD = dealsThisMonth.length;
    const grossMTD = dealsThisMonth.reduce((sum, d) => sum + d.totalGross, 0);

    const rosThisMonth = state.completedROs.filter((ro) => ro.date.startsWith(currentMonth));
    const serviceHoursMTD = rosThisMonth.reduce((sum, ro) => sum + ro.laborHours, 0);

    const recentReports = state.dailyReports.slice(-7);
    const csiMTD = recentReports.length > 0
      ? Math.round(recentReports.reduce((sum, r) => sum + r.csi, 0) / recentReports.length)
      : 80;

    const dto: StateDTO = {
      cash: state.cash,
      day: state.day,
      month: state.month,
      year: state.year,
      speed: state.speed,
      paused: state.paused,
      kpis: {
        unitsInStock,
        unitsPending,
        unitsSoldMTD,
        grossMTD: Math.round(grossMTD),
        serviceHoursMTD: Math.round(serviceHoursMTD),
        csiMTD,
      },
      recentDeals: state.completedDeals.slice(-10),
      recentROs: state.completedROs.slice(-10),
      inventory: state.inventory,
      advisors: state.advisors,
      techs: state.techs,
      leads: state.leads.filter((l) => l.status === 'new'),
      appointments: state.appointments.filter((a) => a.status === 'scheduled'),
      marketing: state.marketing,
      economy: state.economy,
    };

    res.json(dto);
  } catch (error) {
    console.error('Error getting state:', error);
    res.status(500).json({ error: 'Failed to get state' });
  }
});

export default router;
