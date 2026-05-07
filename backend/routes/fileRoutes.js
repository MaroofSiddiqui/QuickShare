const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");

const {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  renameFile,
  shareFileByEmail
} = require("../controllers/fileController");

router.post(
  "/upload",
  protect,
  upload.array("files", 10),
  uploadFile
);

router.post(
  "/share-email/:id",
  protect,
  shareFileByEmail
);

router.get("/", protect, getFiles);
router.get("/download/:id", downloadFile);
router.delete("/:id", protect, deleteFile);
router.put("/:id", protect, renameFile);

module.exports = router;