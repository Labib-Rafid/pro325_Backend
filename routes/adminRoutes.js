const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getPendingUsers,
    approveUser,
    rejectUser,

    getPendingVenueRequests,
    approveVenueRequest,
    rejectVenueRequest,

    getAllVenueRequests,
    approveBookingRequest,
    rejectBookingRequest
} = require("../controllers/adminController");

router.get("/pending", verifyToken, authorizeRoles("admin"), getPendingUsers);
router.put("/approve/:id", verifyToken, authorizeRoles("admin"), approveUser);
router.put("/reject/:id", verifyToken, authorizeRoles("admin"), rejectUser);


router.get("/venue-requests", verifyToken, authorizeRoles("admin"), getPendingVenueRequests);
router.put("/venue-requests/:id/approve", verifyToken, authorizeRoles("admin"), approveVenueRequest);
router.put("/venue-requests/:id/reject", verifyToken, authorizeRoles("admin"), rejectVenueRequest);


router.get("/booking-requests", verifyToken, authorizeRoles("admin"), getAllVenueRequests);
router.put("/booking-requests/:id/approve", verifyToken, authorizeRoles("admin"), approveBookingRequest);
router.put("/booking-requests/:id/reject", verifyToken, authorizeRoles("admin"), rejectBookingRequest);


module.exports = router;