import { Router } from 'express';
import { getReport } from '../controllers/report.controller';

const router = Router();

router.get('/stats/overview', getReport);
router.get('/stats/daily', getReport);
router.get('/stats/top-shops', getReport);
router.get('/stats/top-items', getReport);

export default router;
