import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Custom imports (Make sure these paths match your actual folder structure!)
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/AppError';
import routes from './routes'; 

const app: Application = express();

// 1. Body Parsers (To read JSON data from the frontend)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CORS (Allows your Vercel frontend to talk to this Render backend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// 3. Security Headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// 4. Logging (Only runs in development mode)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 5. Static Folder (Allows the frontend to view uploaded salary slips/PDFs)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 6. Health Check Endpoint (Great for testing if the server is awake)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'LMS API is running normally.' });
});

// 7. The Magic Line: Mount all your actual business logic routes!
app.use('/api', routes); 

// 8. 404 Catcher (If someone tries a route that doesn't exist)
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 9. Global Error Handler (Catches any crashes and sends a clean JSON error)
app.use(errorHandler);

export default app;