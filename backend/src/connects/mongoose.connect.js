require("dotenv").config();
const mongoose = require("mongoose");

async function connectMongoose() {
  await mongoose.connect(process.env.MONGOOSE_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectMongoose;
