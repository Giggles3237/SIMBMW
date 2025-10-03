import { Router } from 'express';
import { gameRepository } from '../core/repository/repository';

const router = Router();

// GET /api/reports/daily - Get daily reports
router.get('/daily', (req, res) => {
  try {
    const state = gameRepository.getState();
    const { days = 30 } = req.query;
    const numDays = Math.min(parseInt(days as string) || 30, 90);

    const reports = state.dailyReports.slice(-numDays);

    res.json({
      reports,
      count: reports.length,
    });
  } catch (error) {
    console.error('Error getting daily reports:', error);
    res.status(500).json({ error: 'Failed to get daily reports' });
  }
});

// GET /api/reports/monthly - Get monthly reports
router.get('/monthly', (req, res) => {
  try {
    const state = gameRepository.getState();
    const { month } = req.query;

    if (month) {
      const report = state.monthlyReports.find((r) => r.month === month);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      return res.json({ report });
    }

    res.json({
      reports: state.monthlyReports,
      count: state.monthlyReports.length,
    });
  } catch (error) {
    console.error('Error getting monthly reports:', error);
    res.status(500).json({ error: 'Failed to get monthly reports' });
  }
});

export default router;
