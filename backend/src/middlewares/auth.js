const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) throw createError(401, "Invalid Authentication");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) throw createError(401, "Invalid Authentication");

      const { id } = data;

      req.userId = id;
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
