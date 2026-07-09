// Quick script to seed the first admin user from environment variables.
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env");
    }

    if (password.length < 8) {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters");
    }

    const admin = await User.create({ email, password, role: "admin" });
    console.log("✅ Admin created successfully!");
    console.log("   Email:", admin.email);
    console.log("   Role:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
