const { MongoClient } = require('mongodb');

const uri = 'mongodb://pradipweb45:Lesp%40123@ac-3bvwywb-shard-00-00.gpzpcei.mongodb.net:27017,ac-3bvwywb-shard-00-01.gpzpcei.mongodb.net:27017,ac-3bvwywb-shard-00-02.gpzpcei.mongodb.net:27017/artist-portfolio?replicaSet=atlas-3bvwywb-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority';

(async () => {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });

  try {
    console.log('URI:', uri);
    console.log('Connecting...');
    await client.connect();
    console.log('Connected');
    const adminDb = client.db('admin');
    const ping = await adminDb.command({ ping: 1 });
    console.log('Ping response:', ping);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Code:', error.code, 'CodeName:', error.codeName);
    console.error(error);
  } finally {
    await client.close();
  }
})();
