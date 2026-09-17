const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createGroup,
  joinGroup,
  getGroup,

  updatePreferences,
  getRecommendations,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/", protect, createGroup);
router.post("/join", protect, joinGroup);
router.get("/:id", protect, getGroup);



// Save user's movie preferences
router.put("/:id/preferences", protect, updatePreferences);
// Generate group recommendations
router.get("/:id/recommendations", protect, getRecommendations);

module.exports = router;
