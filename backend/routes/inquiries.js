// routes/inquiries.js
// Visitors submit inquiries; admin reads, marks, deletes

const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");
const Artwork = require("../models/Artwork");
const { protect } = require("../middleware/auth");

// @route   POST /api/inquiries
// @desc    Submit an inquiry (public)
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message, artworkId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    }

    // Email format check
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    let artworkTitle = "";
    let artworkRef = null;

    if (artworkId) {
      const artwork = await Artwork.findById(artworkId).select("title");
      if (artwork) {
        artworkTitle = artwork.title;
        artworkRef = artworkId;
      }
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || "",
      message: message.trim(),
      artworkInterested: artworkRef,
      artworkTitle,
    });

    res.status(201).json({ success: true, message: "Inquiry submitted successfully", inquiry });
  } catch (error) {
    console.error("Submit inquiry error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries with optional search (admin)
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { search, isRead, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { artworkTitle: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    if (isRead === "true") query.isRead = true;
    if (isRead === "false") query.isRead = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [inquiries, total, unreadCount] = await Promise.all([
      Inquiry.find(query)
        .populate("artworkInterested", "title images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Inquiry.countDocuments(query),
      Inquiry.countDocuments({ isRead: false }),
    ]);

    res.json({
      success: true,
      inquiries,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get inquiries error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/inquiries/:id
// @desc    Get single inquiry (admin)
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate("artworkInterested", "title images");
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }
    res.json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PATCH /api/inquiries/:id/read
// @desc    Toggle read/unread status (admin)
// @access  Private
router.patch("/:id/read", protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    inquiry.isRead = !inquiry.isRead;
    await inquiry.save();

    res.json({ success: true, message: `Marked as ${inquiry.isRead ? "read" : "unread"}`, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   DELETE /api/inquiries/:id
// @desc    Delete inquiry (admin)
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }
    res.json({ success: true, message: "Inquiry deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
