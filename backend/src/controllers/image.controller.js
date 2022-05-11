// we will upload image on cloudinary
const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

const imageCtrl = {
  uploadImage: (req, res, next) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        throw createError(400, "No files were uploaded.");
      }

      const file = req.files.file;
      if (file.size > 1024 * 1024) {
        removeTmp(file.tempFilePath);
        throw createError(400, "Size too large");
      }

      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        removeTmp(file.tempFilePath);
        throw createError(400, "File format is incorrect.");
      }

      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { folder: "ecommerce" },
        async (err, result) => {
          if (err) throw err;

          removeTmp(file.tempFilePath);

          res.json({ public_id: result.public_id, url: result.secure_url });
        }
      );
    } catch (err) {
      next(err);
    }
  },
  deleteImage: (req, res, next) => {
    try {
      const { public_id } = req.body;
      if (!public_id) {
        throw createError(400, "No images Selected");
      }

      cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
        if (err) throw err;

        res.json({ msg: "Deleted Image" });
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = imageCtrl;
