import express from 'express';
import { scan } from '../controllers/scanController.js';
import { validateScanBody } from '../middleware/validate.js';

const router = express.Router();

router.post('/', validateScanBody, scan);

export default router;
