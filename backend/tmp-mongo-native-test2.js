require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
console.log('URI loaded:', !!uri);
console.log('URI sample:', uri ? uri.slice(0, 60) + '...' : 'missing');
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  tls: true,
  family: 4,
});
client.connect().then(() => {
  console.log('native MongoDB client connected');
  return client.db('admin').command({ ping: 1 });
}).then((result) => {
  console.log('ping result', result);
  return client.close();
}).catch((error) => {
  console.error('native error:', error.name);
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
});
