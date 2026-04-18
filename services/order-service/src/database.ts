import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const connectionString =
    process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/order-service';

  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as mongoose.ConnectOptions);

  console.log('Order Service connected to MongoDB');
}
