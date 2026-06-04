const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createVenue,
    getVenues
} = require("../controllers/venueController");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", verifyToken, authorizeRoles("admin"), createVenue);
router.get("/", verifyToken, getVenues);

module.exports = router;