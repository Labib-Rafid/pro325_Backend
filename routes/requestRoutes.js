const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createRequest,
    requestNewVenue,
    getMyRequests
} = require("../controllers/requestController");
const authorizeRoles = require("../middleware/roleMiddleware");
const isApproved = require("../middleware/approvedMiddleware");


router.get("/my-requests", verifyToken, getMyRequests);
router.post("/booking", verifyToken, isApproved, authorizeRoles('representative'), createRequest);
router.post("/new-venue", verifyToken, isApproved, authorizeRoles('representative'), requestNewVenue);


module.exports = router;