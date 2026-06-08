const db = require("../config/db");

const checkClash = (venue_id, date, start, end) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM venue_requests
            WHERE venue_id=?
            AND event_date=?
            AND status='approved'
            AND (
                (start_time < ? AND end_time > ?) OR
                (start_time < ? AND end_time > ?)
            )
        `;

        db.query(sql,
            [venue_id, date, end, start, start, end],
            (err, result) => {
                if (err) reject(err);
                else resolve(result.length > 0);
            }
        );
    });
};

const createRequest = async (req, res) => {

    const { venue_id, event_name, event_date, start_time, end_time, purpose } = req.body;

    const userId = req.user.id;
    const orgId = req.user.organization_id;

    const clash = await checkClash(
        venue_id,
        event_date,
        start_time,
        end_time
    );

    if (clash) {
        return res.status(400).json({
            message: "Already taken"
        });
    }

    db.query(
        `INSERT INTO venue_requests
        (organization_id, requested_by, venue_id, event_name, purpose, event_date, start_time, end_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orgId, userId, venue_id, event_name, purpose, event_date, start_time, end_time],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Request submitted" });
        }
    );
};


const requestNewVenue = (req, res) => {
    const {
        venue_name,
        location,
        capacity,
        reason
    } = req.body;

    const sql = `
        INSERT INTO venue_creation_requests
        (
            requested_by,
            venue_name,
            location,
            capacity,
            reason
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            req.user.id,
            venue_name,
            location,
            capacity,
            reason
        ],
        (err) => {
            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Venue creation request submitted"
            });
        }
    );
};

const getMyRequests = (req, res) => {
    const userId = req.user.id;

    const bookingsSql = `
        SELECT
            vr.*,
            v.name AS venue_name,
            o.name AS organization_name
        FROM venue_requests vr
        JOIN venues v
            ON vr.venue_id = v.id
        JOIN organizations o
            ON vr.organization_id = o.id
        WHERE vr.requested_by = ?
        ORDER BY vr.created_at DESC
    `;

    const venueRequestsSql = `
        SELECT *
        FROM venue_creation_requests
        WHERE requested_by = ?
        ORDER BY created_at DESC
    `;

    db.query(bookingsSql, [userId], (err, bookings) => {
        if (err) {
            return res.status(500).json({
                message: "Unable to load booking requests.",
                error: err.message
            });
        }

        db.query(venueRequestsSql, [userId], (err, venueRequests) => {
            if (err) {
                return res.status(500).json({
                    message: "Unable to load venue requests.",
                    error: err.message
                });
            }

            res.status(200).json({ bookings, venueRequests });
        });
    });
};


module.exports = {
    createRequest,
    requestNewVenue,
    getMyRequests,
};