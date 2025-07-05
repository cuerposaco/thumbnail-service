import express from 'express';
import mainRouter from '../app/routes';

// Create an Express application
const app = express();
// Middleware to parse JSON requests
app.use(express.json());
// Define main route
app.get('/', mainRouter());

export default app;
