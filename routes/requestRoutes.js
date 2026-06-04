const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createRequest,
    approveRequest
} = require("../controllers/requestController");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", verifyToken, authorizeRoles('representative'), createRequest);
router.put("/approve/:id", verifyToken, authorizeRoles('admin'), approveRequest);

module.exports = router;