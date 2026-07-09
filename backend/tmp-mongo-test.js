require('dotenv').config();
const mongoose = require('mongoose');
console.log('MONGO_URI loaded:', Boolean(process.env.MONGO_URI));
console.log('MONGO_URI prefix:', process.env.MONGO_URI ? process.env.MONGO_URI.slice(0, 60) + '...' : 'missing');
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
}).then(() => {
  console.log('MongoDB connected successfully');
  process.exit(0);
}).catch((error) => {
  console.error('MongoDB connect error:', error.name);
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
});
