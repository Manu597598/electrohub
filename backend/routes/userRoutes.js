import express from "express";
import {
  login,
  logout,
  register,
  verify,
  reVerify,
  forgotPassword,
  verifyOTP,
  changePassword,
  allUser,
  getUserById,
  verifyEmail,
  updateUser,
} from "../controllers/usercontrollers.js";

import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();
router.get("/ping", (req, res) => {
  res.send("PONG");
});
router.post("/register", register);
router.post("/verify", verify);
router.post("/reVerify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP/:email", verifyOTP);
router.post("/changePassword/:email", changePassword);
router.get("/verify/:token", verifyEmail);
// 🔥 FOR NOW — AUTH REMOVE TO TEST
router.get("/allUser", allUser);
router.get("/getUser/:userId",getUserById)
router.put("/update/:id",isAuthenticated, singleUpload,updateUser)
export default router;
