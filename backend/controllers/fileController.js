const File = require("../models/File");
const nodemailer = require("nodemailer");

exports.uploadFile = async (req, res) => {

  try {

    if (!req.files || req.files.length === 0) {

      return res.status(400).json({
        message: "No files uploaded",
      });

    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const uploadMode = req.body.uploadMode;
      let fileName = file.originalname;
      const existingFile = await File.findOne({
        displayName: file.originalname,
        ...(req.user
          ? { user: req.user.id }
          : { guestId: req.body.guestId }),

      });

      if (
        existingFile &&
        uploadMode === "replace"
      ) {

        if (fs.existsSync(existingFile.path)) {
          fs.unlinkSync(existingFile.path);
        }

        await File.findByIdAndDelete(
          existingFile._id
        );
      }

      if (existingFile && uploadMode === "saveanyway") {
        const nameParts = file.originalname.split(".");
        const extension = nameParts.pop();
        const baseName = nameParts.join(".");
        let counter = 1;
        let newName = `${baseName}(${counter}).${extension}`;
        while (
          await File.findOne({
            displayName: newName,
            user: req.user ? req.user.id : null,
              guestId: req.user
                ? null
                : req.body.guestId,
          })
        ) {
          counter++;
          newName = `${baseName}(${counter}).${extension}`;
        }
        fileName = newName;
      }

      const newFile = await File.create({

        filename: file.filename,
        originalname: file.originalname,
        displayName: fileName,
        path: file.path,
        size: file.size,

        user: req.user ? req.user.id : null,
          guestId: req.user
            ? null
            : req.body.guestId,

        folder: req.body.folder || "General",

      });

      uploadedFiles.push(newFile);

    }

    res.status(200).json({

      message: "Files uploaded successfully",
      files: uploadedFiles,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

};

exports.getFiles = async (req, res) => {

  try {

    let files;

    if (req.user) {

      files = await File.find({
        user: req.user.id,
      }).sort({ createdAt: -1 });

    } else {

      files = await File.find({
        guestId: req.query.guestId,
      }).sort({ createdAt: -1 });

    }

    res.status(200).json(files);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

};
exports.renameFile = async (req, res) => {

  try {

    const { id } = req.params;

    const { displayName } = req.body;

    const updatedFile = await File.findByIdAndUpdate(
      id,
      {
        displayName,
      },
      {
        new: true,
      }
    );

    res.json(updatedFile);

  } catch (error) {

    res.status(500).json({
      message: "Rename failed",
    });

  }

};

exports.downloadFile = async (req, res) => {

  try {

    const file = await File.findById(req.params.id);

    if (!file) {

      return res.status(404).json({
        message: "File not found",
      });

    }

    file.downloads += 1;

    await file.save();

    res.download(file.path);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

};

exports.shareFileByEmail = async (req, res) => {

  try {

    const file = await File.findById(req.params.id);

    if (!file) {

      return res.status(404).json({
        message: "File not found",
      });

    }

    console.log("Sending to:", req.body.email);
    console.log("From:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

    });

    const fileLink =
      `http://localhost:5000/api/files/download/${file._id}`;

    const info = await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: req.body.email,

      subject: "QuickShare File Shared With You",

      html: `
        <h2>QuickShare</h2>

        <p>A file has been shared with you.</p>

        <p>
          <b>File:</b> ${file.originalname}
        </p>

        <a href="${fileLink}">
          Download File
        </a>
      `,

    });

    console.log("Mail sent successfully");
    console.log(info);

    res.status(200).json({
      message: "Email sent successfully",
    });

  } catch (error) {

    console.log("EMAIL ERROR:");
    console.log(error);

    res.status(500).json({
      message: "Email failed",
    });

  }

};

const fs = require("fs");

exports.deleteFile = async (req, res) => {

  try {

    const file = await File.findById(req.params.id);

    if (!file) {

      return res.status(404).json({
        message: "File not found",
      });

    }

    if (
      req.user &&
      file.user &&
      file.user.toString() !== req.user.id
    ) {

      return res.status(401).json({
        message: "Unauthorized",
      });

    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "File deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

};