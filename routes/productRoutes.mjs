import express from "express";
import {
  createUpdateProduct,
  deleteProduct,
} from "../controllers/productController.mjs";
import { ProductModel } from "../models/productModel.mjs";
const router = express.Router();

router.post("/create-update-product/:id?", createUpdateProduct);

router.post("/delete-product/:id", deleteProduct);

router.post("/edit-product/:id", async (req, res) => {
  const products = await ProductModel.find({});
  const totalAmount = products.reduce((acc, product) => {
    return acc + parseFloat(product.total);
  }, 0);
  const { id } = req.params;
  const product = await ProductModel.findById(id);
  res.render("invoice", {
    products: products.length > 0 ? products : [],
    id,
    product,
    totalAmount: totalAmount?.toFixed(2)  ||  0,
  });
});

export default router;
