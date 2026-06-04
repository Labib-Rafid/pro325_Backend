const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createRequest,
    requestNewVenue
} = require("../controllers/requestController");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/booking", verifyToken, authorizeRoles('representative'), createRequest);
router.post("/new-venue", verifyToken, authorizeRoles('representative'), requestNewVenue);

// router.put("/approve/:id", verifyToken, authorizeRoles('admin'), approveRequest);

module.exports = router;