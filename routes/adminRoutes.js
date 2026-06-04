const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getPendingUsers,
    approveUser,
    rejectUser
} = require("../controllers/adminController");

router.get("/pending", verifyToken, authorizeRoles("admin"), getPendingUsers);
router.put("/approve/:id", verifyToken, authorizeRoles("admin"), approveUser);
router.put("/reject/:id", verifyToken, authorizeRoles("admin"), rejectUser);

module.exports = router;