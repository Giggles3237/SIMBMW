import express from 'express';
import cors from 'cors';
import stateRoutes from './routes/state';
import gameRoutes from './routes/game';
import inventoryRoutes from './routes/inventory';
import marketingRoutes from './routes/marketing';
import staffRoutes from './routes/staff';
import configRoutes from './routes/config';
import reportsRoutes from './routes/reports';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Routes
  app.use('/api/state', stateRoutes);
  app.use('/api', gameRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/marketing', marketingRoutes);
  app.use('/api/staff', staffRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/reports', reportsRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
