const express = require("express");
const auth = require("../middleware/auth");
const {
  signupContact,
  loginContact,
  logoutContact,
  addContactUser,
  selectUser,
  updateUser,
  deleteContactUser,
  sharedContact,
  sharedCancel,
} = require("../controller/user");

const router = express.Router();

router.route("/").post(signupContact);
router.route("/login").post(loginContact);
router.route("/logout").delete(auth, logoutContact);
router.route("/add").post(auth, addContactUser);
router.route("/me").get(auth, selectUser);
router.route("/update").put(auth, updateUser);
router.route("/delete").delete(auth, deleteContactUser);
router.route("/share").post(auth, sharedContact);
router.route("/sharedcancel").delete(auth, sharedCancel);

module.exports = router;
