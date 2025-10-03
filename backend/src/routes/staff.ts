import { Router } from 'express';
import { gameRepository } from '../core/repository/repository';
import {
  HireStaffRequest,
  TrainStaffRequest,
  AdvisorArchetype,
  TechArchetype,
} from '@dealership-sim/shared';
import { generateId, randomFloat, randomInt } from '../utils/random';

const router = Router();

const ADVISOR_ARCHETYPES: AdvisorArchetype[] = [
  'Closer',
  'Relationship Builder',
  'Tech Geek',
  'Grinder',
  'Charmer',
  'Rookie',
  'Process Pro',
  'High-Energy',
  'Finance Whisperer',
  'Slacker',
];

const TECH_ARCHETYPES: TechArchetype[] = [
  'Master Tech',
  'Flat-Rate Rocket',
  'Diagnostic Ace',
  'Apprentice',
  'Grumpy Veteran',
  'Hybrid/EV Specialist',
  'Warranty Wizard',
  'Detail-Oriented',
];

// POST /api/staff/hire - Hire new staff
router.post('/hire', (req, res) => {
  try {
    const { role, archetype }: HireStaffRequest = req.body;

    if (!['advisor', 'tech'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const state = gameRepository.getState();
    const hireCost = role === 'advisor' ? 5000 : 3000;

    if (state.cash < hireCost) {
      return res.status(400).json({
        error: 'Insufficient funds',
        required: hireCost,
        available: state.cash,
      });
    }

    if (role === 'advisor') {
      if (!ADVISOR_ARCHETYPES.includes(archetype as AdvisorArchetype)) {
        return res.status(400).json({ error: 'Invalid advisor archetype' });
      }

      const newAdvisor = {
        id: generateId('adv'),
        name: `New Hire ${Date.now()}`,
        archetype: archetype as AdvisorArchetype,
        skill: {
          close: randomFloat(0.5, 0.8),
          gross: randomFloat(0.5, 0.8),
          csi: randomFloat(0.5, 0.8),
          speed: randomFloat(0.5, 0.8),
        },
        morale: 80,
        trained: [],
        active: true,
      };

      gameRepository.updateState({
        advisors: [...state.advisors, newAdvisor],
        cash: state.cash - hireCost,
      });

      res.json({
        success: true,
        hired: newAdvisor,
        cost: hireCost,
      });
    } else {
      if (!TECH_ARCHETYPES.includes(archetype as TechArchetype)) {
        return res.status(400).json({ error: 'Invalid tech archetype' });
      }

      const newTech = {
        id: generateId('tech'),
        name: `New Tech ${Date.now()}`,
        archetype: archetype as TechArchetype,
        efficiency: randomFloat(0.8, 1.3),
        comebackRate: randomFloat(0.05, 0.15),
        morale: 80,
        active: true,
      };

      gameRepository.updateState({
        techs: [...state.techs, newTech],
        cash: state.cash - hireCost,
      });

      res.json({
        success: true,
        hired: newTech,
        cost: hireCost,
      });
    }
  } catch (error) {
    console.error('Error hiring staff:', error);
    res.status(500).json({ error: 'Failed to hire staff' });
  }
});

// POST /api/staff/train - Train staff member
router.post('/train', (req, res) => {
  try {
    const { id, program }: TrainStaffRequest = req.body;
    const state = gameRepository.getState();
    const trainingCost = 1000;

    if (state.cash < trainingCost) {
      return res.status(400).json({
        error: 'Insufficient funds',
        required: trainingCost,
        available: state.cash,
      });
    }

    // Find staff member
    const advisorIdx = state.advisors.findIndex((a) => a.id === id);
    if (advisorIdx !== -1) {
      const advisor = state.advisors[advisorIdx];
      const updatedAdvisor = {
        ...advisor,
        trained: [...advisor.trained, program],
        morale: Math.min(100, advisor.morale + state.coefficients.morale.trainingEffect),
      };

      const updatedAdvisors = [...state.advisors];
      updatedAdvisors[advisorIdx] = updatedAdvisor;

      gameRepository.updateState({
        advisors: updatedAdvisors,
        cash: state.cash - trainingCost,
      });

      return res.json({
        success: true,
        trained: updatedAdvisor,
        cost: trainingCost,
      });
    }

    const techIdx = state.techs.findIndex((t) => t.id === id);
    if (techIdx !== -1) {
      const tech = state.techs[techIdx];
      const updatedTech = {
        ...tech,
        morale: Math.min(100, tech.morale + state.coefficients.morale.trainingEffect),
      };

      const updatedTechs = [...state.techs];
      updatedTechs[techIdx] = updatedTech;

      gameRepository.updateState({
        techs: updatedTechs,
        cash: state.cash - trainingCost,
      });

      return res.json({
        success: true,
        trained: updatedTech,
        cost: trainingCost,
      });
    }

    res.status(404).json({ error: 'Staff member not found' });
  } catch (error) {
    console.error('Error training staff:', error);
    res.status(500).json({ error: 'Failed to train staff' });
  }
});

export default router;
