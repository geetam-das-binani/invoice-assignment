import express from "express";
import { registerUser, logout } from "../controllers/registerController.mjs";
const router = express.Router();
import passport from "passport";

router.get("/", async (req, res) => {
  res.render("home");
});


router.get("/logout", logout);
router.get("/register-page", (req, res) => {
  res.render("registerpage");
});
router.get("/login-page", (req, res) => {
  res.render("loginpage");
});
router.post("/register", registerUser);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/invoice",
  }),
  (req, res, next) => {}
);


export default router;
