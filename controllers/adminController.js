const db = require("../config/db");

const getPendingUsers = (req, res) => {
    db.query(
        "SELECT * FROM users WHERE status='pending'",
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
};

const approveUser = (req, res) => {
    db.query(
        "UPDATE users SET status='approved' WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Approved" });
        }
    );
};

const rejectUser = (req, res) => {
    db.query(
        "UPDATE users SET status='rejected' WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Rejected" });
        }
    );
};

module.exports = {
    getPendingUsers,
    approveUser,
    rejectUser
};