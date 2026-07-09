const { MongoClient } = require('mongodb');

const uri = 'mongodb://pradipweb45:Lesp%40123@ec2-159-41-183-30.ap-south-1.compute.amazonaws.com:27017/artist-portfolio?authSource=admin&directConnection=true&tls=true';
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });

(async () => {
  try {
    console.log('Testing URI:', uri);
    await client.connect();
    console.log('Connected successfully');
    const adminDb = client.db('admin');
    const ping = await adminDb.command({ ping: 1 });
    console.log('Ping result:', ping);
  } catch (err) {
    console.error('Connection error:', err.message);
    console.error('Code:', err.code, 'CodeName:', err.codeName);
    console.error(err);
  } finally {
    await client.close();
  }
})();
