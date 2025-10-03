import { GameState } from '@dealership-sim/shared';
import { initializeGameState } from '../services/initialization';
import * as fs from 'fs';
import * as path from 'path';

class GameRepository {
  private state: GameState;
  private saveFilePath: string;

  constructor() {
    this.saveFilePath = path.join(__dirname, '../../../data/save.json');
    this.state = initializeGameState();
  }

  getState(): GameState {
    return this.state;
  }

  setState(state: GameState): void {
    this.state = state;
  }

  updateState(updates: Partial<GameState>): void {
    this.state = { ...this.state, ...updates };
  }

  save(): void {
    try {
      const dir = path.dirname(this.saveFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.saveFilePath, JSON.stringify(this.state, null, 2));
    } catch (error) {
      console.error('Failed to save game state:', error);
      throw new Error('Failed to save game state');
    }
  }

  load(): void {
    try {
      if (fs.existsSync(this.saveFilePath)) {
        const data = fs.readFileSync(this.saveFilePath, 'utf-8');
        this.state = JSON.parse(data);
      } else {
        console.log('No save file found, using initialized state');
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
      throw new Error('Failed to load game state');
    }
  }

  reset(): void {
    this.state = initializeGameState();
  }
}

export const gameRepository = new GameRepository();
