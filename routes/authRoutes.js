const express = require("express");

const {registerUser, loginUser, listOrganizations} = require("../controllers/authController");

const router = express.Router();

router.get("/organizations", listOrganizations);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;