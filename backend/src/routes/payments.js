import express from 'express';
import { createPayment } from '../controllers/paymentsController.js';
import { validatePaymentBody } from '../middleware/validate.js';

const router = express.Router();

router.post('/', validatePaymentBody, createPayment);

export default router;
