import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import tasksRoutes from '../app/routes/tasks';

// Create an Express application
const app = express();
// Middleware to parse JSON requests
app.use(express.json());
// Tasks routes
app.use(tasksRoutes());
// Error handling middleware
app.use(errorHandler);

export default app;
