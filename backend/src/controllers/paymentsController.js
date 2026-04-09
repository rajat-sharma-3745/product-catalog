import Product from '../models/Product.js';
import Payment from '../models/Payment.js';

function createAmountMismatchError(productPrice) {
  const error = new Error(`amount must match product price (${productPrice})`);
  error.status = 400;
  return error;
}

function createTransactionRef() {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0')}`;
}

async function createPayment(req, res, next) {
  try {
    const { productId, amount } = req.body;
    const product = await Product.findById(productId).select('_id price currency').lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (amount !== product.price) {
      throw createAmountMismatchError(product.price);
    }

    const payment = await Payment.create({
      productId: product._id,
      amount,
      currency: product.currency,
      status: 'success',
      transactionRef: createTransactionRef(),
    });

    return res.status(201).json({
      status: payment.status,
      transactionRef: payment.transactionRef,
      paymentId: payment._id,
    });
  } catch (error) {
    return next(error);
  }
}

export { createPayment };
