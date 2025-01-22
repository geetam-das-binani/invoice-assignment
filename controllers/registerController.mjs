import passport from "passport";
import { UserModel } from "../models/userModel.mjs";
import localStrategy from "passport-local";
passport.use(new localStrategy(UserModel.authenticate()));




export const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    UserModel.register(
      new UserModel({
        username,
        email,
      }),
      password,
      (err, user) => {
        if (err) {
          console.log(err);
        }
        passport.authenticate("local")(req, res, () => {
          res.redirect("/invoice");
        });
      }
    );
  } catch (error) {
    
    res.redirect("/register");
  }
};
export const logout = async (req, res) => {
    try {
      req.logOut((_) => {
        res.redirect("/");
      });
    } catch (err) {
      res.redirect("/invoice");
    }
  };

  