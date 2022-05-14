const express = require("express");

const routers = express.Router();

routers.use("/user", require("./user.router"));
routers.use("/category", require("./category.router"));
routers.use("/image", require("./image.router"));
routers.use("/product", require("./product.router"));

module.exports = routers;
