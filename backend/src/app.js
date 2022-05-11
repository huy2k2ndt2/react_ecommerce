const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const { connectMongoose } = require("./connects");
const fileUpload = require("express-fileupload");

require("dotenv").config();

connectMongoose()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(require("./routes"));

app.use((req, res, next) => {
  next(createError.NotFound("This Router Not found"));
});

app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(Number(err.status) || 500).json({
    message: err.message,
  });
});

module.exports = app;
