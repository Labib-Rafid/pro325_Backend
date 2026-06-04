const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createVenue,
    getVenues,
    updateVenue,
    deleteVenue
} = require("../controllers/venueController");

router.post("/", verifyToken, authorizeRoles("admin"), createVenue);
router.get("/", verifyToken, getVenues);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateVenue);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteVenue);

module.exports = router;