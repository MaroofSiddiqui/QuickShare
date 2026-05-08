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
  shareFileByEmail,
} = require("../controllers/fileController");

router.post(
  "/upload",
  upload.array("files", 10),
  uploadFile
);

router.get(
  "/",
  getFiles
);

router.get(
  "/download/:id",
  downloadFile
);

router.delete(
  "/:id",
  protect,
  deleteFile
);

router.put(
  "/:id",
  protect,
  renameFile
);

router.post(
  "/share-email/:id",
  protect,
  shareFileByEmail
);

module.exports = router;