import { Router } from 'express';
import { gameRepository } from '../core/repository/repository';
import { MarketingSpendRequest } from '@dealership-sim/shared';

const router = Router();

// POST /api/marketing/spend - Update marketing spend
router.post('/spend', (req, res) => {
  try {
    const { perDay }: MarketingSpendRequest = req.body;

    if (perDay < 0 || perDay > 50000) {
      return res.status(400).json({ error: 'Invalid spend amount (0-50000)' });
    }

    const state = gameRepository.getState();

    // Calculate lead multiplier based on spend
    const { marketingK, diminishingK } = state.coefficients.lead;
    const leadMultiplier = 1 + marketingK * Math.log(1 + perDay * diminishingK);

    gameRepository.updateState({
      marketing: {
        spendPerDay: perDay,
        leadMultiplier,
      },
    });

    res.json({
      success: true,
      spendPerDay: perDay,
      leadMultiplier: Math.round(leadMultiplier * 100) / 100,
    });
  } catch (error) {
    console.error('Error updating marketing spend:', error);
    res.status(500).json({ error: 'Failed to update marketing spend' });
  }
});

export default router;
