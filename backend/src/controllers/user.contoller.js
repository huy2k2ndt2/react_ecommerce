const Users = require("../models/user.model");
// const Payments = require('../models/paymentModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const userCtrl = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const users = await Promise.all([
        Users.findOne({ email }),
        Users.findOne({ name }),
      ]);

      users.map((user) => {
        if (user) throw createError(401, "The email or name already exists.");
      });

      if (password.length < 0) {
        throw createError(401, "Password is at least 6 characters long.");
      }

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      // Save mongodb
      await newUser.save();

      // Then create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/v1/api/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { name, password } = req.body;

      const user = await Users.findOne({ name });
      if (!user) {
        throw createError(401, "User does not exist.");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw createError(400, "Incorrect password.");
      }

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/v1/api/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken });
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/v1/api/user/refresh_token" });
      return res.json({ message: "Logged out" });
    } catch (err) {
      next(err);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { userId } = req;

      const user = await Users.findById(userId).select("-password");
      if (!user) throw createError(400, "User does not exist.");

      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  refreshToken: (req, res, next) => {
    try {
      const { refreshtoken } = req.cookies;

      if (!refreshtoken) throw createError(401, "Please Login or Register");

      jwt.verify(
        refreshtoken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) throw createError(401, "Please Login or Register");

          const accesstoken = createAccessToken({ id: user.id });

          res.json({ accesstoken });
        }
      );
    } catch (err) {
      next(err);
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;
