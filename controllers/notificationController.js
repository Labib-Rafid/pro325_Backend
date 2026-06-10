const db = require("../config/db");

const getNotifications = (req, res) => {

    const sql = `
        SELECT *
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(
        sql,
        [req.user.id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
};

const markAsRead = (req, res) => {

    const sql = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            req.params.id,
            req.user.id
        ],
        (err) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Notification marked as read"
            });
        }
    );
};

const markAllAsRead = (req, res) => {

    const sql = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [req.user.id],
        (err) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "All notifications marked as read"
            });
        }
    );
};

const clearAllNotifications = (req, res) => {

    const sql = `
        DELETE FROM notifications
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [req.user.id],
        (err) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Notifications cleared"
            });
        }
    );
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications
};