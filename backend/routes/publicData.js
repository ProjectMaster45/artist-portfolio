const express = require("express");
const router = express.Router();
const { buildPublicSnapshot } = require("../utils/publicSnapshot");

router.get("/", async (req, res) => {
  try {
    const exportKey = process.env.PUBLIC_DATA_EXPORT_KEY;
    if (exportKey && req.get("x-static-export-key") !== exportKey) {
      return res.status(401).json({ success: false, message: "Invalid export key" });
    }

    const snapshot = await buildPublicSnapshot();
    res.json(snapshot);
  } catch (error) {
    console.error("Public data export error:", error);
    res.status(500).json({ success: false, message: "Failed to export public data" });
  }
});

module.exports = router;
