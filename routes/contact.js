const express = require("express");
const {
  selectContact,
  addContact,
  updateContact,
  deleteContact,
  searchContact,
} = require("../controller/contact");

const router = express.Router();

router.route("/").get(selectContact).post(addContact);
router.route("/:id").put(updateContact).delete(deleteContact);
router.route("/search").get(searchContact);
module.exports = router;
