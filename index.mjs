import express from "express";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import session from "express-session";
import invoiceRoutes from "./routes/invoiceRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import productRoutes from "./routes/productRoutes.mjs";
import { connectToDb } from "./db/connectToDb.mjs";
import { UserModel } from "./models/userModel.mjs";

const PORT = process.env.PORT || 3000;
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.set("view engine", "ejs");
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
  })
);
app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// Routes
app.use("/", invoiceRoutes);
app.use("/", userRoutes);
app.use("/", productRoutes);

Promise.all([connectToDb()])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
