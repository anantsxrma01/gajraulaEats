/**
 * Run: node db/seed/001_initial_seed.js
 */
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db();

  // Insert or upsert settings: center point for service area
  const cityCenter = { key: 'city_center', value: { lat: 28.6139, lng: 77.2090 } }; // example: New Delhi
  await db.collection('settings').updateOne({ key: 'city_center' }, { $set: cityCenter }, { upsert: true });

  // Sample user
  const users = db.collection('users');
  const u = await users.findOne({ phone: '+911234567890' });
  let userId = u ? u._id : (await users.insertOne({ name: 'Test User', phone: '+911234567890', email: null, createdAt: new Date() })).insertedId;

  // Sample address
  const addresses = db.collection('addresses');
  const addrRes = await addresses.insertOne({
    user_id: userId,
    label: 'Home',
    full_address: 'Sample Address, City',
    location: { type: 'Point', coordinates: [77.2090, 28.6139] }
  });

  // Sample shop
  const shops = db.collection('shops');
  const shopRes = await shops.insertOne({
    owner_id: new ObjectId(),
    name: 'Sample Kitchen',
    type: 'cloud_kitchen',
    location: { type: 'Point', coordinates: [77.2100, 28.6140] },
    open_status: 'open',
    avg_preparation_time: 20
  });

  console.log('Seed inserted. userId=', userId.toString(), 'addressId=', addrRes.insertedId.toString(), 'shopId=', shopRes.insertedId.toString());
  await client.close();
}

run().catch(err => { console.error(err); process.exit(1); });