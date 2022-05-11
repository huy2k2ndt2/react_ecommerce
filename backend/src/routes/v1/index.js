const express = require("express");

const routers = express.Router();

routers.use("/user", require("./user.router"));

module.exports = routers;
