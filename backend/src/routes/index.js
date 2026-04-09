import express from 'express';
import scanRoutes from './scan.js';
import paymentsRoutes from './payments.js';
import catalogRoutes from './catalog.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

router.use('/scan', scanRoutes);
router.use('/payments', paymentsRoutes);
router.use('/catalog', catalogRoutes);

export default router;
