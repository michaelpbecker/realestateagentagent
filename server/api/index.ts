import express from 'express';
import { chatRouter } from './chat.js';
import { calculationsRouter } from './calculations.js';

export const apiRouter = express.Router();
 
apiRouter.use('/chat', chatRouter);
apiRouter.use('/calculations', calculationsRouter); 