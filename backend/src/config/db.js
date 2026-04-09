import mongoose from 'mongoose';

let connectPromise = null;

async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (connectPromise) {
    return connectPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('bufferCommands', false);
  connectPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

  try {
    await connectPromise;
    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    connectPromise = null;
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

async function ensureDbConnection(req, res, next) {
  try {
    await connectDb();
    return next();
  } catch (error) {
    return next(error);
  }
}

export { connectDb, ensureDbConnection };
