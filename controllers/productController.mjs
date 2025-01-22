import { ProductModel } from "../models/productModel.mjs";

const createUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, quantity, price, gst } = req.body;
    let floatPrice = parseFloat(price);
    let floatGst = parseFloat(gst);
    let prodQty = Number(quantity);
    const gstAmount = (floatPrice * floatGst) / 100;
    const totalAmount = (floatPrice + gstAmount) * prodQty;

    if (id) {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        {
          $set: {
            name: productName,
            quantity,
            price: floatPrice,
            gst: floatGst,
            total: totalAmount.toFixed(2),
          },
        },
        { new: true }
      );
      if (updatedProduct) {
        console.log("Product updated successfully");
        res.redirect("/invoice");
      } else {
        res.redirect("/invoice");
      }
    } else {
      const newProduct = await ProductModel.create({
        name: productName,
        quantity,
        price: floatPrice,
        gst: floatGst,
        total: totalAmount.toFixed(2),
      });
      console.log(newProduct);
      if (newProduct) {
        console.log("Product created successfully");
        res.redirect("/invoice");
      } else {
        res.redirect("/invoice");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (deletedProduct) {
      console.log("Product deleted successfully");
      res.redirect("/invoice");
    }
  } catch (error) {
    console.log(error);
  }
};


export { createUpdateProduct, deleteProduct };
