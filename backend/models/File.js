const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalname: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
      default: "",
    },

    filename: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    guestId: {
      type: String,
      default: null,
    },

    downloads: {
      type: Number,
      default: 0,
    },

    folder: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", fileSchema);