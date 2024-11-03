import { Router } from 'express';
import { getMetrics } from './metricsController';

export const router = Router();

router.get('/metrics', getMetrics);
