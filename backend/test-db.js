// Quick debug script to test MongoDB connection and user creation
require("dotenv").config();
const mongoose = require("mongoose");

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

const testConnection = async () => {
  try {
    console.log("\n1. Attempting MongoDB connection...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB");

    // Test read
    console.log("\n2. Testing database read (listCollections)...");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("✅ Collections found:", collections.map(c => c.name));

    // Test write
    console.log("\n3. Testing database write (create test doc)...");
    const result = await mongoose.connection.db.collection("test_collection").insertOne({ test: "value", timestamp: new Date() });
    console.log("✅ Write successful, insertedId:", result.insertedId);

    // Clean up
    console.log("\n4. Cleaning up test collection...");
    await mongoose.connection.db.collection("test_collection").deleteOne({ _id: result.insertedId });
    console.log("✅ Cleanup successful");

    console.log("\n✅ All database operations successful!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

testConnection();
