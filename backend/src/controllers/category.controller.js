const { Categorys } = require("../models");
// const Products = require("../models/productModel");
const createError = require("http-errors");

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Categorys.find();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  },
  createCategory: async (req, res) => {
    try {
      // if user have role = 1 ---> admin
      // only admin can create , delete and update category
      const { name } = req.body;
      const category = await Categorys.findOne({ name });
      if (category) throw createError(400, "This category already exists.");

      const newCategory = new Categorys({ name });

      await newCategory.save();
      res.json({ msg: "Created a category" });
    } catch (err) {
      next(err);
    }
  },
  // deleteCategory: async (req, res) => {
  //   try {
  //     const products = await Products.findOne({ category: req.params.id });
  //     if (products)
  //       return res.status(400).json({
  //         msg: "Please delete all products with a relationship.",
  //       });

  //     await Categorys.findByIdAndDelete(req.params.id);
  //     res.json({ msg: "Deleted a Categorys" });
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },
  // updateCategory: async (req, res) => {
  //   try {
  //     const { name } = req.body;
  //     await Categorys.findOneAndUpdate({ _id: req.params.id }, { name });

  //     res.json({ msg: "Updated a category" });
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },
};

module.exports = categoryCtrl;
