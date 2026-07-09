const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MongoDB Connection Error: MONGO_URI is not set in .env");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    if (error.message.includes("querySrv")) {
      console.error(
        "Atlas SRV lookup failed. Check your internet connection, DNS/VPN/firewall settings, and Atlas Network Access IP allowlist."
      );
      console.error(
        "If DNS SRV is blocked on this network, use the standard mongodb:// connection string from Atlas instead of mongodb+srv://."
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
