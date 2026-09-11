const express = require("express");
const protect = require("../middleware/authMiddleware");


const { registerUser,login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);

// middleware
router.get("/me", protect, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});


module.exports = router;
