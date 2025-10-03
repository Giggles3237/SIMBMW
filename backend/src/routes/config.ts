import { Router } from 'express';
import { gameRepository } from '../core/repository/repository';
import { getCoefficients, setCoefficients, healthCheck } from '../core/balance/coefficients';
import { ConfigUpdateRequest } from '@dealership-sim/shared';
import { PRESET_COEFFICIENTS } from '@dealership-sim/shared';

const router = Router();

// GET /api/config - Get current coefficients
router.get('/', (req, res) => {
  try {
    const state = gameRepository.getState();
    const health = healthCheck();

    res.json({
      coefficients: state.coefficients,
      health,
      presets: Object.keys(PRESET_COEFFICIENTS),
    });
  } catch (error) {
    console.error('Error getting config:', error);
    res.status(500).json({ error: 'Failed to get config' });
  }
});

// PUT /api/config - Update coefficients
router.put('/', (req, res) => {
  try {
    const { coefficients }: ConfigUpdateRequest = req.body;

    if (!coefficients) {
      return res.status(400).json({ error: 'No coefficients provided' });
    }

    const state = gameRepository.getState();
    const updatedCoefficients = {
      ...state.coefficients,
      ...coefficients,
      lead: { ...state.coefficients.lead, ...coefficients.lead },
      sales: { ...state.coefficients.sales, ...coefficients.sales },
      pricing: { ...state.coefficients.pricing, ...coefficients.pricing },
      inventory: { ...state.coefficients.inventory, ...coefficients.inventory },
      economy: { ...state.coefficients.economy, ...coefficients.economy },
      service: { ...state.coefficients.service, ...coefficients.service },
      finance: { ...state.coefficients.finance, ...coefficients.finance },
      morale: { ...state.coefficients.morale, ...coefficients.morale },
    };

    gameRepository.updateState({ coefficients: updatedCoefficients });
    setCoefficients(coefficients);

    const health = healthCheck();

    res.json({
      success: true,
      coefficients: updatedCoefficients,
      health,
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// POST /api/config/preset - Load a preset configuration
router.post('/preset', (req, res) => {
  try {
    const { preset } = req.body;

    if (!preset || !PRESET_COEFFICIENTS[preset as keyof typeof PRESET_COEFFICIENTS]) {
      return res.status(400).json({
        error: 'Invalid preset',
        available: Object.keys(PRESET_COEFFICIENTS),
      });
    }

    const presetCoefficients = PRESET_COEFFICIENTS[preset as keyof typeof PRESET_COEFFICIENTS];
    gameRepository.updateState({ coefficients: presetCoefficients });
    setCoefficients(presetCoefficients);

    const health = healthCheck();

    res.json({
      success: true,
      preset,
      coefficients: presetCoefficients,
      health,
    });
  } catch (error) {
    console.error('Error loading preset:', error);
    res.status(500).json({ error: 'Failed to load preset' });
  }
});

export default router;
