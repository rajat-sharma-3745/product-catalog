import express from 'express';
import { listCatalog, addToCatalog } from '../controllers/catalogController.js';

const router = express.Router();

router.get('/', listCatalog);
router.post('/', addToCatalog);

export default router;
