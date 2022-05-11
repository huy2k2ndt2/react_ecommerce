const router = require("express").Router();
const { imageCtrl } = require("../../controllers");
const auth = require("../../middlewares/auth");
const authAdmin = require("../../middlewares/authAdmin");

// Upload image only admin can use
router.post("/", auth, authAdmin, imageCtrl.uploadImage);

// Delete image only admin can use
router.delete("/", auth, authAdmin, imageCtrl.deleteImage);

module.exports = router;
