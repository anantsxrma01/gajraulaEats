/**
 * Run: node db/migrations/001_create_collections.js
 * Uses process.env.MONGO_URI
 */
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(); // uses database from the connection string or default

  // Helper for safe createCollection with validator
  async function ensureCollection(name, validator, options = {}) {
    const existing = await db.listCollections({ name }).toArray();
    if (existing.length === 0) {
      console.log(`Creating collection: ${name}`);
      await db.createCollection(name, { validator, ...options });
    } else {
      console.log(`Collection exists: ${name}`);
      // Optionally update validator
      await db.command({ collMod: name, validator }).catch(()=>{});
    }
  }

  // Users
  await ensureCollection('users', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['phone', 'createdAt'],
      properties: {
        name: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        email: { bsonType: ['string', 'null'] },
        default_address_id: { bsonType: ['objectId', 'null'] },
        roles: { bsonType: 'array' },
        createdAt: { bsonType: 'date' }
      }
    }
  });
  await db.collection('users').createIndex({ phone: 1 }, { unique: true });

  // Addresses
  await ensureCollection('addresses', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'label', 'location', 'full_address'],
      properties: {
        user_id: { bsonType: 'objectId' },
        label: { bsonType: 'string' },
        full_address: { bsonType: 'string' },
        location: {
          bsonType: 'object',
          required: ['type', 'coordinates'],
          properties: {
            type: { enum: ['Point'] },
            coordinates: { bsonType: 'array' }
          }
        }
      }
    }
  });
  await db.collection('addresses').createIndex({ location: '2dsphere' });
  await db.collection('addresses').createIndex({ user_id: 1 });

  // Shops
  await ensureCollection('shops', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['owner_id', 'name', 'location', 'open_status'],
      properties: {
        owner_id: { bsonType: 'objectId' },
        name: { bsonType: 'string' },
        type: { bsonType: 'string' },
        location: {
          bsonType: 'object',
          required: ['type', 'coordinates'],
          properties: { type: { enum: ['Point'] }, coordinates: { bsonType: 'array' } }
        },
        open_status: { bsonType: 'string' },
        avg_preparation_time: { bsonType: 'int' }
      }
    }
  });
  await db.collection('shops').createIndex({ location: '2dsphere' });
  await db.collection('shops').createIndex({ owner_id: 1 });

  // Menu categories & items
  await ensureCollection('menu_categories', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['shop_id', 'name'],
      properties: {
        shop_id: { bsonType: 'objectId' },
        name: { bsonType: 'string' },
        position: { bsonType: 'int' }
      }
    }
  });
  await db.collection('menu_categories').createIndex({ shop_id: 1, name: 1 });

  await ensureCollection('menu_items', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['shop_id', 'name', 'price', 'is_active'],
      properties: {
        shop_id: { bsonType: 'objectId' },
        category_id: { bsonType: ['objectId', 'null'] },
        name: { bsonType: 'string' },
        description: { bsonType: ['string', 'null'] },
        price: { bsonType: 'double' },
        is_veg: { bsonType: 'bool' },
        is_active: { bsonType: 'bool' }
      }
    }
  });
  await db.collection('menu_items').createIndex({ shop_id: 1, name: 1 });

  // Delivery partners
  await ensureCollection('delivery_partners', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'phone', 'status'],
      properties: {
        name: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        vehicle_type: { bsonType: ['string', 'null'] },
        documents_verified: { bsonType: 'bool' },
        status: { bsonType: 'string' },
        location: {
          bsonType: ['object', 'null'],
          properties: {
            type: { enum: ['Point'] },
            coordinates: { bsonType: 'array' }
          }
        }
      }
    }
  });
  await db.collection('delivery_partners').createIndex({ phone: 1 }, { unique: true, sparse: true });
  await db.collection('delivery_partners').createIndex({ location: '2dsphere' });

  // Orders & items
  await ensureCollection('orders', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'shop_id', 'address_id', 'status', 'created_at'],
      properties: {
        user_id: { bsonType: 'objectId' },
        shop_id: { bsonType: 'objectId' },
        delivery_partner_id: { bsonType: ['objectId', 'null'] },
        address_id: { bsonType: 'objectId' },
        status: { bsonType: 'string' },
        payment_status: { bsonType: 'string' },
        amount: { bsonType: 'double' },
        created_at: { bsonType: 'date' },
        pickup_location: {
          bsonType: ['object', 'null'],
          properties: { type: { enum: ['Point'] }, coordinates: { bsonType: 'array' } }
        }
      }
    }
  });
  await db.collection('orders').createIndex({ user_id: 1 });
  await db.collection('orders').createIndex({ shop_id: 1 });
  await db.collection('orders').createIndex({ delivery_partner_id: 1 });
  await db.collection('orders').createIndex({ created_at: -1 });

  await ensureCollection('order_items', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['order_id', 'menu_item_id', 'quantity', 'price'],
      properties: {
        order_id: { bsonType: 'objectId' },
        menu_item_id: { bsonType: 'objectId' },
        quantity: { bsonType: 'int' },
        price: { bsonType: 'double' }
      }
    }
  });
  await db.collection('order_items').createIndex({ order_id: 1 });

  // Payments
  await ensureCollection('payments', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['order_id', 'gateway', 'amount', 'status'],
      properties: {
        order_id: { bsonType: 'objectId' },
        gateway: { bsonType: 'string' },
        amount: { bsonType: 'double' },
        status: { bsonType: 'string' },
        transaction_id: { bsonType: ['string', 'null'] },
        created_at: { bsonType: 'date' }
      }
    }
  });
  await db.collection('payments').createIndex({ order_id: 1 });

  // Payouts
  await ensureCollection('payouts', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['amount', 'type', 'status'],
      properties: {
        shop_id: { bsonType: ['objectId', 'null'] },
        delivery_partner_id: { bsonType: ['objectId', 'null'] },
        amount: { bsonType: 'double' },
        type: { bsonType: 'string' },
        status: { bsonType: 'string' },
        created_at: { bsonType: 'date' }
      }
    }
  });

  // Ratings / reviews
  await ensureCollection('reviews', {
    $jsonSchema: {
      bsonType: 'object',
      required: ['order_id'],
      properties: {
        order_id: { bsonType: 'objectId' },
        rating_for_shop: { bsonType: ['int', 'null'] },
        rating_for_rider: { bsonType: ['int', 'null'] },
        comments: { bsonType: ['string', 'null'] }
      }
    }
  });
  await db.collection('reviews').createIndex({ order_id: 1 });

  // Settings (e.g., center point for 30km radius)
  await ensureCollection('settings', {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        key: { bsonType: 'string' },
        value: {}
      }
    }
  });
  await db.collection('settings').createIndex({ key: 1 }, { unique: true, sparse: true });

  console.log('All collections and indexes ensured.');
  await client.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});