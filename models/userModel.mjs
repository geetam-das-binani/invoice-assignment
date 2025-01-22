import mongoose from "mongoose";
import plm from "passport-local-mongoose";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
});
userSchema.plugin(plm);

export const UserModel = mongoose.model("User", userSchema);