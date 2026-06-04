const db = require("../config/db");

const createVenue = (req, res) => {
    const { name, capacity, location } = req.body;

    db.query(
        "INSERT INTO venues (name, capacity, location) VALUES (?, ?, ?)",
        [name, capacity, location],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Venue created" });
        }
    );
};

const getVenues = (req, res) => {
    db.query("SELECT * FROM venues", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

const updateVenue = (req, res) => {

    const { id } = req.params;

    const {
        name,
        capacity,
        location,
        status
    } = req.body;

    const sql = `
        UPDATE venues
        SET
            name = ?,
            capacity = ?,
            location = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            capacity,
            location,
            status,
            id
        ],
        (err, result) => {

            if(err){
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if(result.affectedRows === 0){
                return res.status(404).json({
                    message: "Venue Not Found"
                });
            }

            res.status(200).json({
                message: "Venue Updated Successfully"
            });

        }
    );
};

const deleteVenue = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM venues
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if(err){
            return res.status(500).json({
                message: "Database Error",
                error: err.message
            });
        }

        if(result.affectedRows === 0){
            return res.status(404).json({
                message: "Venue Not Found"
            });
        }

        res.status(200).json({
            message: "Venue Deleted Successfully"
        });

    });
};

module.exports = { createVenue, getVenues, updateVenue, deleteVenue };