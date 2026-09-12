const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  updatePreferences
} = require("../controllers/preferenceController");

router.put(
  "/groups/:id/preferences",
  protect,
  updatePreferences
);

module.exports = router;
