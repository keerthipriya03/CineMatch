const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createGroup,
  joinGroup,
  getGroup,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/", protect, createGroup);
router.post("/join", protect, joinGroup);
router.get("/:id", protect, getGroup);

module.exports = router;
