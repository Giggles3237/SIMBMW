import { Router } from 'express';
import { gameRepository } from '../core/repository/repository';
import { tick } from '../core/engine/loop';
import { TickRequest, PauseRequest, SpeedRequest } from '@dealership-sim/shared';

const router = Router();

// POST /api/tick - Advance the game by N days
router.post('/tick', (req, res) => {
  try {
    const { days = 1 }: TickRequest = req.body;
    const state = gameRepository.getState();

    if (state.paused) {
      return res.status(400).json({ error: 'Game is paused' });
    }

    const { state: newState, events } = tick(state, days);
    gameRepository.setState(newState);

    res.json({
      success: true,
      events,
      day: newState.day,
      month: newState.month,
      year: newState.year,
      cash: newState.cash,
    });
  } catch (error) {
    console.error('Error processing tick:', error);
    res.status(500).json({ error: 'Failed to process tick' });
  }
});

// POST /api/pause - Pause or unpause the game
router.post('/pause', (req, res) => {
  try {
    const { paused }: PauseRequest = req.body;
    const state = gameRepository.getState();

    gameRepository.updateState({ paused });

    res.json({
      success: true,
      paused,
    });
  } catch (error) {
    console.error('Error pausing game:', error);
    res.status(500).json({ error: 'Failed to pause game' });
  }
});

// POST /api/speed - Change game speed
router.post('/speed', (req, res) => {
  try {
    const { multiplier }: SpeedRequest = req.body;

    if (![1, 5, 30].includes(multiplier)) {
      return res.status(400).json({ error: 'Invalid speed multiplier' });
    }

    gameRepository.updateState({ speed: multiplier });

    res.json({
      success: true,
      speed: multiplier,
    });
  } catch (error) {
    console.error('Error changing speed:', error);
    res.status(500).json({ error: 'Failed to change speed' });
  }
});

// POST /api/save - Save game state to file
router.post('/save', (req, res) => {
  try {
    gameRepository.save();
    res.json({ success: true, message: 'Game saved successfully' });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// POST /api/load - Load game state from file
router.post('/load', (req, res) => {
  try {
    gameRepository.load();
    const state = gameRepository.getState();
    res.json({
      success: true,
      message: 'Game loaded successfully',
      day: state.day,
      month: state.month,
      year: state.year,
    });
  } catch (error) {
    console.error('Error loading game:', error);
    res.status(500).json({ error: 'Failed to load game' });
  }
});

export default router;
