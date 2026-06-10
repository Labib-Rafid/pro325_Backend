const db = require("../config/db");

const createNotification = (
    userId,
    title,
    message,
    type = "system",
    link = null
) => {

    const sql = `
        INSERT INTO notifications
        (
            user_id,
            title,
            message,
            type,
            link
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userId,
            title,
            message,
            type,
            link
        ]
    );
};

module.exports = createNotification;