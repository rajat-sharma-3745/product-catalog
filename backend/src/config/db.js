import mongoose from 'mongoose';

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set ');
    return;
  }
  await mongoose.connect(uri);
}

export { connectDb };
