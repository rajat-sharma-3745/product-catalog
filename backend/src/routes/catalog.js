import express from 'express';
import { listCatalog, addToCatalog } from '../controllers/catalogController.js';
import { validateCatalogBody } from '../middleware/validate.js';

const router = express.Router();

router.get('/', listCatalog);
router.post('/', validateCatalogBody, addToCatalog);

export default router;
