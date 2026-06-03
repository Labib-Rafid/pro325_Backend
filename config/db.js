const mysql = require("mysql2");


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true
});


pool.getConnection((err, connection) => {
    if (err) {
        console.error("DB Connection Failed! Error details:", err.message);
    } else {
        console.log("Mysql Connection Pool Initialized Successfully!");
        connection.release();
    }
});


module.exports = pool;