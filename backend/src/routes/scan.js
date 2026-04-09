import express from 'express';
import { scan } from '../controllers/scanController.js';

const router = express.Router();

router.post('/', scan);

export default router;
