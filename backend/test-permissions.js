// Test read permissions
const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://pradipweb45:Lesp%40123@ac-3bvwywb-shard-00-00.gpzpcei.mongodb.net:27017,ac-3bvwywb-shard-00-01.gpzpcei.mongodb.net:27017,ac-3bvwywb-shard-00-02.gpzpcei.mongodb.net:27017/artist-portfolio?replicaSet=atlas-3bvwywb-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority";

const testRead = async () => {
  const client = new MongoClient(MONGO_URI);

  try {
    console.log("1. Testing connection...");
    await client.connect();
    console.log("✅ Connected");

    const db = client.db("artist-portfolio");

    console.log("\n2. Listing collections...");
    const collections = await db.listCollections().toArray();
    console.log("✅ Collections:", collections.map(c => c.name));

    console.log("\n3. Checking users collection...");
    const usersCollection = db.collection("users");
    const count = await usersCollection.countDocuments();
    console.log("✅ User documents in DB:", count);

    console.log("\n4. Testing write with direct command...");
    const adminDb = client.db("admin");
    const buildInfo = await adminDb.admin().buildInfo();
    console.log("✅ Server version:", buildInfo.version);

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Details:", error.codeName);
  } finally {
    await client.close();
  }
};

testRead();
