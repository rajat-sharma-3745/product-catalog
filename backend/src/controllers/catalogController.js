import CatalogItem from '../models/CatalogItem.js';
import Payment from '../models/Payment.js';

function createConflictError(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

function createBadRequestError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

async function listCatalog(req, res, next) {
  try {
    const catalogItems = await CatalogItem.find()
      .populate({
        path: 'productId',
        select: '_id name barcode price currency inStock imageUrl description',
      })
      .populate({
        path: 'paymentId',
        select: '_id transactionRef status',
      })
      .sort({ purchasedAt: -1 })
      .lean();

    const items = catalogItems.map((item) => ({
      id: item._id,
      purchasedAt: item.purchasedAt,
      product: item.productId,
      payment: item.paymentId
        ? {
            id: item.paymentId._id,
            transactionRef: item.paymentId.transactionRef,
            status: item.paymentId.status,
          }
        : null,
    }));

    return res.status(200).json({ items });
  } catch (error) {
    return next(error);
  }
}

async function addToCatalog(req, res, next) {
  try {
    const { paymentId, productId } = req.body;
    const payment = await Payment.findById(paymentId).select('_id productId status').lean();

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'success') {
      throw createBadRequestError('Only successful payments can be added to catalog');
    }

    if (productId && String(payment.productId) !== productId) {
      throw createBadRequestError('productId does not match payment record');
    }

    try {
      const catalogItem = await CatalogItem.create({
        productId: payment.productId,
        paymentId: payment._id,
      });

      return res.status(201).json({
        item: {
          id: catalogItem._id,
          productId: catalogItem.productId,
          paymentId: catalogItem.paymentId,
          purchasedAt: catalogItem.purchasedAt,
        },
      });
    } catch (error) {
      if (error?.code === 11000) {
        throw createConflictError('Catalog entry already exists for this payment');
      }
      throw error;
    }
  } catch (error) {
    return next(error);
  }
}

export { listCatalog, addToCatalog };
