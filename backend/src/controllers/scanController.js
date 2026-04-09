
import Product from '../models/Product.js';
import { normalizeCode } from '../middleware/validate.js';

async function scan(req, res, next) {
  try {
    const normalizedCode = normalizeCode(req.body?.code);
    const product = await Product.findOne({ barcode: normalizedCode })
      .select('_id name barcode price currency inStock imageUrl description')
      .lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return next(error);
  }
}

export { scan };
