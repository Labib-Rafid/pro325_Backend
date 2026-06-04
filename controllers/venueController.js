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

module.exports = { createVenue, getVenues };