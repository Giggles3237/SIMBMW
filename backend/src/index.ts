import dotenv from 'dotenv';
import { createServer } from './server';
import { gameRepository } from './core/repository/repository';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const SEED_MODE = process.env.SEED_MODE || 'keep';

// Initialize game state
if (SEED_MODE === 'reset') {
  console.log('Resetting game state...');
  gameRepository.reset();
} else {
  console.log('Loading existing game state...');
  try {
    gameRepository.load();
    console.log('Game state loaded successfully');
  } catch (error) {
    console.log('No saved state found, using initialized state');
  }
}

// Create and start server
const app = createServer();

app.listen(PORT, () => {
  console.log(`🚗 Dealership Simulator Backend running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check at http://localhost:${PORT}/health`);
});
