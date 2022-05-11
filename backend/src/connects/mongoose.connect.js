require("dotenv").config();
const mongoose = require("mongoose");

async function connectMongoose() {
  await mongoose.connect(process.env.MONGOOSE_URL);
}

module.exports = connectMongoose;
