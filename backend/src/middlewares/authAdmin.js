const Users = require("../models/user.model");
const createError = require("http-errors");

const authAdmin = async (req, res, next) => {
  try {
    const { userId } = req;

    // Get user information by id
    const user = await Users.findOne({
      _id: userId,
    });

    if (!user) {
      throw createError(400, "Please Login or Register");
    }

    if (user.role === 0)
      throw createError(401, "Admin resources access denied");

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authAdmin;
