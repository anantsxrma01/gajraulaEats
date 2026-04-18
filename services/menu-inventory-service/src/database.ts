import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
  const connectionString =
    process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/menuInventory';

  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as mongoose.ConnectOptions);

  console.log('Connected to MongoDB');
}
