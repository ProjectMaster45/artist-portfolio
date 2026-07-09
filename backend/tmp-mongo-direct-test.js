require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  tls: true,
  directConnection: true,
});
console.log('Connecting direct to single node...');
client.connect().then(() => {
  console.log('connected direct');
  return client.db('admin').command({ ping: 1 });
}).then((result) => {
  console.log('ping result', result);
  return client.close();
}).catch((error) => {
  console.error('direct error:', error.name);
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
});
