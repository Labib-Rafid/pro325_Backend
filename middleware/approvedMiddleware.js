const db = require("../config/db");

const isApproved = (req, res, next) => {

    const sql = `
        SELECT status
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [req.user.id], (err, result) => {

        if(err){
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if(result.length === 0){
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        if(result[0].status !== "approved"){
            return res.status(403).json({
                message: "Account Not Verified"
            });
        }

        next();
    });
};

module.exports = isApproved;