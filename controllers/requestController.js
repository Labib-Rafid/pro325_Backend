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
            message: "Time slot already booked"
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

// const approveRequest = (req, res) => {
//     db.query(
//         "UPDATE venue_requests SET status='approved' WHERE id=?",
//         [req.params.id],
//         (err) => {
//             if (err) return res.status(500).json(err);
//             res.json({ message: "Approved" });
//         }
//     );
// };



module.exports = {
    createRequest,
    requestNewVenue
    // approveRequest
};