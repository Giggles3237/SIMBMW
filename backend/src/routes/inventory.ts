import { Router } from 'express';
import { gameRepository } from '../core/repository/repository';
import { acquireInventory } from '../core/services/inventory';
import { AcquireInventoryRequest } from '@dealership-sim/shared';

const router = Router();

// POST /api/inventory/acquire - Acquire new inventory
router.post('/acquire', (req, res) => {
  try {
    const { pack, qty }: AcquireInventoryRequest = req.body;

    if (!['desirable', 'neutral', 'undesirable'].includes(pack)) {
      return res.status(400).json({ error: 'Invalid pack type' });
    }

    if (!qty || qty < 1 || qty > 50) {
      return res.status(400).json({ error: 'Invalid quantity (must be 1-50)' });
    }

    const state = gameRepository.getState();
    const { vehicles, cost } = acquireInventory(state, pack, qty);

    if (cost > state.cash) {
      return res.status(400).json({
        error: 'Insufficient funds',
        required: cost,
        available: state.cash,
      });
    }

    // Update state
    gameRepository.updateState({
      inventory: [...state.inventory, ...vehicles],
      cash: state.cash - cost,
    });

    res.json({
      success: true,
      acquired: vehicles.length,
      cost,
      remainingCash: state.cash - cost,
    });
  } catch (error) {
    console.error('Error acquiring inventory:', error);
    res.status(500).json({ error: 'Failed to acquire inventory' });
  }
});

export default router;
