const express = require("express");

const router = express.Router();

const File = require("../models/File");

const protect = require("../middleware/authMiddleware");

router.get("/files", protect, async (req, res) => {

  try {

    if (!req.user.isAdmin) {

      return res.status(403).json({
        message: "Admin only",
      });

    }

    const files = await File.find()
      .populate("user", "email")
      .sort({ createdAt: -1 });

    res.json(files);

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    });

  }

});

module.exports = router;