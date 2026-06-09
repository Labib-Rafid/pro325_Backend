const db = require("../config/db");

const getPendingUsers = (req, res) => {

    const sql = `
        SELECT
            u.id,
            u.name,
            u.email,
            u.registration_number,
            o.name AS organization_name,
            o.type
        FROM users u
        LEFT JOIN organizations o
            ON u.organization_id = o.id
        WHERE u.status = 'pending'
    `;

    db.query(sql, (err, result) => {

        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        res.status(200).json(result);
    });
};


const approveUser = (req, res) => {

    const userId = req.params.id;

    const getUserSql = `
        SELECT id, role, organization_id
        FROM users
        WHERE id = ?
    `;

    db.query(getUserSql, [userId], (err, result) => {
        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        if(result.length === 0){
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        const user = result[0];

        const approveSql = `
            UPDATE users
            SET status = 'approved'
            WHERE id = ?
        `;

        const unapproveOtherReps = () => {
            return new Promise((resolve, reject) => {
                if(user.role !== 'representative' || !user.organization_id){
                    return resolve();
                }

                const sql = `
                    UPDATE users
                    SET status = 'pending'
                    WHERE organization_id = ?
                      AND role = 'representative'
                      AND id <> ?
                      AND status = 'approved'
                `;

                db.query(sql, [user.organization_id, userId], (err) => {
                    if(err) return reject(err);
                    resolve();
                });
            });
        };

        unapproveOtherReps()
            .then(() => {
                db.query(approveSql, [userId], (err, result) => {
                    if(err){
                        return res.status(500).json({
                            message: "Database Error",
                            error: err.message
                        });
                    }

                    res.status(200).json({
                        message: "User approved successfully"
                    });
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            });
    });
};


const rejectUser = (req, res) => {

    const userId = req.params.id;

    const sql = `
        UPDATE users
        SET status = 'rejected'
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        res.status(200).json({
            message: "User rejected successfully"
        });
    });
};


const getPendingVenueRequests = (req, res) => {

    const sql = `
        SELECT *
        FROM venue_creation_requests
        WHERE status = 'pending'
    `;

    db.query(sql, (err, result) => {

        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        res.status(200).json(result);
    });
};

const approveVenueRequest = (req, res) => {

    const requestId = req.params.id;

    const getRequestSql = `
        SELECT *
        FROM venue_creation_requests
        WHERE id = ?
    `;

    db.query(getRequestSql, [requestId], (err, result) => {

        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        if(result.length === 0){
            return res.status(404).json({
                message: "Request not found"
            });
        }

        const request = result[0];

        const insertVenueSql = `
            INSERT INTO venues
            (
                name,
                capacity,
                location
            )
            VALUES (?, ?, ?)
        `;

        db.query(
            insertVenueSql,
            [
                request.venue_name,
                request.capacity,
                request.location
            ],
            (err) => {

                if(err){
                    return res.status(500).json({
                        message: "Venue creation failed",
                        error: err.message
                    });
                }

                const updateSql = `
                    UPDATE venue_creation_requests
                    SET status = 'approved'
                    WHERE id = ?
                `;

                db.query(updateSql, [requestId]);

                res.status(200).json({
                    message: "Venue request approved"
                });

            }
        );

    });

};

const rejectVenueRequest = (req, res) => {

    const requestId = req.params.id;

    const sql = `
        UPDATE venue_creation_requests
        SET status = 'rejected'
        WHERE id = ?
    `;

    db.query(sql, [requestId], (err) => {

        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        res.status(200).json({
            message: "Venue request rejected"
        });
    });
};

const getAllVenueRequests = (req, res) => {

    // const sql = `
    //     SELECT *
    //     FROM venue_requests
    //     WHERE status = 'pending'
    //     ORDER BY event_date ASC, start_time ASC
    // `;

    const sql = `
        SELECT
            vr.*,
            o.name AS organization_name,
            v.name AS venue_name
        FROM venue_requests vr
        JOIN organizations o
            ON vr.organization_id = o.id
        JOIN venues v
            ON vr.venue_id = v.id
        WHERE vr.status = 'pending'
        ORDER BY vr.created_at DESC
    `;

    db.query(sql, (err, result) => {

        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        res.status(200).json(result);
    });
};


const approveBookingRequest = (req, res) => {

    const requestId = req.params.id;

    const sql = `
        UPDATE venue_requests
        SET status = 'approved'
        WHERE id = ?
    `;

    db.query(sql, [requestId], (err) => {

        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        res.status(200).json({
            message: "Booking approved"
        });
    });
};


const rejectBookingRequest = (req, res) => {

    const requestId = req.params.id;

    const sql = `
        UPDATE venue_requests
        SET status = 'rejected'
        WHERE id = ?
    `;

    db.query(sql, [requestId], (err) => {

        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        res.status(200).json({
            message: "Booking rejected"
        });
    });
};

//Seperate Approved and Rejected Requests From Approved Requests

const getApprovedVenueRequests = (req, res) => {

    const sql = `
        SELECT *
        FROM venue_requests
        WHERE status = 'approved'
        ORDER BY event_date ASC, start_time ASC
    `;

    db.query(sql, (err, result) => {
        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

const getRejectedVenueRequests = (req, res) => {

    const sql = `
        SELECT *
        FROM venue_requests
        WHERE status = 'rejected'
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {
        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    });
};


module.exports = {
    getPendingUsers,
    approveUser,
    rejectUser,

    getPendingVenueRequests,
    approveVenueRequest,
    rejectVenueRequest,

    getAllVenueRequests,
    approveBookingRequest,
    rejectBookingRequest,

    getApprovedVenueRequests,
    getRejectedVenueRequests
};