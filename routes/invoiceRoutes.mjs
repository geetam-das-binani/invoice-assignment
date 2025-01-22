import express from "express";
import { ProductModel } from "../models/productModel.mjs";
import PDFDocument from "pdfkit";

const router = express.Router();
router.get("/invoice", isLoggedIn, async (req, res) => {
  const products = await ProductModel.find({});
  const totalAmount = products.reduce((acc, product) => {
    return acc + parseFloat(product.total);
  }, 0);
  res.render("invoice", {
    products: products.length > 0 ? products : [],
    id: "",
    product: {},
    totalAmount: totalAmount.toFixed(2),
  });
});

router.post("/create-invoice", isLoggedIn, async (req, res) => {
  try {
    const {
      companyName,
      yourName,
      companyGstin,
      companyAddress,
      city,
      state,
      placeOfSupply,
      clientCompany,
      clientGstin,
      clientAddress,
      clientCity,
      clientState,
      invoiceNumber,
      invoiceDate,
      dueDate,
    } = req.body;

    const products = await ProductModel.find({});
    const totalAmount = products.reduce(
      (acc, product) => acc + parseFloat(product.total),
      0
    );

    const doc = new PDFDocument({ margin: 30 });

    // Stream the PDF to the response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice_${invoiceNumber}.pdf"`
    );

    doc.pipe(res);

    // Add Header
    doc.fontSize(20).text("Invoice", { align: "center" });
    // Set a font that supports ₹
    doc.font("fonts/noto.ttf");

    doc.moveDown(2);

    // Add Company Information
    doc.fontSize(14).text("Your Company Information", { underline: true });
    doc.moveDown();
    doc.text(`Company Name: ${companyName}`);
    doc.text(`Your Name: ${yourName}`);
    doc.text(`Company GSTIN: ${companyGstin}`);
    doc.text(`Address: ${companyAddress}, ${city}, ${state}`);
    doc.text(`Place of Supply: ${placeOfSupply}`);
    doc.moveDown(2);

    // Add Client Information
    doc.text("Client Information", { underline: true });
    doc.moveDown();
    doc.text(`Client's Company: ${clientCompany}`);
    doc.text(`Client's GSTIN: ${clientGstin}`);
    doc.text(
      `Client's Address: ${clientAddress}, ${clientCity}, ${clientState}`
    );
    doc.moveDown(2);

    // Add Invoice Details
    doc.text("Invoice Details", { underline: true });
    doc.moveDown();
    doc.text(`Invoice #: ${invoiceNumber}`);
    doc.text(`Invoice Date: ${invoiceDate}`);
    doc.text(`Due Date: ${dueDate}`);
    doc.moveDown(2);

    // Add Product Table Headers
    const tableTop = doc.y;
    const colWidths = [120, 70, 70, 70, 100]; // Set column widths
    const startX = 50;

    doc.fontSize(12).text("Product Name", startX, tableTop);
    doc.text("Quantity", startX + colWidths[0], tableTop);
    doc.text("Price", startX + colWidths[0] + colWidths[1], tableTop);
    doc.text(
      "GST Rate",
      startX + colWidths[0] + colWidths[1] + colWidths[2],
      tableTop
    );
    doc.text(
      "Total",
      startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
      tableTop
    );
    doc.moveDown(1);

    // Add Product Details
    // Add Product Details
    let currentY = doc.y;
    products.forEach((product) => {
      const { name, quantity, price, gst, total } = product;

      // Product details with proper alignment
      doc.text(name, startX, currentY);
      doc.text(quantity.toString(), startX + colWidths[0], currentY);
      doc.text(
        `\u20B9${price.toFixed(2)}`,
        startX + colWidths[0] + colWidths[1],
        currentY
      ); // Correct ₹ symbol
      doc.text(
        `${gst}%`,
        startX + colWidths[0] + colWidths[1] + colWidths[2],
        currentY
      );
      doc.text(
        `\u20B9${total.toFixed(2)}`,
        startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
        currentY
      );
      currentY += 20; // Move to the next row
    });

    // Add Total Amount
    doc.moveDown(2);
    doc
      .fontSize(14)
      .text(`Total Amount: ₹${totalAmount.toFixed(2)}`, { align: "right" });

    // Footer
    doc.moveDown(4);
    doc.text("Thank you for your business!", { align: "center" });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  return res.redirect("/");
}

export default router;
